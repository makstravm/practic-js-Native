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

const store = createStore(promiseReducer)
store.subscribe(() => console.log(store.getState()))

//const delay = ms => new Promise(ok => setTimeout(() => ok(ms), ms))

const getGQL = url =>
    async (query, variables = {}) => {
        let obj = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
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

const actionCatById = (_id) =>  //добавить подкатегории
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

//actionGoodById по аналогии

const actionGoodById = (_id) =>  //добавить подкатегории
    actionPromise('goodById', gql(`query goodByID($q: String) {
                                    GoodFind(query: $q){
 	 	                                name _id  description price images{url}
  }
}`, { q: JSON.stringify([{ _id }]) }))

store.dispatch(actionRootCats())
store.dispatch(actionGoodById())

store.subscribe(() => {
    const { rootCats } = store.getState()
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

window.onhashchange = () => {
    const [, route, _id] = location.hash.split('/')
    const routes = {
        category() {
            store.dispatch(actionCatById(_id))
        },
        good() { //задиспатчить actionGoodById
            store.dispatch(actionGoodById(_id))
        },
    }
    if (route in routes)
        routes[route]()
}

window.onhashchange()

store.subscribe(() => {
    const { catById } = store.getState()
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
    const { goodById } = store.getState()
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



//store.dispatch(actionPromise('', delay(1000)))
//store.dispatch(actionPromise('delay2000', delay(2000)))
//store.dispatch(actionPromise('luke', fetch('https://swapi.dev/api/people/1/').then(res => res.json())))

