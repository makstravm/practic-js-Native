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

const combineReducer = combineReducers({ promise: promiseReducer, auth: authReducer })

const store = createStore(combineReducer)

const actionAuthLogin = token => ({ type: 'AUTH_LOGIN', token })
const actionAuthLogout = () => ({ type: 'AUTH_LOGOUT' })


function promiseReducer(state = {}, { type, status, payload, error, name }) {
    if (type === 'PROMISE') {
        return {
            ...state,
            [name]: { status, payload, error }
        }
    }
    return state;
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
    actionPromise('orderGood', gql(`query Order{
                                        OrderGoodFind(query:"[{}]"){
                                        good{ name } _id total price count
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
        order() {
            store.dispatch(actionMyOrders())
        }
    }
    if (route in routes)
        routes[route]()
}

window.onhashchange()

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
// noAuthorization()
// userAuthorization('login')

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

store.subscribe(() => {
    const { catById } = store.getState().promise
    const [, route, _id] = location.hash.split('/')
    if (catById?.payload && route === 'category') {
        const { name, subCategories } = catById.payload
        main.innerHTML = `<h1>${name}</h1> `
        subCategories ? subCategories.map(s => {
            const link = document.createElement('a')
            link.href = `#/category/${s._id}`
            link.innerText = s.name
            main.append(link)
        }) : ''
        for (const { _id, name, price, images } of catById.payload.goods) {
            const card = document.createElement('div')
            card.innerHTML = `<h2>${name}</h2>
                            <img src="${backURL}/${images[0].url}" />
                            <strong>${price}</strong>`
            const link = document.createElement('a')
            link.href = `#/good/${_id}`
            link.innerText = name
            card.append(link)
            main.append(card)
        }
    }
})
store.subscribe(() => {
    const { orderGood } = store.getState().promise
    const [, route, _id] = location.hash.split('/')
    if (orderGood?.payload && route === 'order') {
        main.innerHTML = ''
        const table = document.createElement('table')
        for (const { good, price, count, total } of orderGood.payload) {
            if (good !== null) {

                const tr = document.createElement('tr')
                const tdName = document.createElement('td')
                const tdPrice = document.createElement('td')
                const tdCount = document.createElement('td')
                const tdTotal = document.createElement('td')

                tdName.innerText = good.name
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

store.subscribe(() => {
    const { goodById } = store.getState().promise
    const [, route, _id] = location.hash.split('/')

    if (goodById?.payload && route === 'good') {
        main.innerHTML = ''
        const { name, description, price, images } = goodById.payload[0]
        main.innerHTML = `
        <div div class="product" >
            <div class="product__img">
                <img src="${backURL}/${images[0].url}" />
            </div>
            <div class="product__inner">
                <h2 class="product_title">${name}</h2>
                <p class="product__price"> <strong>${price}</strong></p>
                <p class="product__description">
                    <span>Обзор: ${description}</span>
                </p>
            </div>
        </div>`
    }
})

store.subscribe(() => {
    const { auth } = store.getState()
    const [, route, _id] = location.hash.split('/')

    user.innerHTML = ''
    overlay.style.display = 'none'

    if (auth?.payload) {
        const logOut = document.createElement('button')
        const order = document.createElement('a')
        order.classList.add('order')
        logOut.innerText = 'Log Out'
        logOut.onclick = () => {
            store.dispatch(actionAuthLogout())
        }
        order.href = "#/order"
        order.innerText = 'order'
        user.innerHTML = `<h1> Hello, ${auth.payload.sub.login}</h1>
        <div id="btn"></div>
        <div id="orderBox"></div>`
        btn.append(logOut)
        orderBox.append(order)
    } else if (route === 'login' || route === 'register') {
        userAuthorizationFields(route)
        noAuthorization()
    } else if (user.children.length === 0) {
        noAuthorization()
    }
})


console.log(store.getState());
store.subscribe(() => console.log(store.getState()))


// store.dispatch(actionPromise('', delay(1000)))
// store.dispatch(actionPromise('delay2000', delay(2000)))
// store.dispatch(actionPromise('luke', fetch('https://swapi.dev/api/people/1/').then(res => res.json())))
