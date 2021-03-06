const request = require('request')
const { buildConfig, buildResponseHandler, genericErrorHandler } = require('./common')
const { filterProperties } = require('../utils/ObjectHandler')

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
 * @typedef {object} GroupsAPIResponse - Inherits `status` and `message` from {@link APIResponse} and overrides the `data` property
 * @augments APIResponse
 * @property {GroupDetails} data - group details
 */

const GROUP_PROPERTIES = [
  'groupID',
  'groupName',
  'displayName',
  'description',
  'members',
  'managerGroupName'
]

const genericSuccessHandler = response => {
  /* istanbul ignore else  */
  if (response && response.data) {
    response.data = filterProperties(response.data, GROUP_PROPERTIES)
  }
  return response
}

module.exports = {
  getByFilter: (config, filter) => new Promise((resolve, reject) => {
    request.get(`${config.restUrl}/groups?filter=${filter}&includeDeleted=false&parts=all`,
      buildConfig(config), buildResponseHandler(resolve, reject))
  }).then(response => {
    /* istanbul ignore else  */
    if (response && response.data && response.data.groups) {
      response.data = response.data.groups.map(item => filterProperties(item, GROUP_PROPERTIES))
    }
    return response
  }).catch(genericErrorHandler),

  getByNameOrId: (config, nameOrId) => new Promise((resolve, reject) => {
    request.get(`${config.restUrl}/group/${nameOrId}?parts=all`,
      buildConfig(config), buildResponseHandler(resolve, reject))
  }).then(genericSuccessHandler).catch(genericErrorHandler),

  addUser: (config, groupNameOrId, userNameOrId) => new Promise((resolve, reject) => {
    request.put(`${config.restUrl}/group/${groupNameOrId}?action=addMember&user=${userNameOrId}&parts=all`,
      buildConfig(config), buildResponseHandler(resolve, reject))
  }).then(genericSuccessHandler).catch(genericErrorHandler),

  removeUser: (config, groupNameOrId, userNameOrId) => new Promise((resolve, reject) => {
    request.put(`${config.restUrl}/group/${groupNameOrId}?action=removeMember&user=${userNameOrId}&parts=all`,
      buildConfig(config), buildResponseHandler(resolve, reject))
  }).then(genericSuccessHandler).catch(genericErrorHandler),

  addGroup: (config, groupNameOrId, subGroupNameOrId) => new Promise((resolve, reject) => {
    request.put(`${config.restUrl}/group/${groupNameOrId}?action=addMember&group=${subGroupNameOrId}&parts=all`,
      buildConfig(config), buildResponseHandler(resolve, reject))
  }).then(genericSuccessHandler).catch(genericErrorHandler),

  removeGroup: (config, groupNameOrId, subGroupNameOrId) => new Promise((resolve, reject) => {
    request.put(`${config.restUrl}/group/${groupNameOrId}?action=removeMember&group=${subGroupNameOrId}&parts=all`,
      buildConfig(config), buildResponseHandler(resolve, reject))
  }).then(genericSuccessHandler).catch(genericErrorHandler)
}
