function a(text) {
  alert(text)
}


const cube = num => Math.pow(num, 3)

const avg2 = (a, b) => (a + b) / 2

const sum3 = (...params) => params.reduce((a, b) => a + b)

const intRandom = (a, b) => !b ? Math.round(Math.random() * a) : Math.round(Math.random() * (b - a)) + a

function greetAll() {
  let str = []
  for (let i = 0; i < arguments.length; i++) {
    str.push(arguments[i])
  }
  alert('Hello ' + str.join(', '))
}

function sum() {
  let arrNum = []
  for (let i = 0; i < arguments.length; i++) {
    arrNum.push(arguments[i])
  }
  alert(arrNum.reduce((a, b) => a + b))
}


var sample = prompt("Введите название задания")
switch (sample.toLowerCase()) {
  case "a": a('Привет')
    break
  case "cube": cube(5)
    break
  case "avg2": avg2(10, 8)
    break
  case "intRandom": intRandom(5, 25)
    break
  case "greetAll": greetAll("Superman", "SpiderMan", "Captain Obvious")
    break
  case "sum": sum(10, 20, 40, 100)
    break
}

const objFunction = {
  a: a,
  cube: cube,
  avg2: avg2,
  intRandom: intRandom,
  greetAll: greetAll,
  sum: sum,
}

let result = objFunction[prompt("Введите название задания").toLowerCase()]()
