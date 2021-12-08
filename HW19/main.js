function createStore(reducer) {
    let state = reducer(undefined, {}) //стартовая инициализация состояния, запуск редьюсера со state === undefined
    let cbs = []                     //массив подписчиков

    const getState = () => state            //функция, возвращающая переменную из замыкания
    const subscribe = cb => (cbs.push(cb),   //запоминаем подписчиков в массиве
        () => cbs = cbs.filter(c => c !== cb)) //возвращаем функцию unsubscribe, которая удаляет подписчика из списка

    const dispatch = action => {
        if (typeof action === 'function') { //если action - не объект, а функция
            return action(dispatch, getState) //запускаем эту функцию и даем ей dispatch и getState для работы
        }
        const newState = reducer(state, action) //пробуем запустить редьюсер
        if (newState !== state) { //проверяем, смог ли редьюсер обработать action
            state = newState //если смог, то обновляем state 
            for (let cb of cbs) cb() //и запускаем подписчиков
        }
    }

    return {
        getState, //добавление функции getState в результирующий объект
        dispatch,
        subscribe //добавление subscribe в объект
    }
}

const delay = ms => new Promise(ok => setTimeout(() => ok(ms), ms))

const jwtDecode = token => {
    try {
        let arrToken = token.split('.')
        let base64Token = atob(arrToken[1])
        return JSON.parse(base64Token)
    }
    catch (e) {
        console.log('Лажа, Бро ' + e);
    }
}

function authReducer(state, { type, token }) {
    if (!state) {
        if (localStorage.authToken) {
            type = 'AUTH_LOGIN'
            token = localStorage.authToken
        } else state = {}
    }
    if (type === 'AUTH_LOGIN') {
        localStorage.setItem('authToken', token)
        let payload = jwtDecode(token)
        if (typeof payload === 'object') {
            return {
                ...state,
                token,
                payload
            }
        } else return state
    }
    if (type === 'AUTH_LOGOUT') {
        localStorage.removeItem('authToken')
        return {}
    }
    return state
}

function cartReducer(state = {}, { type, good = {}, count = 1 }) {
    const { _id } = good
    const types = {
        CART_ADD() {
            count = +count
            if (!count) return state
            return {
                ...state,
                [_id]: {
                    good,
                    count: count + (state[_id]?.count || 0)
                }
            }
        },
        CART_CHANGE() {
            count = +count
            if (!count) return state
            return {
                ...state,
                [_id]: {
                    good,
                    count: count
                }
            }
        },
        CART_REMOVE() {
            let { [_id]: remove, ...newState } = state
            return {
                ...newState
            }
        },
        CART_CLEAR() {
            return {}
        },
    }
    if (type in types) {
        return types[type]()
    }
    return state
}

function promiseReducer(state = {}, { type, status, payload, error, name }) {
    if (type === 'PROMISE') {
        return {
            ...state,
            [name]: { status, payload, error }
        }
    }
    return state;
}

const combineReducers = (reducers) => (state = {}, action) => {
    const newState = {}
    for (const [reducerName, reducer] of Object.entries(reducers)) {
        const newSubState = reducer(state[reducerName], action)
        if (newSubState !== state[reducerName]) {
            newState[reducerName] = newSubState
        }
    }
    if (Object.keys(newState).length !== 0) {
        return { ...state, ...newState }
    }
    else {
        return state
    }
}

const combineReducer = combineReducers({ promise: promiseReducer, auth: authReducer, cart: cartReducer })

const actionAddCart = (good, count) => ({ type: 'CART_ADD', good, count })
const actionChangeCart = (good, count) => ({ type: 'CART_CHANGE', good, count })
const actionRemoveCart = good => ({ type: 'CART_REMOVE', good })
const actionCleanCart = () => ({ type: 'CART_CLEAR' })

const actionAuthLogin = token => ({ type: 'AUTH_LOGIN', token })
const actionAuthLogout = () => ({ type: 'AUTH_LOGOUT' })


const actionOrder = () =>
    async (dispatch, getState) => {
        let { cart } = getState()
        const orderGoods = Object.entries(cart).map(([_id, { count }]) => ({ good: { _id }, count }))
        let result = await dispatch(actionPromise('order', gql(`
                    mutation newOrder($order:OrderInput){
                      OrderUpsert(order:$order)
                        { _id total }
                    }
            `, { order: { orderGoods } })))

        if (result?._id) {
            dispatch(actionCleanCart())
        }
    }

