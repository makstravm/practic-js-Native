// var persons = [
//   { name: "Иван", age: 17 },
//   { name: "Мария", age: 35 },
//   { name: "Алексей", age: 73 },
//   { name: "Яков", age: 12 },
// ]

// const sort = (obj, param, ascending = true) => obj.sort((a, b) => ascending ? (a[param] > b[param] ? 1 : -1) : (a[param] < b[param] ? 1 : -1))

// // console.log(sort(persons, "name", false)); //сортирует по имени по убыванию
// // console.log(sort(persons, "age", true)); //сортирует по возрасту по возрастанию


// let arrayMap = ["1", {}, null, undefined, "500", 700]
// let newArray = arrayMap.map(t => t === String(t) ? +t : t)

// let arrayrReduce = ["0", 5, 3, "string", null]
// let newarrayrReduce = arrayrReduce.reduce((a = 0, b) => typeof b === 'number' ? a * b : a, 1)


// var phone = {
//   brand: "meizu",
//   model: "m2",
//   ram: 2,
//   color: "black",
// };

// function filter(obj, callback) {
//   let result = {}
//   for (const [key, value] of Object.entries(obj)) {
//     if (callback(key, value)) {
//       result[key] = value
//     }
//   }
//   return result
// }

// filter(phone, (key, value) => key == "color" || value == 2)


// function map(obj, callback) {
//   let result = {}
//   for (const [key, value] of Object.entries(obj)) {
//     result = { ...result, ...callback(key, value) }
//   }
//   return result
// }

// map({ name: "Иван", age: 17 }, function (key, value) {
//   var result = {};
//   result[key + "_"] = value + "$";
//   return result;
// }) //должен вернуть {name_: "Иван$", age_: "17$"}


// const arProgression = n => n <= 1 ? 1 : n + arProgression(n - 1)

var someTree = {
  tagName: "table", //html tag
  children: [ //вложенные тэги
    {
      tagName: "tr",
      children: [
        {
          tagName: "td",
          text: "some text",
        },
        {
          tagName: "td",
          text: "some text 2",
        }
      ]
    }
  ],
  attrs:
  {
    border: 1,
  },
}


let table = ''
walk(someTree)
function walk(obj) {
  debugger
  for (var deep in obj) {
    if (typeof (obj[deep]) === 'object') {
      walk(obj[deep]);
    } else {
      if (deep === 'tagName') {
        table += `<${obj[deep]}>`
      } else if (deep === 'text') {
        table += `${obj[deep]}`
      }
    }
  }
}
document.write(table)
