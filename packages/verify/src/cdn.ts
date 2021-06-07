import * as Verify from './index'

declare global {
  interface Window {
    Persona: typeof Verify
  }
}

if (window) window.Persona = Verify
