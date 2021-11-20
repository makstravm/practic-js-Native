function Form(el, data, okCallback, cancelCallback) {
  let rootData = { ...data }
  let formBody = document.createElement('div')
  let okButton = document.createElement('button')
  okButton.innerHTML = 'OK'
  let cancelButton = document.createElement('button')
  cancelButton.innerHTML = 'Cancel'
  const table = document.createElement('table')
  const errorText = document.createElement('span')
  let input
  let inputArray = []
  for (const [key, value] of Object.entries(data)) {
    const tr = document.createElement('tr')
    const th = document.createElement('th')
    const td = document.createElement('td')
    key[0] === '*' ? th.innerHTML = `<span style='color:red'>${key[0]}</span> ${key.slice(1)}` : th.innerHTML = key
    let inputCreators = {
      String(key, value, oninput) {
        const input = document.createElement('input')
        input.type = (/^[*]+$/i).test(value) ? 'password' : 'text'
        input.placeholder = key
        input.value = (/^[*]+$/i).test(value) ? '' : value
        input.oninput = () => {
          key[0] === '*' && input.value === '' ? input.style.borderColor = 'red' : input.style.borderColor = ''
          oninput(input.value)
        }
        return input
      },
      Boolean(key, value, oninput) {
        const input = document.createElement('input')
        input.type = 'checkbox'
        input.checked = value
        input.oninput = () => oninput(input.checked)
        return input
      },
      Date(key, value, oninput) {
        const input = document.createElement('input')
        input.type = 'datetime-local'
        input.oninput = () => oninput(new Date(input.value))
        const offset = value.getTimezoneOffset()
        const now = value.getTime()
        const nowPlusOffset = new Date(now - offset * 60 * 1000)
        input.value = nowPlusOffset.toISOString().slice(0, -1)
        return input
      },
    }
    input = inputCreators[value.constructor.name](key, value, value => {
      if (key in this.validators && !this.validators[key](value)) {
        errorText.innerText = `Please, enter correct ${key}`
        errorText.classList.add('error');
        input.style.borderColor = 'red'
        td.append(errorText)
      } else {
        input.style.color = 'black'
        errorText.remove()
      }
      data[key] = value
    })
    inputArray.push(input)
    table.append(tr)
    tr.append(th)
    tr.append(td)
    td.append(input)
  }

  console.log(inputArray[3].value);
  formBody.innerHTML = '<h1>тут будет форма после перервы</h1>'
  formBody.append(table)

  if (typeof okCallback === 'function') {
    formBody.appendChild(okButton);
    okButton.onclick = () => {
      let controlInputValid = []
      let i = 0
      for (const [key, value] of Object.entries(data)) {
        if (value.constructor.name === 'String') key in this.validators ? controlInputValid.push(this.validators[key](value)) : key[0] === '*' && controlInputValid.push((inputArray[i].value !== '') ? true : false)
        i++
      }
      controlInputValid.some(el => el === false) ? alert('Внимательно вводим поля') : alert('Проходи')
    }
  }

  if (typeof cancelCallback === 'function') {
    formBody.appendChild(cancelButton);
    cancelButton.onclick = () => {
      let i = 0
      for (const key in rootData) {
        if (inputArray[i].type === 'text') inputArray[i++].value = rootData[key]
        else if (inputArray[i].type === 'password') inputArray[i++].value = ''
        else if (inputArray[i].type === 'checkbox') inputArray[i++].checked = rootData[key]
        else if (inputArray[i].type === 'datetime-local') {
          const offset = rootData[key].getTimezoneOffset()
          const now = rootData[key].getTime()
          const nowPlusOffset = new Date(now - offset * 60 * 1000)
          inputArray[i++].value = nowPlusOffset.toISOString().slice(0, -1)
        }
      }
    }
  }

  el.appendChild(formBody)

  this.okCallback = okCallback
  this.cancelCallback = cancelCallback

  this.data = data
  this.validators = {}
}

let form = new Form(formContainer, {
  '*name': 'Anakin',
  surname: 'Skywalker',
  '*password': '******',
  married: true,
  birthday: new Date((new Date).getTime() - 86400000 * 30 * 365)
}, () => console.log('ok'), () => console.log('cancel'))

// form.okCallback = () => console.log('ok2')

form.validators.surname = (value, key, data, input) => value.length > 2 && value[0].toUpperCase() == value[0] && !value.includes(' ') ? true : false
console.log(form)