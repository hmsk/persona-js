const verifyClient = (templateId: string, host?: string) => {
  const id = templateId
  const hostName = host ?? 'withpersona.com'
  const listeners = []

  const on = (eventName: 'complete' | 'fail' | 'start', listener: (inquiryId: string) => void) => {
    listeners.push(listener)
    return self
  }

  const start = () => {
    const iframeUrl = `https://${hostName}/verify/${templateId}`
    alert(iframeUrl)
  }

  const self = {
    getHostedFlowUrl: () => {},
    on,
    prefill: () => {},
    start,
  }

  return self
}

export default verifyClient
