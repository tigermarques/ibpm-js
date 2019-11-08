const request = require('request')
const { buildConfig, buildResponseHandler } = require('./common')
const { HTTP_STATUS } = require('../utils/Constants')

module.exports = {
  getByFilter: (config, filter) => new Promise((resolve, reject) => {
    request.get(`${config.restUrl}/users?filter=${filter}&includeDeleted=false&parts=all`,
      buildConfig(config), buildResponseHandler(resolve, reject))
  }),

  getByNameOrId: (config, usernameOrId) => new Promise((resolve, reject) => {
    request.get(`${config.restUrl}/user/${usernameOrId}?parts=all`,
      buildConfig(config), buildResponseHandler(resolve, reject))
  }).catch(error => {
    if (error.status !== HTTP_STATUS.UNAUTHORIZED) {
      error.data = {
        errorNumber: error.data.Data.errorNumber,
        errorMessage: error.data.Data.errorMessage
      }
    }
    throw error
  }),

  updatePreference: (config, usernameOrId, key, value) => new Promise((resolve, reject) => {
    request.put(`${config.restUrl}/user/${usernameOrId}?action=setPreference&key=${key}&value=${value}`,
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
