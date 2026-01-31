import baseConfig from '@veil/eslint-config/base'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...baseConfig,
  {
    ignores: ['dist/'],
  },
]
