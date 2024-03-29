module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  parserOptions: { ecmaVersion: 8 },
  ignorePatterns: ['**/dist', 'examples/next/pages/*.js'], // TODO: TSnize Next sample
  extends: ['eslint:recommended', 'prettier'],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      settings: { react: { version: 'detect' } },
      env: {
        browser: true,
        node: true,
        es6: true,
      },
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
      plugins: ['simple-import-sort'],
      rules: {
        eqeqeq: 'error',
      },
    },
  ],
}
