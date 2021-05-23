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

const BACKDROP_SEAL_STYLE =
  'div#persona-js-embedded-flow{visibility:hidden;background-color:#00000000}@media only screen and (min-width:600px) and (min-height:600px){div#persona-js-embedded-flow iframe{margin-top:68px}}'
const BACKDROP_STYLE =
  'div#persona-js-embedded-flow{position:absolute;top:0;bottom:0;left:0;right:0;width:100%;height:100vh;background-color:#000000AA;overflow-y:scroll;transition:background-color .2s ease-out}div#persona-js-embedded-flow iframe{position:absolute;width:100%;height:100%;margin-right:auto;margin-left:auto;margin-bottom:10%;left:0;right:0;border-radius:4px;border:none;background:#fff}@media only screen and (min-width:600px) and (min-height:600px){div#persona-js-embedded-flow iframe{margin-top:64px;max-width:400px;max-height:650px;box-shadow:0 12px 40px 2px rbga(0,0,0,.4);transition:margin-top .25s ease-out}}'

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

export enum EventType {
  Start = 'start',
  Complete = 'complete',
  Fail = 'fail',
  Load = 'load',
  Exit = 'exit',
}

const generateClient = (normalizedOptions: NewInquiryNormalizedOptions | ResumeInquiryNormalizedOptions) => {
  const listeners: Record<EventType, ((inquiryId?: string) => void)[]> = {
    start: [],
    complete: [],
    fail: [],
    load: [],
    exit: [],
  }
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

  const on = (eventName: EventType, listener: (inquiryId?: string) => void) => {
    listeners[eventName].push(listener)
    return client
  }

  const prefill = (prefillParams: CommonOptions['prefill']) => {
    prefills = { ...prefills, ...prefillParams }
  }

  const createBackDrop = (): HTMLDivElement => {
    const backdrop = document.createElement('div')
    backdrop.id = 'persona-js-embedded-flow'
    const style = document.createElement('style')
    style.className = 'backdrop'
    style.innerText = BACKDROP_STYLE
    backdrop.appendChild(style)
    return backdrop
  }

  const sealBackdrop = (backdrop: HTMLDivElement): HTMLStyleElement => {
    const seal = document.createElement('style')
    seal.className = 'veil'
    seal.innerText = BACKDROP_SEAL_STYLE
    backdrop.appendChild(seal)
    return seal
  }

  const buildIframe = (): HTMLIFrameElement => {
    const iframe = document.createElement('iframe')
    iframe.allow = 'camera'
    iframe.src = `https://${normalizedOptions.host}/widget${getSearchParam()}&iframe-origin=${encodeURIComponent(
      window.location.origin,
    )}`
    iframe.setAttribute('sandbox', IFRAME_SANDBOX_PERMISSIONS.join(' '))
    return iframe
  }

  const preload = (): Promise<void> => {
    return new Promise((resolve) => {
      const backdrop = createBackDrop()
      sealBackdrop(backdrop)

      const messageHandler = (event: MessageEvent) => {
        if (event.origin.includes(`//${normalizedOptions.host}`)) {
          if (event.data.name === 'load') {
            window.removeEventListener('message', messageHandler)
            resolve()
          }
        }
      }
      window.addEventListener('message', messageHandler)

      document.body.appendChild(backdrop)
      backdrop.appendChild(buildIframe())
    })
  }

  const start = () => {
    const backdrop = (document.getElementById('persona-js-embedded-flow') as HTMLDivElement) ?? createBackDrop()
    const seal = backdrop.querySelector('style.veil') ?? sealBackdrop(backdrop)
    const iframe = backdrop.querySelector('iframe') ?? buildIframe()

    const messageHandler = (event: MessageEvent) => {
      const closeEmbededFlow = () => {
        window.removeEventListener('message', messageHandler)
        backdrop.remove()
      }

      if (event.origin.includes(`//${normalizedOptions.host}`)) {
        switch (event.data.name) {
          case 'load': {
            seal.remove()
            break
          }
          case 'start': {
            listeners[EventType.Start].forEach((listener, i) => {
              try {
                listener(event.data.metadata.inquiryId)
              } catch {
                console.error('[@persona-js/verify]', `Failed to run 'start' event listener #${i}`)
              }
            })
            break
          }
          case 'complete': {
            listeners[EventType.Complete].forEach((listener, i) => {
              try {
                listener(event.data.metadata.inquiryId)
              } catch {
                console.error('[@persona-js/verify]', `Failed to run 'complete' event listener #${i}`)
              }
            })
            closeEmbededFlow()
            break
          }
          case 'fail': {
            listeners[EventType.Fail].forEach((listener, i) => {
              try {
                listener(event.data.metadata.inquiryId)
              } catch {
                console.error('[@persona-js/verify]', `Failed to run 'fail' event listener #${i}`)
              }
            })
            break
          }
          case 'exit':
            listeners[EventType.Exit].forEach((listener, i) => {
              try {
                listener(event.data.metadata.inquiryId ?? null)
              } catch {
                console.error('[@persona-js/verify]', `Failed to run 'exit' event listener #${i}`)
              }
            })
            closeEmbededFlow()
            break
        }
      }
    }
    window.addEventListener('message', messageHandler)

    if (document.getElementById('persona-js-embedded-flow')) {
      seal.remove()
    } else {
      document.body.appendChild(backdrop)
      backdrop.appendChild(iframe)
    }
  }

  const getHostedFlowUrl = () => {
    return `https://${normalizedOptions.host}/verify${getSearchParam()}`
  }

  const client = {
    getHostedFlowUrl,
    on,
    prefill,
    preload,
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
