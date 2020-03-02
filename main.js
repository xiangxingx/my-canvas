var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')
var isEraser = false
var lastPoint = { x: undefined, y: undefined }
var currentPoint = { x: undefined, y: undefined }
var strokeStyle = 'black'
var using = false
autoCanvasSize()
listenToUser()
penColor()

// 自适应画布大小
function autoCanvasSize() {
  setCanvasSize()
  window.onresize = function () {
    setCanvasSize()
  }
  function setCanvasSize() {
    var pageWidth = document.documentElement.clientWidth
    var pageHeight = document.documentElement.clientHeight
    canvas.width = pageWidth
    canvas.height = pageHeight
  }
}

// 监听用户行为
function listenToUser() {
  var mouse = document.body.ontouchstart === undefined
  if (mouse) {
    canvas.onmousedown = function (ev) {
      currentPoint.x = ev.clientX
      currentPoint.y = ev.clientY
      start()
    }
    canvas.onmousemove = function (ev) {
      currentPoint.x = ev.clientX
      currentPoint.y = ev.clientY
      move()
    }
    canvas.onmouseup = function () {
      using = false
    }
  } else {
    canvas.ontouchstart = function (ev) {
      currentPoint.x = ev.touches[0].clientX
      currentPoint.y = ev.touches[0].clientY
      start()
    }
    canvas.ontouchmove = function (ev) {
      currentPoint.x = ev.touches[0].clientX
      currentPoint.y = ev.touches[0].clientY
      move()
    }
    canvas.touchend = function () {
      using = false
    }
  }
}

// 画画
function start() {
  using = true
  if (isEraser) {
    context.clearRect(currentPoint.x - 30, currentPoint.y - 30, 60, 60)
  }
  lastPoint.x = currentPoint.x
  lastPoint.y = currentPoint.y
}
function move() {
  if (using) {
    if (isEraser) {
      context.clearRect(currentPoint.x - 30, currentPoint.y - 30, 60, 60)
    }
    drawLine(lastPoint.x, lastPoint.y, currentPoint.x, currentPoint.y)
    lastPoint.x = currentPoint.x
    lastPoint.y = currentPoint.y
  }
}

// 画线
function drawLine(lastX, lastY, x, y) {
  if (!isEraser) {
    context.beginPath()
    context.lineWidth = 4
    context.strokeStyle = strokeStyle
    context.moveTo(lastX, lastY)
    context.lineTo(x, y)
    context.closePath()
    context.stroke()
  }
}

// 画笔颜色
function penColor() {
  chooseColor('black')
  chooseColor('red')
  chooseColor('green')
  chooseColor('blue')

  function chooseColor(id) {
    var color = document.getElementById(id)
    color.addEventListener('click', function () {
      usePen()
      clearColorsActive()
      strokeStyle = id
      color.classList.add('active')
    })
  }
  function clearColorsActive() {
    var colors = document.getElementById('colors')
    var allColor = colors.querySelectorAll('li')
    for (let i = 0; i < allColor.length; i++) {
      allColor[i].classList.remove('active')
    }
  }
}

function usePen() {
  isEraser = false
  pen.classList.add('active')
  eraser.classList.remove('active')
}
pen.onclick = function () {
  usePen()
}
eraser.onclick = function () {
  isEraser = true
  eraser.classList.add('active')
  pen.classList.remove('active')
}
clear.onclick = function () {
  var clearCanvas = confirm('确定要清空画板吗？')
  if (clearCanvas) {
    context.clearRect(0, 0, canvas.width, canvas.height)
  }
}
download.onclick = function () {
  var download = confirm('将作品下载到本地')
  if (download) {
    var url = canvas.toDataURL('image/png')
    var tagA = document.createElement('a')
    document.body.appendChild(tagA)
    tagA.href = url
    tagA.download = 'My Paint'
    tagA.click()
  }
}
