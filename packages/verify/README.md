# @persona-js/verify

[![npm](https://img.shields.io/npm/v/@persona-js/verify.svg?style=for-the-badge)](https://www.npmjs.com/package/@persona-js/verify)

An unofficial Persona client to verify customers

## Install

```sh
npx i @persona-js/verify
```

## Usage

```ts
import { newInquiry } from '@persona-js/verify'

const TEMPLATE_ID = 'tmpl_xyzxyzxyz'

const verificationWithPersona = newInquiry(TEMPLATE_ID)

// prefilling
verificationWithPersona.prefill({ nameFirst: 'Kengo' })

// Also constructor function can accepts prefiling
newInquiry(TEMPLATE_ID, { prefill: { nameFirst: 'Kengo' } })

verificationWithPersona.start() //=> Embedded flow starts on current window
verificationWithPersona.getHostedFlowUrl() //=> Returns URL for the hosted flow

// Unsupported yet
verificationWIthPersona.on('start', () => { /* what I want to do on start inquiry flow */ })
verificationWIthPersona.on('complete', () => { /* what I want to do on complete inquiry flow */ })
```

## License

MIT
