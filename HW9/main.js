// Таблица,  замыкание
let table = document.createElement('table')
for (let rowIndex = 0; rowIndex <= 10; rowIndex++) {
  let tr = document.createElement('tr')
  rowIndex % 2 === 0 ? tr.className = "tr-odd" : tr.className = "tr-even"
  table.append(tr)
  if (rowIndex === 0) {
    for (let t = 0; t <= 10; t++) {
      let th = document.createElement('th')
      th.className = 'th'
      th.innerText = t
      tr.append(th)
    }
  } else {
    for (let colIndex = 0; colIndex <= 10; colIndex++) {
      let td = document.createElement('td')

      td.onmousemove = function () {
        [...tr.parentElement.children].map(t => t.children[colIndex].style.backgroundColor = '#9e90ff')
        td.parentElement.style.backgroundColor = '#9e90ff';
        td.style.backgroundColor = 'red'
      }
      td.onmouseout = function () {
        [...tr.parentElement.children].map(t => t.children[colIndex].style.backgroundColor = '')
        td.style.backgroundColor = ''
        td.parentElement.style.backgroundColor = ''
      }

      if (colIndex === 0) {
        let th = document.createElement('th')
        th.className = 'th'
        th.innerText = (rowIndex) * (colIndex + 1)
        tr.append(th)
      } else if (colIndex === rowIndex) {
        td.className = 'tdtd'
        td.innerText = (rowIndex) * (colIndex)
        tr.append(td)
      } else {
        td.innerText = (rowIndex) * (colIndex)
        tr.append(td)
      }
    }
  }
}
root.append(table)

//makeProfileTimer

function makeProfileTimer() {
  let t0 = performance.now();
  return function () {
    let t1 = performance.now();
    return t1 - t0
  }
}

let timer = makeProfileTimer()
alert('Замеряем время работы этого alert')
alert(timer())

//makeSaver

function makeSaver(param) {
  let res;
  let flag = false;
  return function () {
    debugger
    flag ? res : (flag = true, res = param());
  }
};

let saver = makeSaver(Math.random)
let value1 = saver()
let value2 = saver()
console.log(value1 === value2);

let saver2 = makeSaver(() => console.log('saved function called') || [null, undefined, false, '', 0, Math.random()][Math.ceil(Math.random() * 6)])
let value3 = saver2()
let value4 = saver2()
console.log(value3 === value4);

//Final Countdown

(function () {
  let seconds = 5
  for (let i = 0; i <= seconds; i++) {
    setTimeout(() => {
      !seconds ? console.log('поехали!') : console.log(seconds--);
    }, 1000 * i);
  }
}())

//myBind

function myBind(f, method, arr) {
  return function (...params) {
    let countIndex = 0
    let newArr = arr.map(i => i !== undefined ? i : params[countIndex++])
    return f.apply(method, newArr)
  }
}

var pow5 = myBind(Math.pow, Math, [undefined, 5])
pow5(2)

var cube = myBind(Math.pow, Math, [undefined, 3])
cube(3)

var chessMin = myBind(Math.min, Math, [undefined, 4, undefined, 5, undefined, 8, undefined, 9])
chessMin(-1, -5, 3, 15)

var zeroPrompt = myBind(prompt, window, [undefined, "0"]) 
var someNumber = zeroPrompt("Введите число")

myBind((...params) => params.join(''), null, [undefined, 'b', undefined, undefined, 'e', 'f'])('a', 'c', 'd') === 'abcdef'