let table = document.createElement('table')
for (let rowIndex = 0; rowIndex <= 10; rowIndex++) {
  let tr = document.createElement('tr')
  rowIndex % 2 === 0 ? tr.className = "tr-odd" : tr.className = "tr-even"
  table.append(tr)
  if (rowIndex === 0) {
    for (let t = 0; t <= 10; t++) {
      let th = document.createElement('th')
      th.className = 'th'
      th.append(t)
      tr.append(th)
    }
  } else {
    for (let colIndex = 0; colIndex <= 10; colIndex++) {
      let td = document.createElement('td')
      function findChild(e) {
        let arrayParentChildren = [...this.parentElement.parentElement.children]
        for (let row = 0; row <= tr.rowIndex; row++) {
          for (let cell = 0; cell <= td.cellIndex; cell++) {
            if (e.type === 'mousemove') {
              if (cell === td.cellIndex) {
                [...arrayParentChildren[row].children][cell].style.backgroundColor = '#fffbcc'
              }
              [...this.parentElement.children][cell].style.backgroundColor = '#fffbcc'
              this.style.backgroundColor = 'red'
            } else {
              [...arrayParentChildren[row].children][cell].style.backgroundColor = ''
            }
          }
        }
      }
      td.onmousemove = findChild
      td.onmouseout = findChild
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

