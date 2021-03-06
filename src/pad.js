export default class Pad {
  constructor (options) {
    this.canvas = options.canvas
    this.events = options.events
    this.canvasContext = this.canvas.getContext('2d')
    this.points = []
    this.data = []
  }

  setPenStyle () {
    this.canvasContext.lineCap = 'round'
    this.canvasContext.lineWidth = 4
    this.canvasContext.strokeStyle = '#4169E1' // Royal Blue color.
  }

  clear () {
    this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.data = []
  }

  draw () {
    this.setPenStyle()
    this.canvasContext.beginPath()
    for (let i = 0; i < this.data.length; i++) {
      let points = this.data[i].points
      for (let j = 0; j < points.length; j++) {
        let p = points[j]
        if (j === 0) {
          this.canvasContext.moveTo(p.x, p.y)
        } else {
          this.canvasContext.lineTo(p.x, p.y)
        }
      }
    }
    this.canvasContext.stroke()
  }

  listen () {
    let isDown = false
    let self = this
    let last
    this.canvas.onmousedown = (e) => {
      let pos = getXY(e)
      last = pos
      this.points = []
      isDown = true
      this.points.push(pos)
      this.setPenStyle()
      this.events.publish('/draw/pen/down')
    }

    this.canvas.onmousemove = (e) => {
      if (!isDown) {
        return
      }
      let pos = getXY(e)
      this.points.push(pos)
      this.canvasContext.beginPath()
      this.canvasContext.moveTo(last.x, last.y)
      this.canvasContext.lineTo(pos.x, pos.y)
      this.canvasContext.stroke()
      last = pos
    }

    this.canvas.onmouseup = (e) => {
      if (!isDown) {
        return
      }
      isDown = false
      const data = {
        points: this.points
      }
      this.events.publish('/draw/pen/up', data)
      self.data.push(data)
    }
    this.canvas.ontouchstart = this.canvas.onmousedown
    this.canvas.ontouchmove = this.canvas.onmousemove
    this.canvas.ontouchend = this.canvas.onmouseup

    function getXY (e) {
      let rect = self.canvas.getBoundingClientRect()
      if (e.type.indexOf('touch') >= 0) {
        return {
          x: e.targetTouches[0].clientX - rect.left,
          y: e.targetTouches[0].clientY - rect.top
        }
      } else {
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        }
      }
    }
  }

  setData (data) {
    this.data = data
  }

  getBoundingBox () {
    let minX = this.canvas.width
    let minY = this.canvas.height
    let maxX = 0
    let maxY = 0
    let i = 0
    let p
    for (i = 0; i < this.points.length; i++) {
      p = this.points[i]
      if (p.x <= minX) {
        minX = p.x
      }
      if (p.y <= minY) {
        minY = p.y
      }
      if (p.x >= maxX) {
        maxX = p.x
      }
      if (p.y >= maxY) {
        maxY = p.y
      }
    }
    return {
      x1: minX,
      y1: minY,
      x2: maxX,
      y2: maxY
    }
  }
}
