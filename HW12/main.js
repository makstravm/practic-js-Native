function createStore(reducer) {
  let state = reducer(undefined, {}) //стартовая инициализация состояния, запуск редьюсера со state === undefined
  let cbs = []                     //массив подписчиков

  const getState = () => state            //функция, возвращающая переменную из замыкания
  const subscribe = cb => (cbs.push(cb),   //запоминаем подписчиков в массиве
    () => cbs = cbs.filter(c => c !== cb)) //возвращаем функцию unsubscribe, которая удаляет подписчика из списка

  const dispatch = action => {
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

function reducer(state, { type, ГДЕ, ШО, СКОКА, БАБЛО }) { //объект action деструктуризируется на три переменных
  if (!state) { //начальная уборка в ларьке:
    return {
      бухло: {
        пиво: { count: 100, price: 25 },
        святая: { count: 100, price: 35 },
        ректифика: { count: 30, price: 50 },
      },
      загрызнуть: {
        камса: { count: 80, price: 15 },
        чипсы: { count: 100, price: 20 },
        огурчик: { count: 35, price: 5 },
        раки: { count: 15, price: 100 },
      },
      остальное: {
        сиги: { count: 100, price: 35 },
        'Даме шоколад': { count: 100, price: 35 },
      },
      касса: 0,
      'Моя заначка': 1500//при покупках увеличивается
    }
  }
  if (type === 'КУПИТЬ') {
    if ((state[ГДЕ][ШО].count - СКОКА) < 0 || (state['Моя заначка'] - БАБЛО) < 0) {
      return state
    } else {
      return {
        ...state, //берем все что было из ассортимента
        [ГДЕ]: {
          ...state[ГДЕ],
          [ШО]: {
            ...state[ГДЕ][ШО],
            count: state[ГДЕ][ШО].count - СКОКА
          }
        },
        касса: state.касса + БАБЛО,
        'Моя заначка': state['Моя заначка'] - БАБЛО
        //и уменьшаем то, что покупается на количество
      }
    }
    //если тип action - КУПИТЬ, то:
    //проверить на:
    //наличие товара как такового (есть ли ключ в объекте)
    //количество денег в action
    //наличие нужного количества товара.
    //и только при соблюдении этих условий обновлять state. 
  }
  return state //если мы не поняли, что от нас просят в `action` - оставляем все как есть
}

const store = createStore(reducer)
const table = document.createElement('table')
let flag = true
for (const key in store.getState()) {
  let optgroup = document.createElement('optgroup')
  optgroup.label = key
  for (const deepkey in store.getState()[key]) {
    let option = document.createElement('option')
    option.setAttribute('name', key)
    option.innerText = deepkey
    optgroup.append(option)
    createTable(key, deepkey, flag)
    flag = false
  }
  if (key === 'касса') createCasaCash(kassa, key)
  else if (key === 'Моя заначка') createCasaCash(myCash, key)
  else {
    goods.append(optgroup)
    flag = true
  }
}

const купи = (ГДЕ, ШО, СКОКА, БАБЛО) => ({ type: 'КУПИТЬ', ГДЕ, ШО, СКОКА, БАБЛО })

buy.onclick = () => {
  store.dispatch(купи(findSelectedOption(goods, goods.value), goods.value, quantity.value, store.getState()[findSelectedOption(goods, goods.value)][goods.value].price * quantity.value))
}

const unsubscribe = store.subscribe(() => console.log(store.getState()))

function findSelectedOption(el, selected) {
  for (const key in [...el.children]) {
    for (const deepKey in [...el.children][key].children) {
      if (selected === [...el.children][key].children[deepKey].value) {
        return [...el.children][key].children[deepKey].getAttribute('name')
      }
    }
  }
}

function createTable(key, deepkey, flag) {
  table.setAttribute('border', '1')
  const tr = document.createElement('tr')
  const th = document.createElement('th')
  const tdName = document.createElement('td')
  const tdCount = document.createElement('td')
  const tdPrice = document.createElement('td')
  flag ? th.innerText = key : th.innerText = ''
  tdName.innerText = deepkey
  tdPrice.innerText = `Цена ${store.getState()[key][deepkey].price} грн`
  tdCount.innerText = `${store.getState()[key][deepkey].count} шт`
  store.subscribe(() => tdCount.innerText = store.getState()[key][deepkey].count)
  tr.append(th)
  tr.append(tdName)
  tr.append(tdPrice)
  tr.append(tdCount)
  table.append(tr)
  products.append(table)
}

function createCasaCash(el, key) {
  const tableCasa = document.createElement('table')
  tableCasa.setAttribute('border', '1')
  const tr = document.createElement('tr')
  const th = document.createElement('th')
  const td = document.createElement('td')
  th.innerText = key
  td.innerText = store.getState()[key]
  store.subscribe(() => td.innerText = store.getState()[key])
  tr.append(th)
  tr.append(td)
  tableCasa.append(tr)
  el.append(tableCasa)
}