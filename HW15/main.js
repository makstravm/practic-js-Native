const getGQL = url =>
  async (query, variables) => {

    let obj = await fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query, variables })
    })
    let obj = await obj.json()
    if (!obj.data && obj.errors) throw new Error(JSON.stringify(obj.errors))
    return obj.data[Object.keys(obj.data)[0]]
  }

const gql = getGQL('http://shop-roles.asmer.fs.a-level.com.ua/graphql');

(async () => {
  console.log((await gql(`
    query NameForMe1($login:String, $password:String){
        login(login:$login, password:$password)
    }
`, { login: 'Kabina', password: '12345' })))
})()


// //Светофор

// const delay = ms => new Promise(ok => setTimeout(() => ok(ms), ms))

// async function trafficLight(delayG, delayY, delayR) {
//   while (true) {
//     red.classList.remove('active')
//     green.classList.add('active')
//     await delay(delayG)
//     green.classList.remove('active')
//     yellow.classList.add('active')
//     await delay(delayY)
//     yellow.classList.remove('active')
//     red.classList.add('active')
//     await delay(delayR)

//   }
// }
// trafficLight(3000, 200, 3000,)

// //  Светофор  Stage 2

// function delay2(ms, el) {
//   return new Promise(ok => {
//     let count = ms / 1000;
//     (counter = (c) => {
//       el.classList.add('active')
//       el.innerText = count
//       if (count > 0) setTimeout(() => counter(count--), 1000);
//       else {
//         el.innerText = ''
//         el.classList.remove('active')
//         return ok()
//       }
//     })()
//   })
// }

// async function trafficLight2(delayG, delayY, delayR) {
//   while (true) {
//     await delay2(delayG, green2)
//     await delay2(delayY, yellow2)
//     await delay2(delayR, red2)
//     await delay2(delayY, yellow2)
//   }
// }

// trafficLight2(5000, 2000, 5000)

// //domEventPromise

// function domEventPromise(el, eventName) {
//   return new Promise(resolve => {
//     el.addEventListener(eventName, (e) => {

//       el.disabled = true
//       el.removeEventListener('click', () => { })
//       return resolve(e)
//     })
//   })
// }

// domEventPromise(knopka, 'click').then(e => console.log('event click happens', e))

// // PedestrianTrafficLight


// function domEventPromise2(el, eventName,) {
//   return new Promise(resolve => {
//     el.addEventListener(eventName, (e) => {
//       return resolve(e)
//     })
//   })
// }

// async function trafficLight3(delayG, delayR,) {
//   while (true) {
//     red3.classList.remove('active')
//     green3.classList.add('active')
//     await delay(delayG)
//     green3.classList.remove('active')
//     red3.classList.add('active')
//     await delay(delayR * .25)
//     await Promise.race([domEventPromise2(btn, 'click',).then(() => delay(0)), delay(delayR * .75)])
//   }
// }
// trafficLight3(3000, 5000,)

// //speedTest


// async function speedtest(getPromise, count = 1, parallel = 1) {
//   let startTime = performance.now();  // duration
//   let timeQueries = []

//   await (async () => {
//     for (let i = 0; i < count; i++) {
//       let arrGetPomises = []
//       for (let j = 0; j < parallel; j++) {
//         arrGetPomises = [...arrGetPomises, getPromise]
//       }
//       let timeQuery = performance.now();
//       await Promise.all([...arrGetPomises.map(item => item())]);
//       timeQueries = [...timeQueries, (performance.now() - timeQuery)]
//     }
//   })()

//   let duration = Math.round(performance.now() - startTime)
//   let querySpeed = (count * parallel) / 100000
//   let queryDuration = timeQueries.reduce((a, b) => (a + b)) / timeQueries.length
//   let parallelSpeed = duration / (count * parallel) / 10000
//   let parallelDuration = duration / (count * parallel)

//   return {
//     duration,           //общая длительность работы цикла
//     querySpeed,         //реальная средняя скорость запроса
//     queryDuration,      //реальное среднее время запроса
//     parallelSpeed,      //скорость в запросах в миллисекунду
//     parallelDuration    //среднее время обработки запроса параллельно
//   }
// }

// speedtest(() => delay(1000), 5, 5).then(result => console.log(result))