import Pad from './pad'
import simplify from 'simplify-js'
import Events from './events'
import Match from './match'
import PATTERNDATA from './malayalam.json'

export default class Mlhand {
  constructor (options) {
    this.canvasElement = options.canvas
    this.onResult = options.onResult
    this.threshold = options.threshold || 0.85
    this.events = new Events()
    this.pad = null
    this.timer = null
    this.debug = options.debug
    this.segments = []
    this.TIMEOUT = 1500
    this.init()
  }

  init () {
    this.pad = new Pad({
      canvas: this.canvasElement,
      events: this.events
    })

    this.pad.listen()

    this.events.subscribe('/draw/pen/down', this.onPenDown.bind(this))
    this.events.subscribe('/draw/pen/up', this.onPenUp.bind(this))
  }

  createPreviousCanvas () {
    let prevCanvas = this.canvasElement.cloneNode(true)
    if (!prevCanvas.classList) {
      prevCanvas.className = 'inactive'
    } else {
      prevCanvas.classList.add('inactive')
    }
    this.canvasElement.insertAdjacentElement('afterend', prevCanvas)
    return prevCanvas
  }

  onPenDown (data) {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }

  onPenUp (data) {
    let simplifiedPoints, translatedPoints
    if (data.points.length <= 1) return
    if (this.timer) {
      clearTimeout(this.timer)
    }
    if (this.debug) {
      simplifiedPoints = simplify(data.points, 1, true)
      console.debug('Simplifed ' + data.points.length + ' points to ' + simplifiedPoints.length + ' points.')
      let box = this.pad.getBoundingBox()
      translatedPoints = this.translate(simplifiedPoints, box)
      console.debug(JSON.stringify(translatedPoints))
    }
    let match = new Match(PATTERNDATA, this.threshold)
    let result = match.run(data.points)
    this.onResult(result)
    this.timer = setTimeout(this.pushSegment.bind(this, data.points), this.TIMEOUT)
  }

  pushSegment (points) {
    this.segments.push(points)
    if (!this.previousPad) {
      this.previousPad = new Pad({
        canvas: this.createPreviousCanvas(),
        events: this.events
      })
    }
    this.pad.clear()
    this.previousPad.clear()
    this.previousPad.setPoints(points)
    this.previousPad.draw()
    this.previousPad.canvas.style.left = `${-1 * this.canvasElement.width * 0.9}px`
  }

  translate (points, box) {
    let translatedPoints = []

    for (let i = 0; i < points.length; i++) {
      let p = points[i]
      translatedPoints.push({
        x: p.x - box.x1,
        y: p.y - box.y1
      })
    }
    return translatedPoints
  }
}
