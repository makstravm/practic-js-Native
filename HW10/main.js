function Control(el, { value = 0,
  min = 0,
  max = 100,
  minAngle = 0,
  maxAngle = 270,
  width = 200,
  wheelSpeed = 0.1,
  step = 1 } = {}) {

  const img = document.createElement('img')
  img.src = '1@3x.png'
  img.width = width
  el.append(img)

  const ratio = (maxAngle - minAngle) / (max - min)// сколько градусов 1 ед. велью
  const getAngle = () => (value - min) * ratio + minAngle // текущий угол ползунка

  this.setValue = newValue => { //проверить, вдруг в этом объекте есть onchange
    if (newValue > max) newValue = max
    if (newValue < min) newValue = min
    if (typeof this.onchange === 'function') {
      this.onchange(value)
    }
    value = newValue //и запустить его с новым value
    img.style.transform = `rotate(${getAngle()}deg)`
  }
  this.getValue = () => value
  this.onchange = value => value

  img.onmousewheel = e => {
    const { deltaY } = e
    const newValue = value + deltaY * wheelSpeed
    this.setValue(newValue)
    e.preventDefault()
  }

  img.onclick = e => {
    const { layerX } = e
    const { width } = img
    layerX > width / 2 ? this.setValue(value + step) : this.setValue(value - step)
  }

  const toDeg = rad => ((rad * 180) / Math.PI + 360 + 90) % 360
  let prevMouseAngle = null

  img.onmousedown = e => {
    const y = e.layerY - img.height / 2
    const x = e.layerX - img.width / 2
    prevMouseAngle = toDeg(Math.atan2(y, x))
    e.preventDefault()
  }

  img.onmousemove = e => {
    if (prevMouseAngle === null) return
    const y = e.layerY - img.height / 2
    const x = e.layerX - img.width / 2
    let currentAngle = toDeg(Math.atan2(y, x))
    let moveAngleDiff = (currentAngle - prevMouseAngle)
    this.setValue(value + moveAngleDiff / ratio)
    prevMouseAngle = currentAngle
  }

  img.onmouseout = img.onmouseup = () => {
    prevMouseAngle = null
  }

  this.setValue(value)
}

// const volumeControl = new Control(container1, { value: 13, min: 0, max: 100, minAngle: 0, maxAngle: 270, width: 150 })
// volumeControl.onchange = value => console.log(value) //на каждый setValue
// console.log(volumeControl.getValue())
// setTimeout(() => volumeControl.setValue(80), 2000)
//пришейте к нему тэг audio для громкости

function setRGB() {
  box.style.backgroundColor = `rgb(${red.getValue().toFixed(0)},${green.getValue().toFixed(0)},${blue.getValue().toFixed(0)})`
  box.children[0].innerText = `color rgb:${red.getValue().toFixed(0)},${green.getValue().toFixed(0)},${blue.getValue().toFixed(0)}`
}

const red = new Control(container1, { min: 0, max: 255, width: 150 })
red.onchange = setRGB
const green = new Control(container1, { min: 0, max: 255, width: 150 })
green.onchange = setRGB
const blue = new Control(container1, { min: 0, max: 255, width: 150 })
blue.onchange = setRGB



