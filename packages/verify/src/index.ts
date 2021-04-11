const IFRAME_SANDBOX_PERMISSIONS = [
  'allow-same-origin',
  'allow-scripts',
  'allow-forms',
  'allow-popups',
  'allow-modals',
  'allow-top-navigation-by-user-activation'
]

const verifyClient = (
  templateId: string,
  environment: "sandbox" | "production" = "sandbox",
  host: string = "withpersona.com"
) => {
  const id = templateId;
  const listeners = [];

  const on = (
    eventName: "complete" | "fail" | "start",
    listener: (inquiryId: string) => void
  ) => {
    listeners.push(listener);
    return self;
  };

  const start = () => {
    const iframe = document.createElement("iframe");
    iframe.allow = "camera";
    iframe.src = `https://${host}/widget?template-id=${id}&environment=${environment}&iframe-origin=${window.location.origin}`;
    iframe.setAttribute(
      "sandbox",
      IFRAME_SANDBOX_PERMISSIONS.join(' ')
    );
    document.body.prepend(iframe);
  };

  const getHostedFlowUrl = () => {
    const hostedUrl = `https://${host}/verify?template-id=${id}&environment=${environment}`;
    alert(hostedUrl);
  };

  const self = {
    getHostedFlowUrl,
    on,
    prefill: () => {},
    start,
  };

  return self;
};

export default verifyClient;
