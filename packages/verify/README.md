# @persona-js/verify

An unofficial Persona client to verify customers

## Install

```sh
npx i @persona-js/verify
```

## Usage (Expected)


```ts
import { newInquiry } from '@persona-js/verify'

const verificationWithPersona = newInquiry('template_id').on('start', () => { /* what I want to do on start inquiry flow */ })

verificationWIthPersona.on('complete', () => { /* what I want to do on complete inquiry flow */ })

verificationWithPersona.prefill({ ... })

verificationWithPersona.start()
verificationWithPersona.getHostedFlowUrl()
```

## License

MIT
