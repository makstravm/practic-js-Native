let table = document.createElement('table')
for (let rowIndex = 0; rowIndex <= 10; rowIndex++) {
  let tr = document.createElement('tr')
  rowIndex % 2 === 0 ? tr.className = "tr-odd" : tr.className = "tr-even"
  table.append(tr)
  if (rowIndex === 0) {
    for (let k = 0; k <= 10; k++) {
      let th = document.createElement('th')
      th.className = 'th'
      th.append(k)
      tr.append(th)
    }
  } else {
    for (let colIndex = 0; colIndex <= 10; colIndex++) {
      let td = document.createElement('td')
      td.onmouseover = function () {
        let array = [...this.parentElement.parentElement.children]
        for (let row = 0; row <= tr.rowIndex; row++) {
          for (let cell = 0; cell <= td.cellIndex; cell++) {
            if (cell === td.cellIndex) {
              [...array[row].children][cell].style.backgroundColor = '#fffbcc'
            }
            [...this.parentElement.children][cell].style.backgroundColor = '#fffbcc'
          }
        }
        this.style.backgroundColor = 'red'
      }
      td.onmouseout = function () {
        this.style.backgroundColor = ''
        let array = [...this.parentElement.parentElement.children]
        for (let cell = 0; cell <= tr.rowIndex; cell++) {
          for (let row = 0; row <= td.cellIndex; row++) {
            [...array[cell].children][row].style.backgroundColor = ''
          }
        }
      }
      if (colIndex === 0) {
        let th = document.createElement('th')
        th.className = 'th'
        th.append((rowIndex) * (colIndex + 1))
        tr.append(th)
      } else if (colIndex === rowIndex) {
        td.className = 'tdtd'
        td.append((rowIndex) * (colIndex))
        tr.append(td)
      } else {
        td.append((rowIndex) * (colIndex))
        tr.append(td)
      }
    }
  }
}
root.append(table)


plus.addEventListener('click', () => {
  result.value = +numOne.value + +numTwo.value
})
minus.addEventListener('click', () => {
  result.value = +numOne.value - +numTwo.value
})
division.addEventListener('click', () => {
  result.value = +numOne.value / +numTwo.value
})
multiplication.addEventListener('click', () => {
  result.value = +numOne.value * +numTwo.value
})
numOne.addEventListener('input', () => {
  result.value = +numOne.value + +numTwo.value
})
numTwo.addEventListener('input', () => {
  result.value = +numOne.value + +numTwo.value
})

