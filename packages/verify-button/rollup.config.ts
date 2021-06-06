import typescript from '@rollup/plugin-typescript'

import pkg from './package.json'

const plugins = [typescript({ tsconfig: './tsconfig.json' })]

export default {
  input: './src/index.ts',

  output: [
    {
      file: pkg.module,
      format: 'es',
    },
    {
      file: pkg.main,
      format: 'umd',
      name: 'VerifyButtonElement',
      exports: 'named',
    },
  ],

  plugins,
}
