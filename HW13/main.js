fetch('https://swapi.dev/api/people/1/')
  .then(res => res.json())
  .then(data => renderTree(root, data))

const renderTree = (el, json) => {
  let table = document.createElement('table')
  table.setAttribute('border', '1px')
  for (const [key, value] of Object.entries(json)) {
    let tr = document.createElement('tr')
    let th = document.createElement('th')
    let td = document.createElement('td')
    let button = document.createElement('button')
    th.innerText = key
    if (typeof (value) === 'object') {
      let deepTable = document.createElement('table')
      deepTable.setAttribute('border', '1px')
      deepTable.style.width = '100%'
      value.map(t => {
        let deepTr = document.createElement('tr')
        let deepTd = document.createElement('td')
        let deepButton = document.createElement('button')
        deepButton.innerText = t.slice(22, -1)
        deepButton.onclick = () => reRenderTree(deepTd, t)
        deepTd.append(deepButton)
        deepTr.append(deepTd)
        deepTable.append(deepTr)
      })
      td.append(deepTable)
    } else if (typeof value === 'string' && !value.indexOf('https://')) {
      button.innerText = value.slice(22,-1)
      button.onclick = () => reRenderTree(td, value)
      td.append(button)
    } else {
      /\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])*/.test(value) ? td.innerText = value.slice(0, 10) : td.innerText = value
    }
    tr.append(th)
    tr.append(td)
    table.append(tr)
  }
  el.append(table)
}

const reRenderTree = (el, link) => {
  el.removeChild(el.firstChild)
  return fetch(link)
    .then(res => res.json())
    .then(data => renderTree(el, data))
}

