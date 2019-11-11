const request = require('request')
const { buildConfig, buildResponseHandler } = require('./common')
const { HTTP_STATUS } = require('../utils/Constants')

/**
 * @typedef {Object} GroupDetails
 * @property {number} groupID - Group internal ID
 * @property {string} groupName - Group name
 * @property {string} displayName - Group display name
 * @property {string} description - Group description
 * @property {Array.<String>} members - List of members of the group
 * @property {string} managerGroupName - Name of the group that is the manager of this group
 */

/**
 * @typedef {object} GroupsGetByFilterAPIResponse - Inherits `status` and `message` from {@link APIResponse} and overrides the `data` property
 * @augments APIResponse
 * @property {Array.<GroupDetails>} data - list of groups
 */

/**
 * @typedef {object} GroupsGetByNameOrIdAPIResponse - Inherits `status` and `message` from {@link APIResponse} and overrides the `data` property
 * @augments APIResponse
 * @property {GroupDetails} data - group details
 */

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
