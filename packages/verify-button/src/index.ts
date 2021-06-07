export default class VerifyButtonElement extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })

    const wrapper = document.createElement('button')

    shadow.appendChild(wrapper)
  }
}

declare global {
  interface Window {
    VerifyButtonElement: typeof VerifyButtonElement
  }
}

if (!window.customElements.get('verify-button')) {
  window.VerifyButtonElement = VerifyButtonElement
  window.customElements.define('file-attachment', VerifyButtonElement)
}
