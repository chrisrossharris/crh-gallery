import Loader from 'assets-loader'
import WebFontLoader from 'webfontloader'

import { TweenMax } from 'gsap'
import { each } from 'lodash'

import Element from '../../classes/Element'

import styles from './styles.scss'

import Data from '../../data/Work'

export default class extends Element {
  constructor () {
    super({
      element: 'div',
      name: 'Preloader'
    })

    this.element.className = `Preloader ${styles.preloader}`
    this.element.innerHTML = `
      <svg class="${styles.preloader__media}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40.6 80.2">
        <path class="Path" fill="none" d="M3.4,49.9c-5.4,5.4-14.2,5.4-19.7,0s-5.4-14.2,0-19.7s14.2-5.4,19.7,0"/>
      	<path class="Path" fill="none" d="M21.2,26.2h-9.3V54 M21.2,44.7c5.1,0,9.3-4.1,9.3-9.3s-4.2-9.3-9.3-9.3 M30.5,54c0-5.1-4.2-9.3-9.3-9.3h-9.3"
      		/>
      	<path class="Path" fill="none" d="M61,54V26.2 M38,26.2V54 M38,44.7h23"/>

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
