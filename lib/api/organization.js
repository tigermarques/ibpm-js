const request = require('request-promise')

module.exports = {
  groups: (config, filter) => {
    return request.get(`${config.restUrl}groups?filter=${filter}&includeDeleted=false&parts=all`, {
      auth: {
        username: config.username,
        password: config.password
      },
      headers: {
        'Content-Type': 'application/json'
      },
      json: true
    })
  }
}