const actionPending = name => ({ type: 'PROMISE', status: 'PENDING', name })
const actionResolved = (name, payload) => ({ type: 'PROMISE', status: 'RESOLVED', name, payload })
const actionRejected = (name, error) => ({ type: 'PROMISE', status: 'REJECTED', name, error })

const actionPromise = (name, promise) =>
    async dispatch => {
        dispatch(actionPending(name))
        try {
            let data = await promise
            dispatch(actionResolved(name, data))
            return data
        }
        catch (error) {
            dispatch(actionRejected(name, error))
        }
    }

const actionRootCats = () =>
    actionPromise('rootCats', gql(`query {
            CategoryFind(query: "[{\\"parent\\":null}]"){
                _id name
            }
        }`))

const actionCatById = (_id) =>
    actionPromise('catById', gql(`query catById($q: String){
            CategoryFindOne(query: $q){
                subCategories{name, _id}
                _id name goods {
                    _id name price images {
                        url
                    }
                }
            }
        }`, { q: JSON.stringify([{ _id }]) }))

const actionGoodById = (_id) =>  //добавить подкатегории
    actionPromise('goodById', gql(`query goodByID($q: String) {
                                        GoodFind(query: $q){
                                            name _id  description price images{url}
                                        }
        }`, {
        q: JSON.stringify([{ _id }])
    }))

const actionLogin = (login, password) =>
    actionPromise('login', gql(`query NameForMe1($login:String, $password:String){
            login(login:$login, password:$password)
        }`, { login, password }))

const actionMyOrders = () =>
    actionPromise('myOrders', gql(`query Order{
                                            OrderGoodFind(query:"[{}]"){
                                            good{ name _id} _id total price count
                                        }
    }`, {}))

const actionFullLogin = (login, password) =>
    async dispatch => {
        let token = await dispatch(actionLogin(login, password))
        if (token) {
            dispatch(actionAuthLogin(token))
        }
    }

const actionRegister = (login, password) =>
    actionPromise('register', gql(`
                mutation reg($login:String, $password:String){
                UserUpsert(user:{
                    login:$login,
                        password:$password,
                        nick:$login}){
                _id login
                }
            }
            `, { login, password }))

const actionFullRegister = (login, password) =>
    async dispatch => {
        await actionRegister(login, password)
        let token = await dispatch(actionLogin(login, password))
        if (token) {
            dispatch(actionAuthLogin(token))
        }
    }

const store = createStore(combineReducer)

const getGQL = url =>
    async (query, variables = {}) => {
        let obj = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: localStorage.authToken ? 'Bearer ' + localStorage.authToken : {},
            },
            body: JSON.stringify({ query, variables })
        })
        let a = await obj.json()
        if (!a.data && a.errors)
            throw new Error(JSON.stringify(a.errors))
        return a.data[Object.keys(a.data)[0]]
    }

const backURL = 'http://shop-roles.asmer.fs.a-level.com.ua'

const gql = getGQL(backURL + '/graphql');

store.dispatch(actionRootCats())
store.dispatch(actionGoodById())
// store.dispatch(actionAuthLogin(token))
// store.dispatch(actionPromise('delay2000', delay(1000)))

window.onhashchange = () => {
    const [, route, _id] = location.hash.split('/')
    const routes = {
        category() {
            store.dispatch(actionCatById(_id))
        },
        good() { //задиспатчить actionGoodById
            store.dispatch(actionGoodById(_id))
        },
        login() {
            userAuthorizationFields(route)
        },
        register() {
            userAuthorizationFields(route)
        },
        order() { //задиспатчить actionGoodById
            renderOrder()
        },
        dashboard() {
            store.dispatch(actionMyOrders())
        }
    }
    if (route in routes)
        routes[route]()
    else {
        startPage()
    }
}

window.onhashchange()

function startPage() {
    main.innerHTML = ""
}

//поля авторизации

