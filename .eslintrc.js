module.exports = {
  parserOptions: {
    sourceType: 'module'
  },
  parser: 'babel-eslint',
  env: {
    node: true,
    mocha: true
  },
  extends: [
    'standard'
  ],
  rules: {
    'promise/catch-or-return': 'error'
  }
}
