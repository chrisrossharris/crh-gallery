import Loader from 'assets-loader'
import WebFontLoader from 'webfontloader'

import { TweenMax } from 'gsap'
import { each } from 'lodash'

import Element from '../../classes/Element'

import styles from './styles.scss'

import Data from '../../data/Exhibits'

export default class extends Element {
  constructor () {
    super({
      element: 'div',
      name: 'Preloader'
    })

    this.element.className = `Preloader ${styles.preloader}`
    this.element.innerHTML = `
      <svg class="${styles.preloader__media}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 298.6 113.9">
        <path class="Path" fill="none" d="M88.9,90.8c-18.7,18.7-49,18.7-67.8,0S2.4,41.7,21.1,23s49-18.7,67.8,0"/>
        <path class="Path" fill="none" d="M150.2,8.9h-32.1v96 M150.2,72.9c17.7,0,32.1-14.3,32.1-32s-14.4-32-32.1-32 M182.3,104.9
          c0-17.7-14.4-32-32.1-32h-32.1"/>
        <path class="Path" fill="none" d="M287.4,104.9v-96 M208.2,8.9v96 M208.2,72.9h79.2"/>
      </svg>
    `

    this.elements = {
      path: this.element.querySelectorAll('.Path')
    }

    this.assets = []

    this.setup()
    this.show()
  }

  setup () {
    each(this.elements.path, path => {
      path.style.strokeDasharray = `${path.getTotalLength()}px`
      path.style.strokeDashoffset = `${path.getTotalLength()}px`
    })

    each(Data, data => {
      this.assets.push(data.image)
    })

    Loader({ assets: this.assets }).on('progress', this.onProgress).on('complete', this.onComplete).start()
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

  onProgress (progress) {
    this.element.style.visibility = 'visible'

    each(this.elements.path, path => {
      const length = path.getTotalLength() - (path.getTotalLength() * progress)

      path.style.strokeDashoffset = `${length}px`
    })
  }

  onComplete (assets) {
    each(this.elements.path, path => {
      path.style.strokeDashoffset = 0
    })

    TweenMax.delayedCall(0.5, () => {
      WebFontLoader.load({
        custom: {
          families: ['neue-haas-unica']
        },
        urls: [
          require('../../styles/fonts.scss')
        ],
        active: () => {
          this.emit('preloaded', assets)
          this.hide()
        }
      })
    })
  }
}
