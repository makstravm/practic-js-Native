var persons = [
  { name: "Иван", age: 17 },
  { name: "Мария", age: 35 },
  { name: "Алексей", age: 73 },
  { name: "Яков", age: 12 },
]

const sort = (obj, param, ascending = true) => obj.sort((a, b) => ascending ? (a[param] > b[param] ? 1 : -1) : (a[param] < b[param] ? 1 : -1))

// console.log(sort(persons, "name", false)); //сортирует по имени по убыванию
// console.log(sort(persons, "age", true)); //сортирует по возрасту по возрастанию


let arrayMap = ["1", {}, null, undefined, "500", 700]
let newArray = arrayMap.map(t => t === String(t) ? +t : t)

let arrayrReduce = ["0", 5, 3, "string", null]
let newarrayrReduce = arrayrReduce.reduce((a = 0, b) => typeof b === 'number' ? a * b : a, 1)
