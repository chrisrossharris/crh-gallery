import { Power2, TimelineMax, TweenMax } from 'gsap'

import Element from '../../classes/Element'
import SVGMorpheus from '../../plugins/SVGMorpheus'

import { Detection } from '../../classes/Detection'

import styles from './styles.scss'

const CENTER = 'center'
const TOP = 'top'

export default class extends Element {
  constructor () {
    super({
      appear: true,
      element: 'button',
      name: 'Logo'
    })

    this.element.className = `Logo ${styles.logo}`
    this.element.innerHTML = `
      <svg class="Media ${styles.logo__media}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 278.95 118.95">
        <g>
          <path d="M91.8,37.52C89.49,22.98,76.68,8.87,54.21,8.87c-28.51,0-45.5,21.17-45.5,50.54c0,30.53,17.71,50.83,44.93,50.83
            c23.9,0,37.44-16.85,39.6-35.71h2.02c-0.86,9.79-5.04,19.15-12.1,26.21c-6.91,6.91-16.85,11.52-29.52,11.52
            c-28.22,0-47.09-20.88-47.09-52.85c0-30.67,18.29-52.56,47.66-52.56c23.62,0,37.15,14.98,39.6,30.67H91.8z"/>
          <path d="M111.95,110.96h-2.16V8h38.59c19.01,0,31.54,9.65,31.54,27.36c0,13.82-6.62,23.47-21.31,26.06
            c12.82,2.16,18.43,10.8,18.86,24.48c0.58,21.6,2.88,23.47,4.18,24.77v0.29h-2.45c-1.01-1.01-3.31-3.89-3.89-24.48
            c-0.43-14.69-6.91-23.62-23.76-23.76h-39.6V110.96z M111.95,60.7h35.42c20.74,0,30.38-9.22,30.38-25.34
            c0-16.27-11.52-25.34-29.38-25.34h-36.43V60.7z"/>
          <path d="M195.62,8h2.16v47.09h70.7V8h2.16v102.96h-2.16V57.1h-70.7v53.85h-2.16V8z"/>
        </g>
      </svg>
    `

    this.elements = {
      media: this.element.querySelector('.Media')
    }

    this.enable()
    this.setup()
  }

  setup () {
    this.morpheus = new SVGMorpheus(this.elements.media)

    this.hover = new TimelineMax({ paused: true })
    this.hover.to(this.element, 1, {
      ease: Power2.easeOut,
      rotation: '+= 180',
      x: '-50%',
      y: '-50%'
    })
  }

  disable () {
    this.isEnabled = false
  }

  enable () {
    this.isEnabled = true
  }

  show () {
    TweenMax.set(this.element, {
      autoAlpha: 1
    })

    return super.show()
  }

  hide () {
    TweenMax.set(this.element, {
      autoAlpha: 0
    })

    return super.hide()
  }

  click () {
    if (!this.isEnabled) return

    if (this.route.indexOf('/project/') > -1) {
      this.emit('change', '/work')
    } else {
      this.emit('change', '/')
    }
  }

  hover () {
    if (this.state === TOP) {
      this.morpheus.to('close', {
        duration: 1000,
        rotation: 'random'
      })
    }
  }

  addEventListeners () {
    this.element.addEventListener('click', this.click)

    if (!Detection.isMobile()) {
      this.element.addEventListener('mouseenter', this.hover)
    }
  }

  removeEventListeners () {
    this.element.removeEventListener('click', this.click)

    if (!Detection.isMobile()) {
      this.element.removeEventListener('mouseenter', this.hover)
    }
  }

  onRoute (route) {
    this.route = route

    if (route === '/') {
      this.morpheus.to('logo', {
        duration: 1000,
        rotation: 'random'
      })

      TweenMax.to(this.element, 1, {
        left: '50%',
        top: '50%'
      })

      this.state = CENTER
    } else {
      this.morpheus.to('close', {
        duration: 1000,
        rotation: 'random'
      })

      TweenMax.to(this.element, 1, {
        left: '50%',
        top: 100
      })

      this.state = TOP
    }
  }
}
