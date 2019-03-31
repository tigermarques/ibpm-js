const request = require('request-promise')
const buildConfig = require('./common').buildConfig

module.exports = {
  getByFilter: (config, filter) => {
    return request.get(`${config.restUrl}/users?filter=${filter}&includeDeleted=false&parts=all`,
      buildConfig(config))
  },

  getByNameOrId: (config, usernameOrId) => {
    return request.get(`${config.restUrl}/user/${usernameOrId}?parts=all`,
      buildConfig(config))
  },

  updatePreference: (config, usernameOrId, key, value) => {
    return request.put(`${config.restUrl}/user/${usernameOrId}?action=setPreference&key=${key}&value=${value}`,
      buildConfig(config))
  }
}
