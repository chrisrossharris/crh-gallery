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
      <svg class="Media ${styles.logo__media}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 298.6 113.9">
        <g id="close">
          <path class="st0" d="M125.3,33l16.8,16.8"/>
          <path class="st0" d="M149.6,56.7l23.7,24.3"/>
          <path class="st0" d="M173.3,33l-48,48"/>
        </g>

        <g id="logo">
          <path fill="none" d="M88.9,90.8c-18.7,18.7-49,18.7-67.8,0S2.4,41.7,21.1,23s49-18.7,67.8,0"/>
          <path fill="none" d="M150.2,8.9h-32.1v96 M150.2,72.9c17.7,0,32.1-14.3,32.1-32s-14.4-32-32.1-32 M182.3,104.9
          	c0-17.7-14.4-32-32.1-32h-32.1"/>
          <path fill="none" d="M287.4,104.9v-96 M208.2,8.9v96 M208.2,72.9h79.2"/>
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

    if (this.route.indexOf('/exhibits/') > -1) {
      this.emit('change', '/exhibits')
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
