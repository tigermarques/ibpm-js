const request = require('request')
const { buildConfig, buildResponseHandler } = require('./common')

module.exports = {
  getByFilter: (config, filter) => new Promise((resolve, reject) => {
    request.get(`${config.restUrl}/users?filter=${filter}&includeDeleted=false&parts=all`,
      buildConfig(config), buildResponseHandler(resolve, reject))
  }),

  getByNameOrId: (config, usernameOrId) => new Promise((resolve, reject) => {
    request.get(`${config.restUrl}/user/${usernameOrId}?parts=all`,
      buildConfig(config), buildResponseHandler(resolve, reject))
  }),

  updatePreference: (config, usernameOrId, key, value) => new Promise((resolve, reject) => {
    request.put(`${config.restUrl}/user/${usernameOrId}?action=setPreference&key=${key}&value=${value}`,
      buildConfig(config), buildResponseHandler(resolve, reject))
  })
}
