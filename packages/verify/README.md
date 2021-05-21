# @persona-js/verify

[![npm](https://img.shields.io/npm/v/@persona-js/verify.svg?style=for-the-badge)](https://www.npmjs.com/package/@persona-js/verify)

A vanilla JavaScript module to run embedded/hosted flow without any dependencies, against [the official npm module](https://www.npmjs.com/package/persona) which has some dependencies in both internally/externally. Its bundle size is much lighter, interface is more flexible.

⚠️ This package is still in beta and missing some features of the official module and thus, still not recommended using in production.

## Install

```sh
npx i @persona-js/verify
```

or load CDN version on the fly. This defines `window.Persona` where `newInquiry`, `resumeInquiry` belongs to.

```html
<script defer src="https://unpkg.com/@persona-js/verify@x.y.z/dist/cdn.js"></script>
```

## Usage

### Start a new inquiry

#### Embedded flow

```ts
import { newInquiry } from '@persona-js/verify'

const verificationWithPersona = newInquiry('tmpl_xyzxyzxyz')
verificationWithPersona.start()
```

#### Hosted flow

```ts
import { newInquiry } from '@persona-js/verify'

const verificationWithPersona = newInquiry('tmpl_xyzxyzxyz')
const url = verificationWithPersona.getHostedFlowUrl() //=> Returns URL for the hosted flow
window.open(url)
```

### Resume a incompleted inquiry

```ts
import { resumeInquiry } from `@persona-js/veerify`

const verificationWithPersona = resumeInquiry('inq_abcabcabc')
verificationWithPersona.start()
```

### Prefilling

```ts
import { newInquiry } from '@persona-js/verify'

const verificationWithPersona = newInquiry('tmpl_xyzxyzxyz')
verificationWithPersona.prefill({ nameFirst: 'Kengo' })
```

#### Also constructor function can accepts prefiling 

```ts
import { newInquiry } from '@persona-js/verify'

newInquiry('tmpl_xyzxyzxyz', { prefill: { nameFirst: 'Kengo' } })
```

### Event listening

```ts
import { newInquiry } from '@persona-js/verify'

const verificationWithPersona = newInquiry('tmpl_xyzxyzxyz')
verificationWithPersona.on('start', (inquiryId) => { /* what I want to do on starting inquiry flow */ })
```

### `.prefill`, `.on` is chainnable

```ts
import { newInquiry } from '@persona-js/verify'

newInquiry('tmpl_xyzxyzxyz')
  .prefill({ nameLast: 'Hamasaki' })
  .on('complete', (inquiryId) => { /* what I want to do on completing embedded flow */ })
  .on('fail', (inquiryId) => { /* what I want to do on failing embedded flow */ })
  .on('exit', () => { /* what I want to do on exiting embedded flow */ })
  .start()
```

### Preloading

```ts
import { newInquiry } from '@persona-js/verify'

const verificationWithPersona = newInquiry('tmpl_xyzxyzxyz')
const preload = verificationWithPersona.preload()

...

// preload is resolved if Persona's content is ready for starting embedded flow without any wait
preload.then(() => verificationWithPersona.start())
```

## License

MIT, Copyright 2021 Kengo Hamasaki <k.hamasaki@gmail.com>

## ToDo

- Use shadow DOM
- Avoid multiple UI insertions
- Support undocumented events?
  - Like `verification-change`, `country-select`...etc
- Support insertion into a specific element on HTML (inline flow)?
- Throw exceptions on unintentional parameters/arguments
- a11y
- ESM build
- Separate down the monolithic `index.ts`
- License
  - For each module
  - For cdn build
- Test
- Demo
  - Resume inquriy demo
  - Popup events from embedded flow
  - Do with TypeScript
