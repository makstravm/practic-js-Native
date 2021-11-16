function Password(parent, open = false) {

  let input = document.createElement('input')
  let checkBox = document.createElement('input')
  input.type = open ? 'text' : 'password'
  checkBox.type = 'checkbox'
  checkBox.checked = open
  parent.append(input)
  parent.append(checkBox)

  this.getValue = () => input.value
  this.getOpen = () => checkBox.checked

  this.setValue = newValue => input.value = newValue
  this.setOpen = () => checkBox.checked ? input.type = 'text' : input.type = 'password'


  input.oninput = () => this.onChange()
  checkBox.oninput = () => {
    this.setOpen()
    if (typeof this.onOpenChange === 'function') {
      this.onOpenChange(checkBox.checked)
    }

  }
}

let p = new Password(document.body, true)
p.onChange = () => console.log(p.getValue())
p.onOpenChange = (open) => console.log(open)
p.setValue('qwerty')
console.log(p.getValue())

let login = new Password(document.body, false)
let button = document.createElement('button')
button.setAttribute('disabled', 'disabled')
button.innerText = 'LogIn'
document.body.append(button)

let checkDisabled = () => p.getValue() !== '' && p.getValue() !== '' ? button.removeAttribute('disabled', 'disabled') : button.setAttribute('disabled', 'disabled')
p.onChange = () => checkDisabled()
login.onChange = () => checkDisabled()