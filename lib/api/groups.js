const request = require('request-promise')
const buildConfig = require('./common').buildConfig

module.exports = {
  getByFilter: (config, filter) => {
    return request.get(`${config.restUrl}/groups?filter=${filter}&includeDeleted=false&parts=all`,
      buildConfig(config))
  },

  getByNameOrId: (config, nameOrId) => {
    return request.get(`${config.restUrl}/group/${nameOrId}?parts=all`,
      buildConfig(config))
  }
}
