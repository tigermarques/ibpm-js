const request = require('request')
const { buildConfig, buildResponseHandler } = require('./common')
const { HTTP_STATUS } = require('../utils/Constants')

/**
 * @typedef {object} UserDetails
 * @property {number} userID - User internal ID
 * @property {string} userName - User name
 * @property {string} fullName - User full name
 * @property {string} emailAddress - User email address
 * @property {object} userPreferences - User attributes. Each key represents the attribute's name, and the corresponding value represents the attribute's value
 * @property {Array.<string>} memberships - List of groups that this user belongs to
 */

/**
 * @typedef {object} UsersGetByFilterAPIResponse - Inherits `status` and `message` from {@link APIResponse} and overrides the `data` property
 * @augments APIResponse
 * @property {Array.<UserDetails>} data - list of users
 */

/**
 * @typedef {object} UsersGetByNameOrIdAPIResponse - Inherits `status` and `message` from {@link APIResponse} and overrides the `data` property
 * @augments APIResponse
 * @property {UserDetails} data - user details
 */

/**
 * @typedef {object} UsersUpdatePreferenceAPIResponse - Inherits `status` and `message` from {@link APIResponse} and overrides the `data` property
 * @augments APIResponse
 * @property {UserDetails} data - user details updated with the new attribute values
 */

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
