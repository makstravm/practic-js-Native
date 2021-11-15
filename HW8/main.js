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

      // подсвечивает строку и столбец  до указаной клетки

      function lightTd(e) {
        let arrayParentChildren = [...this.parentElement.parentElement.children]
        for (let row = 0; row <= tr.rowIndex; row++) {
          for (let cell = 0; cell <= td.cellIndex; cell++) {
            if (e.type === 'mousemove') {
              if (cell === td.cellIndex) {
                [...arrayParentChildren[row].children][cell].style.backgroundColor = '#9e90ff'
              }
              [...this.parentElement.children][cell].style.backgroundColor = '#9e90ff'
              this.style.backgroundColor = 'red'
            } else {
              [...arrayParentChildren[row].children][cell].style.backgroundColor = ''
            }
          }
        }
      }
      td.onmousemove = lightTd
      td.onmouseout = lightTd

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

