import typescript from '@rollup/plugin-typescript'

import pkg from './package.json'

const plugins = [typescript({ tsconfig: './tsconfig.json' })]

export default [{
  input: './src/index.ts',

  output: {
    file: pkg.main,
    format: 'cjs',
    exports: 'named',
  },

  plugins
}, {
  input: './src/cdn.ts',

  output: {
    file: './dist/cdn.js',
    format: 'iife'
  },

  plugins

}]
