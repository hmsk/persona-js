# @persona-js/verify

An unofficial Persona client to verify customers

## Install

```
npx i @persona-js/verify
```

## Usage (Expected)

```ts
import Persona from '@persona-js/verify'

const verificationWithPersona = Persona('template_id').on('start', () => { /* what I want to do on start inquiry flow */ })

verificationWIthPersona.on('complete', () => { /* what I want to do on complete inquiry flow */ })

verificationWithPersona.start()
```

## License

MIT
