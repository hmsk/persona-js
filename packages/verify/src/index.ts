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
    const iframeUrl = `https://${host}/widget/${templateId}&environment=${environment}`;
    alert(iframeUrl);
    /*
      Build this programmatically
      <iframe
        allow='camera'
        sandbox='allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-top-navigation-by-user-activation'
        frameBorder='0'
        src={baseUrl + '/widget' + queryParams}
      ></iframe>
    */
  };

  const getHostedFlowUrl = () => {
    const hostedUrl = `https://${host}/verify?template-id=${templateId}&environment=${environment}`;
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