function userAuthorizationFields(key) {
    const userBox = document.createElement('div')
    userBox.setAttribute('id', 'userBox')

    const h2 = document.createElement('h2')

    const inputNick = document.createElement('input')
    const inputPassword = document.createElement('input')
    inputNick.type = 'text'
    inputPassword.type = 'password'

    const btnEnter = document.createElement('a')
    const btnClose = document.createElement('a')

    btnClose.onclick = () => {
        userBox.remove()
        overlay.style.display = 'none'
    }
    btnClose.innerText = 'X'
    btnClose.classList.add('close')
    btnClose.href = '#'
    btnEnter.href = '#'
    overlay.style.display = 'block'

    if (key === 'login') {
        h2.innerText = 'Log In'
        btnEnter.innerText = 'Log In'
        btnEnter.setAttribute('id', 'logIn')
        btnEnter.onclick = () => store.dispatch(actionFullLogin(inputNick.value, inputPassword.value))
    } else {
        h2.innerText = 'Register'
        btnEnter.innerText = 'Register'
        btnEnter.setAttribute('id', 'register')
        btnEnter.onclick = () => store.dispatch(actionFullRegister(inputNick.value, inputPassword.value))
    }
    userBox.append(h2)
    userBox.append(inputNick)
    userBox.append(btnClose)
    userBox.append(inputPassword)
    userBox.append(btnEnter)
    user.append(userBox)
}

//ссылки когда не авторизирован
function noAuthorization() {
    const loginLink = document.createElement('a')
    loginLink.classList.add('user__link')
    loginLink.innerText = 'Log In'
    loginLink.href = '#/login'

    const registerLink = document.createElement('a')
    registerLink.href = '#/register'
    registerLink.innerText = 'Register'
    registerLink.classList.add('user__link')

    user.append(loginLink)
    user.append(registerLink)
}

// страница заказа

function renderOrder() {
    const { cart, auth } = store.getState()
    const [, route, _id] = location.hash.split('/')
    main.innerHTML = ''

    if (Object.keys(cart).length !== 0 && route === 'order') {

        const orderTop = document.createElement('div')
        orderTop.classList.add('order-top')

        const orderCleanBtn = document.createElement('button')
        orderCleanBtn.classList.add('clean-order')
        orderCleanBtn.innerText = 'Clean order'
        orderCleanBtn.onclick = () => {
            store.dispatch(actionCleanCart())
            main.innerHTML = ''
        }
        orderTop.append(orderCleanBtn)
        main.append(orderTop)

        for (const key in cart) {
            const { _id, name, price, images } = cart[key].good
            const divContainer = document.createElement('div')
            divContainer.classList.add('product-order__inner')

            const img = document.createElement('img')
            img.src = `${backURL}/${images[0].url}`

            const a = document.createElement('a')
            a.href = `#/good/${_id}`
            a.innerText = name

            const input = document.createElement('input')
            input.type = 'number'
            input.min = '1'
            input.value = cart[key].count
            input.oninput = () => {
                spanTotal.innerHTML = `Сумма: <strong>${price * +input.value}$</strong>`
                store.dispatch(actionChangeCart(cart[key].good, input.value))
            }

            const spanPrice = document.createElement('span')
            spanPrice.innerHTML = `Цена: ${price} $`

            const spanTotal = document.createElement('span')
            spanTotal.innerHTML = `Сумма: <strong>${price * +input.value} $</strong>`

            const buttonRemove = document.createElement('button')
            buttonRemove.innerText = 'x'
            buttonRemove.onclick = () => {
                store.dispatch(actionRemoveCart(cart[key].good))
                divContainer.remove()
            }

            divContainer.append(img)
            divContainer.append(a)
            divContainer.append(spanPrice)
            divContainer.append(input)
            divContainer.append(spanTotal)
            divContainer.append(buttonRemove)
            main.append(divContainer)
        }

        const orderSentBtn = document.createElement('button')
        orderSentBtn.innerText = 'Заказать'
        orderSentBtn.classList.add('order-sent__btn')

        if (auth?.token) {
            orderSentBtn.onclick = () => {
                store.dispatch(actionOrder())
                main.innerText = ' Спасибо, заказ оформлен'
            }

        } else orderSentBtn.onclick = () => {
            const err = document.createElement('div')
            err.innerText = 'Sorry, please Log In or Register Now'
            err.style.color = '#ff0000'
            main.prepend(err)
        }

        main.append(orderSentBtn)

    }
}

store.dispatch(actionRootCats())
store.dispatch(actionGoodById())


// рисуем категории

store.subscribe(() => {
    const { rootCats } = store.getState().promise
    if (rootCats?.payload) {
        aside.innerHTML = ''
        for (const { _id, name } of rootCats?.payload) {
            const link = document.createElement('a')
            link.href = `#/category/${_id}`
            link.innerText = name
            aside.append(link)
        }
    }
})

// рисуем продукты категории

