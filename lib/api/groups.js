const request = require('request')
const { buildConfig, buildResponseHandler } = require('./common')
const { HTTP_STATUS } = require('../utils/Constants')

module.exports = {
  getByFilter: (config, filter) => new Promise((resolve, reject) => {
    request.get(`${config.restUrl}/groups?filter=${filter}&includeDeleted=false&parts=all`,
      buildConfig(config), buildResponseHandler(resolve, reject))
  }),

  getByNameOrId: (config, nameOrId) => new Promise((resolve, reject) => {
    request.get(`${config.restUrl}/group/${nameOrId}?parts=all`,
      buildConfig(config), buildResponseHandler(resolve, reject))
  }).catch(error => {
    if (error.status !== HTTP_STATUS.UNAUTHORIZED) {
      error.data = {
        errorNumber: error.data.Data.errorNumber,
        errorMessage: error.data.Data.errorMessage
      }
    }
    throw error
  })
}
