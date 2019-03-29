const organization = require('./api/organization')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const library = {
  organization
}

module.exports = library
