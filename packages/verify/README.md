# @persona-js/verify

[![npm](https://img.shields.io/npm/v/@persona-js/verify.svg?style=for-the-badge)](https://www.npmjs.com/package/@persona-js/verify)

A vanilla JavaScript module to run embedded/hosted flow without any dependencies, against [the official npm module](https://www.npmjs.com/package/persona) which has some dependencies in both internally/externally.

⚠️ This package is still in beta and missing many features of official module, so don't recommend using in production.

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

// Event listening
verificationWIthPersona.on('start', (inquiryId) => { /* what I want to do on starting inquiry flow */ })

verificationWithPersona.getHostedFlowUrl() //=> Returns URL for the hosted flow
verificationWithPersona.start() //=> Embedded flow starts on current window

// Can chain
newInquiry(TEMPLATE_ID)
  .prefill({ nameLast: 'Hamasaki' })
  .on('complete', (inquiryId) => { /* what I want to do on completing embedded flow */ })
  .on('fail', (inquiryId) => { /* what I want to do on failing embedded flow */ })
  .on('exit', () => { /* what I want to do on exiting embedded flow */ })
```

## License

MIT

## ToDo

- Support preload embedded flow
  - `.preload(): Promise<void>`
- Support undocumented events?
  - Like `verification-change`, `country-select`...etc
- Support insertion into a specific element on HTML?
- Throw exceptions on unintentional parameters/arguments
- a11y
- Separate down the monolithic `index.ts`
- Test
- Demo
  - Resume inquriy demo
  - Popup events from embedded flow
  - Do with TypeScript
