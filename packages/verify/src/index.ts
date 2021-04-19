interface CommonOptions {
  host: string
  language: string
}

interface CreateInquiryOptions extends CommonOptions {
  environment?: 'sandbox' | 'production'
  referenceId?: string
  accountId?: string
}

interface ResumeInquiryOptions extends CommonOptions {
  sessionToken: string
}

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

interface NewInquiryNormalizedOptions {
  'template-id': string
  host: string
  language: string | null
  environment: string
  'reference-id': string | null
  'account-id': string | null
}

interface ResumeInquiryNormalizedOptions {
  'inquiry-id': string
  host: string
  language: string | null
  'session-token': string | null
}

const generateClient = (normalizedOptions: NewInquiryNormalizedOptions | ResumeInquiryNormalizedOptions) => {
  const listeners = []

  const search = Object.entries(normalizedOptions)
    .filter(([key, value]) => {
      return value !== null && key !== 'host'
    })
    .reduce((query, [key, value]) => {
      return `${query}&${key}=${encodeURIComponent(value)}`
    }, `?client=something`)

  const on = (eventName: 'complete' | 'fail' | 'start', listener: (inquiryId: string) => void) => {
    listeners.push(listener)
    return client
  }

  const start = () => {
    const backdrop = document.createElement('div')
    backdrop.id = 'persona-js-embedded-flow'
    backdrop.setAttribute('style', BACKDROP_STYLE.replace(/^\s+/g, '').replace(/\n/g, ''))

    const iframe = document.createElement('iframe')
    iframe.allow = 'camera'
    iframe.src = `https://${normalizedOptions.host}/widget${search}&iframe-origin=${encodeURIComponent(
      window.location.origin,
    )}`
    iframe.setAttribute('sandbox', IFRAME_SANDBOX_PERMISSIONS.join(' '))
    iframe.setAttribute('style', IFRAME_STYLE.replace(/^\s+/g, '').replace(/\n/g, ''))

    backdrop.appendChild(iframe)
    document.body.appendChild(backdrop)
  }

  const getHostedFlowUrl = () => {
    const hostedUrl = `https://${normalizedOptions.host}/verify${search}`
    alert(hostedUrl)
  }

  const client = {
    getHostedFlowUrl,
    on,
    prefill: () => {},
    start,
  }

  return client
}

export const newInquiry = (templateId: string, options?: CreateInquiryOptions) => {
  return generateClient({
    'template-id': templateId,
    host: options?.host ?? 'withpersona.com',
    language: options?.language ?? null,
    environment: options?.environment ?? 'sandbox',
    'reference-id': options?.referenceId ?? null,
    'account-id': options?.accountId ?? null,
  })
}

export const resumeInquiry = (inquiryId: string, options?: ResumeInquiryOptions) => {
  return generateClient({
    'inquiry-id': inquiryId,
    host: options?.host ?? 'withpersona.com',
    language: options?.language ?? null,
    'session-token': options?.sessionToken ?? null,
  })
}
