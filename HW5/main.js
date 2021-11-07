// {
//   let personeFirst = {
//     name: 'Maksym',
//     surname: 'Mykulenko',
//   }
//   let personeSecond = {
//     name: 'Viktoria',
//     surname: 'Mykulenko',
//   }
//   let personeThird = {
//     name: 'Alexey',
//     surname: 'Korzh',
//   }
//   personeSecond.married = true

//   personeFirst.age = 27
//   personeSecond.age = 26

//   personeFirst.fathername = 'Yuriovich'
//   personeThird.fathername = 'Vladimirovich'

//   personeFirst.sex = 'male'
//   personeThird.sex = 'male'

//   alert(typeof (personeFirst.fathername));
//   alert(typeof (personeFirst.sex));
//   alert('sex' in personeSecond);
//   alert('fathername' in personeSecond);

//   let persons = [personeFirst, personeSecond, personeThird]

//   for (let i = 0; i < persons.length; i++) {
//     console.log(persons[i].name, persons[i].surname)
//   }

//   for (let i = 0; i < persons.length; i++) {
//     for (const key in persons[i]) {
//       console.log(persons[i][key]);
//     }
//   }

//   for (let i = 0; i < persons.length; i++) {
//     persons[i].fullName = persons[i].name + ' ' + persons[i].surname + ' ' + (persons[i].fathername ? persons[i].fathername : '');
//     console.log(persons[i].fullName);
//   }

//   console.log(JSON.stringify(persons, 0, 2));

//   let personFourth = JSON.parse('{"name": "Ronaldo", "surname": "Cristiano", "age": 36, "married": true, "sex": "male"}')
//   persons.push(personFourth)
//   console.log(persons);


//   let objSortKeys = {}
//   let tablePersons = '<table style="text-align: center; border-spacing: 0; font-size: 16px; border: 1px solid #000">'
//   let count = 0
//   for (const person of persons) {
//     for (const [key, value] of Object.entries(person)) {
//       if (!(key in objSortKeys)) {
//         objSortKeys[key] = value;
//         tablePersons += `<tr style="background-color:${(count % 2) ? `#ffffff` : `#e3e3e3`};color:black;border: 1px solid #000"><th style="background-color:#666666;color:#00ff1f;padding:10px;text-transform:capitalize; border: 1px solid #000">${key}</th>`
//         for (let i = 0; i < persons.length; i++) {
//           (key in persons[i]) ? tablePersons += `<td style="color:#000000;padding:10px; border: 1px solid #000">${persons[i][key]}</td>` : tablePersons += `<td style="background-color:#7a3434;color:red;padding:10px; border: 1px solid #000"></td>`
//         }
//         tablePersons += '</tr>'
//       }
//       count++
//     }
//   }
//   tablePersons += '</table>'
//   document.write(tablePersons)
// }

// let someTree = {
//   tagName: "table", //html tag
//   subTags: [ //вложенные тэги
//     {
//       tagName: "tr",
//       subTags: [
//         {
//           tagName: "td",
//           text: "some text",
//         },
//         {
//           tagName: "td",
//           text: "some text 2",
//         }
//       ]
//     }
//   ],
//   attrs:
//   {
//     border: 1,
//     'text-align': 'center',
//     'border-spacing': 0,
//     "font-size": 16,
//   },
// }

// let table = ''
// let col = ''
// for (const [node, value] of Object.entries(someTree)) {
//   if (node === 'tagName') {
//     table += `<${value} `
//   } else if (node === 'attrs') {
//     table += `style ="`
//     for (const keyValue in value) {
//       table += `${keyValue}:`
//       if (+value[keyValue]) {
//         table += `${value[keyValue]}px;`
//       } else {
//         table += `${value[keyValue]};`
//       }
//     }
//     table += '">'
//   } else {
//     for (const deepValueKey of value) {
//       for (const [nodeDeepValueKey, nodeDeepValue] of Object.entries(deepValueKey)) {
//         if (nodeDeepValueKey === 'tagName') {
//           col += `<${nodeDeepValue}> `
//         } else {
//           for (const deepTrValueKey of nodeDeepValue) {
//             for (const [nodeDeepTrValueKey, nodeDepTrValue] of Object.entries(deepTrValueKey)) {
//               if (nodeDeepTrValueKey === 'tagName') {
//                 col += `<${nodeDepTrValue}> `
//               } else {
//                 col += `${nodeDepTrValue}`
//               }
//             }
//           }
//           col += `</${nodeDeepValue}> `
//         }
//       }
//     }
//   }
// }
// table += col
// table += `</table > `
// document.write(table)

// destruct array
// let [odd1, even1, odd2, even2, odd3, ...otherLetters] = [1, 2, 3, 4, 5, "a", "b", "c"]

// // destruct string
// let [number, [s1, s2, s3]] = [1, "abc"]

// // destruct 2
// let obj = {
//   name: 'Ivan',
//   surname: 'Petrov',
//   children: [{ name: 'Maria' }, { name: 'Nikolay' }]
// }

// let { children: [{ name: name1 }, { name: name2 }] } = obj


// // destruct 3
// let arr = [1, 2, 3, 4, 5, 6, 7, 10]
// let { 0: a, 1: b, length } = arr
// console.log(a, b, length);