store.subscribe(() => {
    const { catById } = store.getState().promise
    const [, route, _id] = location.hash.split('/')
    if (catById?.payload && route === 'category') {
        const { name, subCategories } = catById.payload
        main.innerHTML = `<h1>${name}</h1> `
        const subCatDiv = document.createElement('div')
        subCatDiv.classList.add('sub-catigories')
        subCategories ? subCategories.map(s => {
            const link = document.createElement('a')
            link.href = `#/category/${s._id}`
            link.innerText = s.name
            subCatDiv.append(link)
        }) : ''
        main.append(subCatDiv)
        for (const good of catById.payload.goods) {
            const { _id, name, price, images } = good
            const product = document.createElement('div')
            product.classList.add('product')
            const btn = document.createElement('button')
            btn.innerText = '+'
            let urlImage = images ? images[0].url : ''
            product.innerHTML = `<a class="product-title__link" href="#/good/${_id}">${name}</a>
                                 <div class="product__inner">
                                    <img src="${backURL}/${urlImage}" />
                                    <strong> ${price} $</strong>
                                 </div > `
            btn.onclick = () => store.dispatch(actionAddCart(good, 1))
            product.append(btn)
            main.append(product)
        }

    }
})

// отрисовка Истории заказов

store.subscribe(() => {
    const { myOrders } = store.getState().promise
    const [, route, _id] = location.hash.split('/')
    if (myOrders?.payload && route === 'dashboard') {
        main.innerHTML = ''
        const table = document.createElement('table')
        table.setAttribute('border', '2')
        for (const { good, price, count, total } of myOrders.payload) {
            if (good !== null) {

                const tr = document.createElement('tr')
                const tdName = document.createElement('td')
                const tdPrice = document.createElement('td')
                const tdCount = document.createElement('td')
                const tdTotal = document.createElement('td')

                tdName.innerHTML = `<a href = "#/good/${good._id}" > ${good.name}</a > `
                tdPrice.innerText = price
                tdCount.innerText = count
                tdTotal.innerText = total

                tr.append(tdName)
                tr.append(tdPrice)
                tr.append(tdCount)
                tr.append(tdTotal)
                table.append(tr)
            }
        }
        main.append(table)
    }
})

// отрисовка Карточки продукты

store.subscribe(() => {
    const { goodById } = store.getState().promise
    const [, route, _id] = location.hash.split('/')

    if (goodById?.payload && route === 'good') {
        main.innerHTML = ''
        const { name, description, price, images } = goodById.payload[0]
        const btn = document.createElement('button')
        btn.classList.add('productBtn')
        btn.onclick = () => store.dispatch(actionAddCart(goodById.payload[0], 1))
        btn.innerText = '+'
        main.innerHTML = `
                <div class="product-one">
                    <div class="product-one__img">
                            <img src="${backURL}/${images[0].url}" />
                    </div>
                    <div class="product-one__inner">
                        <h2 class="product-one_title">${name}</h2>
                        <p class="product-one__price"> <strong>${price} $</strong></p>
                        <p class="product-one__description">
                            <span>Обзор: ${description}</span>
                        </p>
                    </div>
                </div> `
        main.append(btn)
    }
})

// взависимости от страницы рисуем  Log In / Registration

store.subscribe(() => {
    const { auth } = store.getState()
    const [, route, _id] = location.hash.split('/')

    user.innerHTML = ''
    overlay.style.display = 'none'
    dashboardLink.style.display = 'none'

    if (auth?.payload) {
        const logOutBtn = document.createElement('button')

        logOutBtn.innerText = 'Выйти'
        logOutBtn.onclick = () => {
            store.dispatch(actionAuthLogout())
            store.dispatch(actionCleanCart())
        }

        user.innerHTML = `<h3> Hello, ${auth.payload.sub.login}</h3 >
                <div id="logOut"></div>`

        dashboardLink.style.display = 'block'
        logOut.append(logOutBtn)
    } else if (route === 'login' || route === 'register') {
        userAuthorizationFields(route)
        noAuthorization()
    } else if (user.children.length === 0) {
        noAuthorization()
    }
})

// счетчик корзины

store.subscribe(() => {
    const { cart } = store.getState()
    if (Object.keys(cart).length !== 0) {
        countOrder.style.display = 'flex'
        let sum = Object.entries(cart).map(([, val]) => val.count)
        countOrder.innerHTML = sum.reduce((a, b) => a + b)
    } else {
        countOrder.style.display = 'none'
    }

})


console.log(store.getState());
store.subscribe(() => console.log(store.getState()))


// store.dispatch(actionPromise('', delay(1000)))
// store.dispatch(actionPromise('delay2000', delay(2000)))
// store.dispatch(actionPromise('luke', fetch('https://swapi.dev/api/people/1/').then(res => res.json())))
