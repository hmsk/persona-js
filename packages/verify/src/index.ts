interface CommonOptions {
  host: string
  language: string
  prefill?: {
    nameFirst?: string
    nameLast?: string
    birthdate?: string
    addressStreet1?: string
    addressCity?: string
    addressSubdivision?: string
    addressPostalCode?: string
    countryCode?: string
    phoneNumber?: string
    emailAddress?: string
  }
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

const BACKDROP_STYLE = `
  @keyframes appear-backdrop {
    from {
      background-color: #00000000;
    }

    to {
      background-color: #000000AA;
    }
  }

  div#persona-js-embedded-flow {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100vh;
    background-color: #000000AA;
    overflow-y: scroll;

    animation-duration: .1s;
    animation-name: appear-backdrop;
    animation-timing-function: ease-out;
  }

  @keyframes appear-iframe {
    from {
      margin-top: 68px;
    }

    90% {
      margin-top: 62px;
    }

    to {
      margin-top: 64px;
    }
  }

  div#persona-js-embedded-flow iframe {
    position: absolute;
    width: 100%;
    height: 100%;
    margin-right: auto;
    margin-left: auto;
    margin-bottom: 10%;
    left: 0;
    right: 0;
    border-radius: 4px;
    border: none;
    background: white;

  }

  @media only screen and (min-width: 600px) and (min-height: 600px) {
    div#persona-js-embedded-flow iframe {
      margin-top: 64px;
      max-width: 400px;
      max-height: 650px;
      box-shadow: 0 12px 40px 2px rbga(0, 0, 0, 0.4);

      animation-duration: .2s;
      animation-name: appear-iframe;
      animation-timing-function: ease-out;
    }
  }
`

const camelToKebab = (camel: string) =>
  camel
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1-$2')
    .toLowerCase()

interface CommonNormalizedOptions {
  host: string
  language: string | null
  prefill: CommonOptions['prefill'] | null
}

interface NewInquiryNormalizedOptions extends CommonNormalizedOptions {
  'template-id': string
  environment: string
  'reference-id': string | null
  'account-id': string | null
}

interface ResumeInquiryNormalizedOptions extends CommonNormalizedOptions {
  'inquiry-id': string
  'session-token': string | null
}

const generateClient = (normalizedOptions: NewInquiryNormalizedOptions | ResumeInquiryNormalizedOptions) => {
  const listeners = []
  let prefills = { ...normalizedOptions.prefill }
  const givenOptions: NewInquiryNormalizedOptions | ResumeInquiryNormalizedOptions = {
    ...normalizedOptions,
    prefill: null,
  }

  const getSearchParam = () => {
    const basicParams = Object.entries(givenOptions)
      .filter((keyAndValue): keyAndValue is [string, string] => {
        return keyAndValue[1] !== null && keyAndValue[0] !== 'host'
      })
      .reduce((query, [key, value]) => {
        return `${query}&${key}=${encodeURIComponent(value)}`
      }, `?client=something`)

    const prefillQueries = Object.entries(prefills)
      .filter((prefillKeyAndValue): prefillKeyAndValue is [string, string] => prefillKeyAndValue[1] !== undefined)
      .map(([prefillKey, prefillValue]) => `prefill[${camelToKebab(prefillKey)}]=${encodeURIComponent(prefillValue)}`)
      .join('&')

    return [basicParams, prefillQueries].join('&')
  }

  const on = (eventName: 'complete' | 'fail' | 'start', listener: (inquiryId: string) => void) => {
    listeners.push(listener)
    return client
  }

  const prefill = (prefillParams: CommonOptions['prefill']) => {
    prefills = { ...prefills, ...prefillParams }
  }

  const start = () => {
    const backdrop = document.createElement('div')
    backdrop.id = 'persona-js-embedded-flow'
    const style = document.createElement('style')
    style.innerText = BACKDROP_STYLE.replace(/^\s+/g, '').replace(/\n/g, '')
    backdrop.appendChild(style)

    const iframe = document.createElement('iframe')
    iframe.allow = 'camera'
    iframe.src = `https://${normalizedOptions.host}/widget${getSearchParam()}&iframe-origin=${encodeURIComponent(
      window.location.origin,
    )}`
    iframe.setAttribute('sandbox', IFRAME_SANDBOX_PERMISSIONS.join(' '))

    const messageHandler = (event: MessageEvent) => {
      if (event.origin.includes(`//${normalizedOptions.host}`)) {
        switch (event.data.name) {
          case 'exit':
            window.removeEventListener('message', messageHandler)
            backdrop.remove()
            break
        }
      }
    }

    window.addEventListener('message', messageHandler)

    document.body.appendChild(backdrop)
    backdrop.appendChild(iframe)
  }

  const getHostedFlowUrl = () => {
    return `https://${normalizedOptions.host}/verify${getSearchParam()}`
  }

  const client = {
    getHostedFlowUrl,
    on,
    prefill,
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
    prefill: options?.prefill ?? null,
  })
}

export const resumeInquiry = (inquiryId: string, options?: ResumeInquiryOptions) => {
  return generateClient({
    'inquiry-id': inquiryId,
    host: options?.host ?? 'withpersona.com',
    language: options?.language ?? null,
    'session-token': options?.sessionToken ?? null,
    prefill: options?.prefill ?? null,
  })
}
