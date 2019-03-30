const App = require('./application')

function createInstance (config) {
  return new App(config)
}

module.exports = createInstance
