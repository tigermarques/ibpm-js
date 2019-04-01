const request = require('request')
const { buildConfig, buildResponseHandler } = require('./common')

module.exports = {
  getByFilter: (config, filter) => new Promise((resolve, reject) => {
    request.get(`${config.restUrl}/groups?filter=${filter}&includeDeleted=false&parts=all`,
      buildConfig(config), buildResponseHandler(resolve, reject))
  }),

  getByNameOrId: (config, nameOrId) => new Promise((resolve, reject) => {
    request.get(`${config.restUrl}/group/${nameOrId}?parts=all`,
      buildConfig(config), buildResponseHandler(resolve, reject))
  })
}
