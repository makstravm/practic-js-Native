
// let body = {
//   tagName: 'body',
//   attrs: {},
//   children: [
//     {
//       tagName: 'div',
//       attrs: {},
//       children: [
//         {
//           tagName: 'span',
//           attrs: {},
//           children: ['Enter a date please']
//         },
//         {
//           tagName: 'br',
//           attrs: {}
//         },
//         {
//           tagName: 'input',
//           attrs:
//           {
//             id: 'ok',
//             type: 'text'
//           }
//         },
//         {
//           tagName: 'input',
//           attrs:
//           {
//             id: 'surname',
//             type: 'text'
//           }
//         },
//       ]
//     },
//     {
//       tagName: 'div',
//       attrs: {},
//       children: [
//         {
//           tagName: 'button',
//           attrs:
//           {
//             id: 'ok'
//           },
//           children: ['Ok']
//         },
//         {
//           tagName: 'button',
//           attrs:
//           {
//             id: 'cancel'
//           },
//           children: ['Cancel']
//         }
//       ]
//     }
//   ]
// }


// let notebook = {
//   brand: prompt("Enter a notebook brand"),
//   type: prompt("Enter a notebook type"),
//   model: prompt("Enter a notebook model"),
//   ram: +prompt("Enter a notebook ram"),
//   size: +prompt("Enter a notebook size"),
//   weight: +prompt("Enter a notebook weight"),
//   resolution: confirm("Full HD?") ? { width: 1920, height: 1080, } : { width: +prompt("Enter a notebook width"), height: +prompt("Enter a notebook height"), }
// };
// let phone = {
//   brand: prompt("Enter a phone brand"),
//   model: prompt("Enter a phone model"),
//   ram: +prompt("Enter a phone ram"),
//   color: prompt("Enter a phone color")
// };
// let persone = {
//   name: prompt("Enter a name"),
//   surname: prompt("Enter a surname"),
// }
// persone.smartphone = phone;
// persone.laptop = notebook;
// notebook.owner = persone;
// phone.owner = persone;

// persone.smartphone.owner.laptop.owner.smartphone == persone.smartphone

// {
//   let arr = []
//   do {
//     arr[arr.length] = prompt('fiil enter')
//   }
//   while (arr[arr.length - 1] !== null && arr.length !== 3);
//   arr.pop()
//   console.log(arr);
// }

// while (!confirm("Останови меня"));

// {
//   let array = []
//   do {
//     array.push(prompt('fill array'))
//   }
//   while (array[array.length - 1] !== null);
//   array.pop()
//   console.log(array);
// }

// {
//   let array2 = []
//   do {
//     array2[array2.length] = prompt('fill array')
//   }
//   while (array2[array2.length - 1] !== null);
//   array2.pop()
//   console.log(array2);
// }

// {
//   let random
//   let count = 0;
//   while (random !== -1) {
//     random = Math.random()
//     count++
//     if (random > 0.9) {
//       alert(count)
//       break
//     }
//   }
// }

// {
//   let random
//   for (let i = 1; i > 0; i++) {
//     random = Math.random()
//     i++
//     if (random > 0.9) {
//       alert(i)
//       break
//     }
//   }
// }

// {
//   while (prompt() !== '');
// }

// {
//   let n = 10
//   let sum = 0
//   for (let i = 0, a = 1; i <= n; i++, a = a + 3) {
//     sum += a
//   }
//   console.log(sum)
// }

// let arr = ''
// let n = 11
// for (let i = 0; i < n; i++) {
//   n % 2 === 0 ? (i % 2 === 0 ? arr += ' ' : arr += '#') : (i % 2 === 0 ? arr += ' ' : arr += '#')
// }
// console.log(arr);

// {
//   let stringNumber = "";
//   for (let i = 0; i <= 9; i++) {
//     for (let j = 0; j <= 9; j++) {
//       stringNumber += j;
//     }
//     stringNumber += "\n";
//   }
//   console.log(stringNumber);
// }

// {
//   let chess = "";
//   for (let i = 0; i < 10; i++) {
//     for (let j = 0; j < 12; j++) {
//       i % 2 === 0 ? (j % 2 === 0 ? chess += '.' : chess += '#') : (j % 2 === 0 ? chess += '#' : chess += '.')
//     }
//     chess += "\n";
//   }
//   console.log(chess);
// }

// let arrCubNum = []
// let n = 10
// for (let i = 0; i < n; i++) {
//   arrCubNum.push(i * i * i)
// }
// console.log(arrCubNum);

// {
//   let multiplyTablleArr = []
//   for (let i = 0; i < 10; i++) {
//     let oneNumberArr = []
//     for (let j = 1; j <= 10; j++) {
//       oneNumberArr[j] = (i + 1) * (j)
//     }
//     multiplyTablleArr[i + 1] = oneNumberArr
//   }
//   console.log(multiplyTablleArr);
// }

// {
//   let str = "<table  style='text-align: center;border-spacing:0;font-size: 16px;border:1px solid #000'>"
//   for (let rowIndex = 0; rowIndex <= 10; rowIndex++) {
//     str += "<tr style='color:black;border: 1px solid #000'>"
//     if (rowIndex === 0) {
//       for (let k = 0; k <= 10; k++) {
//         str += "<th style='background-color:#ececec;color:red;padding:10px; border: 1px solid #000'>" + (k) + "</th>"
//       }
//     } else {
//       for (let colIndex = 0; colIndex <= 10; colIndex++) {
//         colIndex === 0 ? str += "<th style='background-color:#ececec;color:red;padding:10px; border: 1px solid #000'>" + (rowIndex) * (colIndex + 1) + "</th>" : (colIndex === rowIndex ? str += ("<th style='padding:10px; border:1px solid #000'>" + (rowIndex) * (colIndex) + "</th>") : str += ("<td style='padding:10px; border:1px solid #000'>" + (rowIndex) * (colIndex) + "</td>"))
//       }
//     }
//     str += ("</tr >")
//   }
//   str += '</table>'
//   console.log(str);
//   document.write(str)
// }


// {
//   let arrResult = []
//   let w = 10
//   let h = 6;
//   let mid = Math.ceil((w / 2))
//   for (let i = 0; i < h; i++) {
//     let arr = []
//     let reversArr
//     for (let j = 0; j <= mid; j++) {
//       if (arr.length >= (mid - i)) {
//         arr += '#'
//       } else {
//         arr += '.'
//       }
//     }
//     reversArr = arr.split('').reverse().join('')
//     arrResult += (arr + reversArr.slice(1))
//     arrResult += '\n'
//   }
//   console.log(arrResult);
// }