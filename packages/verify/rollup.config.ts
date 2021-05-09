import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

import pkg from './package.json'

const tsPlugin = typescript({ tsconfig: './tsconfig.json' })

export default [
  {
    input: './src/index.ts',

    output: {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
    },

    plugins: [tsPlugin],
  },
  {
    input: './src/cdn.ts',

    output: {
      file: './dist/cdn.js',
      format: 'iife',
    },

    plugins: [tsPlugin, terser({ format: { comments: false } })],
  },
]
