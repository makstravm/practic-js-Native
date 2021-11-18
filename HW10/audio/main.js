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
      this.onchange(newValue)
    }
    value = newValue //и запустить его с новым value
    img.style.transform = `rotate(${getAngle()}deg)`
  }
  this.getValue = () => value

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

const red = new Control(containerRgb, { min: 0, max: 255, width: 100 })
red.onchange = setRGB
const green = new Control(containerRgb, { min: 0, max: 255, width: 100 })
green.onchange = setRGB
const blue = new Control(containerRgb, { min: 0, max: 255, width: 100 })
blue.onchange = setRGB



// громкость звука
const volume = new Control(volMus, {
  value: 1, min: 0, max: 1, width: 100, wheelSpeed: 0.001, step: 0.1
})
volume.onchange = controlAudio
// скорость проигрывания
const speedTrack = new Control(speedMus, {
  value: 1, min: 0.5, max: 1.5, width: 100, wheelSpeed: 0.001, step: 0.1
})
speedTrack.onchange = controlAudio
// прогресс трека
const progressTrack = new Control(progressMus, {
  value: 0, min: 0, max: 100, width: 100, wheelSpeed: 0.01, step: 1
})

// отрисовка изначальных данных в хтмл
volMus.children[0].innerText = `${(volume.getValue() * 100).toFixed(0)}%`
speedMus.children[0].innerText = `${(speedTrack.getValue() * 100).toFixed(0)}%`
progressMus.children[0].innerText = `${progressTrack.getValue().toFixed(0)}%`

// ф-я контейнер для контроллеров
function controlAudio() {
  track.volume = volume.getValue()
  volMus.children[0].innerText = `${(volume.getValue() * 100).toFixed(0)}%`
  track.playbackRate = speedTrack.getValue()
  speedMus.children[0].innerText = `${(speedTrack.getValue() * 100).toFixed(0)}%`
  track.currentTime = (track.duration / 100) * progressTrack.getValue()
  progressMus.children[0].innerText = `${progressTrack.getValue().toFixed(0)}%`
}

btn.onclick = regulatorPlayTrack()

function regulatorPlayTrack() {
  let chek = false//чек для плей и стоп
  let stopAnim;
  let stopGlyuk;
  return function () {
    // функция для визуального ефекта прогресса проигрывания
    let reDraw = function () {
      progressTrack.setValue((track.currentTime * 100) / track.duration)
      progressMus.children[0].innerText = `${progressTrack.getValue().toFixed(0)}%`
    }
    // рандом боди при проигрывание
    let glyuk = function () {
      body.style.backgroundColor = `rgb(${Math.round(Math.random() * 255).toFixed(0)},${Math.round(Math.random() * 255).toFixed(0)},${Math.round(Math.random() * 255).toFixed(0)})`
    }
    // добавляем клас для замены отрисовки кнопки
    btn.classList.toggle("active");
    if (!chek) {
      track.play()
      progressTrack.onchange = ''
      chek = true
      stopAnim = setInterval(reDraw, 100);
      stopGlyuk = setInterval(glyuk, 300);
    } else {
      track.pause()
      progressTrack.onchange = controlAudio
      chek = false
      clearInterval(stopAnim)
      clearInterval(stopGlyuk)
    }
  }
}



