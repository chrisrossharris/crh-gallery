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
      <svg class="Media ${styles.logo__media}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40.6 80.2">
        <g id="close">
          <path fill="none" d="M11.3,31.1l6.3,6.3" />
          <path fill="none" d="M20.4,40l8.9,9.1" />
          <path fill="none" d="M29.3,31.1l-18,18" />
        </g>

        <g id="logo">
        <path fill="none" d="M3.4,49.9c-5.4,5.4-14.2,5.4-19.7,0s-5.4-14.2,0-19.7s14.2-5.4,19.7,0"/>
      	<path fill="none" d="M21.2,26.2h-9.3V54 M21.2,44.7c5.1,0,9.3-4.1,9.3-9.3s-4.2-9.3-9.3-9.3 M30.5,54c0-5.1-4.2-9.3-9.3-9.3h-9.3"
      		/>
      	<path fill="none" d="M61,54V26.2 M38,26.2V54 M38,44.7h23"/>
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

    if (this.route.indexOf('/exhibit/') > -1) {
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
