function Password(parent, open = false) {

  let wrap = document.createElement('div')
  let input = document.createElement('input')
  let checkBox = document.createElement('input')

  input.type = open ? 'text' : 'password'
  checkBox.type = 'checkbox'
  checkBox.checked = open
  wrap.append(input)
  wrap.append(checkBox)
  parent.append(wrap)
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

// let p = new Password(document.body, true)
// p.onChange = () => console.log(p.getValue())
// p.onOpenChange = (open) => console.log(open)
// p.setValue('qwerty')
// console.log(p.getValue())

// let button = document.createElement('button')
// let input = document.createElement('input')
// input.type = 'text'
// button.disabled = true
// button.innerText = 'LogIn'
// document.body.append(input)
// document.body.append(button)

// let checkDisabled = () => input.value !== '' && p.getValue() !== '' ? button.disabled = false : button.disabled = true
// p.onChange = () => checkDisabled()
// input.oninput = () => checkDisabled()

function LoginForm(parent, disabled) {
  const input = document.createElement('input')
  const btn = document.createElement('button')
  input.type = 'text'
  btn.disabled = disabled
  btn.innerText = 'LogIn'
  this.getValue = () => input.value
  this.setValue = (newValue) => input.value = newValue

  input.oninput = () => this.onChange()

  this.getOpen = () => btn.disabled
  this.setOpen = (newChek) => btn.disabled = newChek

  parent.append(input)
  parent.append(btn)
}
let lf = new LoginForm(form, true)
let psw = new Password(form, true)

let checkDisabled = () => lf.getValue() !== '' && psw.getValue() !== '' ? lf.setOpen(false) : lf.setOpen(true)
lf.onChange = () => checkDisabled()
psw.onChange = () => checkDisabled()

//Password Verifyd
function pswInputChange() {
  const pswInputDouble = document.createElement('input')
  psw.onOpenChange = (chek) => {
    if (!chek) {
      pswInputDouble.type = psw.setOpen()
      pswInputDouble.value = psw.getValue()
      pswInputDouble.checked = psw.getOpen()
      form.append(pswInputDouble)
    } else {
      pswInputDouble.remove()
    }
  }
}
pswInputChange()