const IFRAME_SANDBOX_PERMISSIONS = [
  'allow-same-origin',
  'allow-scripts',
  'allow-forms',
  'allow-popups',
  'allow-modals',
  'allow-top-navigation-by-user-activation',
]

const IFRAME_STYLE = `
  position: absolute;
  width: 100%;
  height: 100%;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 10%;
  left: 0;
  right: 0;
  border-radius: 4px;
  border: 0;
  background: white;

  /*@media only screen and (min-width: 600px) and (min-height: 600px) {*/
    margin-top: 64px;
    max-width: 400px;
    max-height: 650px;
  /*}*/
`

const BACKDROP_STYLE = `
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;
  background-color: #000000AA;
  overflow-y: scroll;
`

const verifyClient = (
  templateId: string,
  environment: 'sandbox' | 'production' = 'sandbox',
  host: string = 'withpersona.com',
) => {
  const id = templateId
  const listeners = []

  const on = (eventName: 'complete' | 'fail' | 'start', listener: (inquiryId: string) => void) => {
    listeners.push(listener)
    return self
  }

  const start = () => {
    const backdrop = document.createElement('div')
    backdrop.id = 'persona-js-embedded-flow'
    backdrop.setAttribute('style', BACKDROP_STYLE.replace(/^\s+/g, '').replace(/\n/g, ''))

    const iframe = document.createElement('iframe')
    iframe.allow = 'camera'
    iframe.src = `https://${host}/widget?template-id=${id}&environment=${environment}&iframe-origin=${window.location.origin}`
    iframe.setAttribute('sandbox', IFRAME_SANDBOX_PERMISSIONS.join(' '))
    iframe.setAttribute('style', IFRAME_STYLE.replace(/^\s+/g, '').replace(/\n/g, ''))

    backdrop.appendChild(iframe)
    document.body.appendChild(backdrop)
  }

  const getHostedFlowUrl = () => {
    const hostedUrl = `https://${host}/verify?template-id=${id}&environment=${environment}`
    alert(hostedUrl)
  }

  const self = {
    getHostedFlowUrl,
    on,
    prefill: () => {},
    start,
  }

  return self
}

export default verifyClient
