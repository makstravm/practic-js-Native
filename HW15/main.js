const getGQL = url =>
  (query, variables) => fetch(url, {
    //метод
    method: 'POST',
    headers: {
      //заголовок content-type
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query, variables })
    //body с ключами query и variables

  }).then(res => res.json()).then(data => {
    //расковырять data, если все ок - отдать data.login или data.CategoryFindOne, или шо там еще
    //если есть errors, то выбросить исключение и тем самым зареджектить промис
    return data
  })

const gql = getGQL('http://shop-roles.asmer.fs.a-level.com.ua/graphql');

(async () => {
  try {
    console.log((await gql(`
    query NameForMe1($login:String, $password:String){
        login(login:$login, password:$password)
    }
`, { login: 'tst', password: '123' })).data.login)
  } catch (error) {
    console.log(error);
  }
})()




//Светофор

const delay = ms => new Promise(ok => setTimeout(() => ok(ms), ms))

async function trafficLight(delayG, delayY, delayR) {
  while (true) {
    red.classList.remove('active')
    green.classList.add('active')
    await delay(delayG)
    green.classList.remove('active')
    yellow.classList.add('active')
    await delay(delayY)
    yellow.classList.remove('active')
    red.classList.add('active')
    await delay(delayR)
  }
}
trafficLight(3000, 200, 3000,)

//  Светофор  Stage 2

function delay2(ms, el) {
  return new Promise(ok => {
    let count = ms / 1000;
    (counter = (c) => {
      el.classList.add('active')
      el.innerText = count
      if (count > 0) setTimeout(() => counter(count--), 1000);
      else {
        el.innerText = ''
        el.classList.remove('active')
        return ok()
      }
    })()
  })
}

async function trafficLight2(delayG, delayY, delayR) {
  while (true) {
    await delay2(delayG, green2)
    await delay2(delayY, yellow2)
    await delay2(delayR, red2)
  }
}

trafficLight2(5000, 2000, 5000)

//domEventPromise

function domEventPromise(el, eventName) {
  return new Promise(resolve => {
    el.addEventListener(eventName, (e) => {
      el.disabled = true
      el.removeEventListener('click', () => { })
      return resolve(e)
    })
  })
}

domEventPromise(knopka, 'click').then(e => console.log('event click happens', e))

// PedestrianTrafficLight


function delay3(ms, el) {
  return new Promise(ok => {
    let count = ms / 1000;
    (counter3 = (c) => {
      el.classList.add('active')
      el.innerText = count
      if (count > 0) setTimeout(() => counter3(count--), 1000);
      else {
        el.innerText = ''
        el.classList.remove('active')
        return ok()
      }
    })()
  })
}

async function trafficLight3(delayG, delayY, delayR, ) {
  while (true) {
    await delay3(delayG, green3)
    await delay3(delayY, yellow3)
    await delay3(delayR, red3)

  }
}

trafficLight3(5000, 2000, 5000)
