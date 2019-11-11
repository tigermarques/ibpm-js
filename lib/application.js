const groups = require('./api/groups')
const users = require('./api/users')
const processInstance = require('./api/processInstance')

/** Class that represents a BPM Instance */
class BPMInstance {
  constructor (config) {
    let protocol = process.env.IBM_BPM_PROTOCOL || 'https'
    let hostname = process.env.IBM_BPM_HOSTNAME || ''
    let port = process.env.IBM_BPM_PORT || '9443'
    let context = process.env.IBM_BPM_CONTEXT || ''
    let username = process.env.IBM_BPM_USERNAME || 'bpmadmin'
    let password = process.env.IBM_BPM_PASSWORD || 'bpmadmin'
    if (config && typeof config === 'object') {
      protocol = config.protocol || protocol
      hostname = config.hostname || hostname
      port = config.port || port
      context = config.context || context
      username = config.username || username
      password = config.password || password
    }
    if (context) {
      // this removes leading spaces and trailing spaces
      context = context.replace(/\/$/, '').replace(/^\//, '')
      context = `${context}/`
    }

    Object.defineProperty(this, 'restUrl', {
      get: function () {
        return `${protocol}://${hostname}:${port}/${context}rest/bpm/wle/v1`
      }
    })

    const bpmConfig = {
      restUrl: this.restUrl,
      username: username,
      password: password
    }

    /**
     * @name groups
     * @namespace BPMInstance.groups
     * @memberOf BPMInstance
     */
    this.groups = {
      /**
       * Get a list of groups by providing a search filter.
       * @async
       * @memberOf BPMInstance.groups
       * @param {string} filter - A simple regular expression to be used to filter the list of groups returned. Example: `tw_*` returns all groupa whose names begin with `tw_`
       * @return {Promise<GroupsGetByFilterAPIResponse>|Promise<APIError>} a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.
       */
      getByFilter: function (filter) {
        return groups.getByFilter(bpmConfig, filter)
      },

      /**
       * Get a group details.
       * @async
       * @memberOf BPMInstance.groups
       * @param {string} nameOrId - Group name or ID
       * @return {Promise<GroupsGetByNameOrIdAPIResponse>|Promise<APIError>} a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.
       */
      getByNameOrId: function (nameOrId) {
        return groups.getByNameOrId(bpmConfig, nameOrId)
      }
    }

    /**
     * @name users
     * @namespace BPMInstance.users
     * @memberOf BPMInstance
     */
    this.users = {
      /**
       * Get a list of users by providing a search filter.
       * @async
       * @memberOf BPMInstance.users
       * @param {string} filter - A simple regular expression to be used to filter the list of users returned. Example: `tw_*` returns all users whose names begin with `tw_`
       * @return {Promise<UsersGetByFilterAPIResponse>|Promise<APIError>} a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.
       */
      getByFilter: function (filter) {
        return users.getByFilter(bpmConfig, filter)
      },

      /**
       * Get a user details.
       * @async
       * @memberOf BPMInstance.users
       * @param {string} usernameOrId - User name or ID
       * @return {Promise<UsersGetByNameOrIdAPIResponse>|Promise<APIError>} a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.
       */
      getByNameOrId: function (usernameOrId) {
        return users.getByNameOrId(bpmConfig, usernameOrId)
      },

      /**
       * Update a user preference.
       * @async
       * @memberOf BPMInstance.users
       * @param {string} usernameOrId - User name or ID
       * @param {string} key - Attribute key
       * @param {string} value - Attribute value
       * @return {Promise<UsersUpdatePreferenceAPIResponse>|Promise<APIError>} a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.
       */
      updatePreference: function (usernameOrId, key, value) {
        return users.updatePreference(bpmConfig, usernameOrId, key, value)
      }
    }

    /**
     * @name processInstance
     * @namespace BPMInstance.processInstance
     * @memberOf BPMInstance
     */
    this.processInstance = {
      /**
       * Get a user details.
       * @async
       * @memberOf BPMInstance.processInstance
       * @param {string} instanceId - Instance ID
       * @return {Promise<ProcessInstanceGetByIDAPIResponse>|Promise<APIError>} a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.
       */
      getById: function (instanceId) {
        return processInstance.getById(bpmConfig, instanceId)
      },

      suspend: function (instanceId) {
        return processInstance.suspend(bpmConfig, instanceId)
      },

      resume: function (instanceId) {
        return processInstance.resume(bpmConfig, instanceId)
      },

      terminate: function (instanceId) {
        return processInstance.terminate(bpmConfig, instanceId)
      },

      retry: function (instanceId) {
        return processInstance.retry(bpmConfig, instanceId)
      },

      delete: function (instanceId) {
        return processInstance.delete(bpmConfig, instanceId)
      },

      fireTimer: function (instanceId, timerTokenId) {
        return processInstance.fireTimer(bpmConfig, instanceId, timerTokenId)
      },

      deleteToken: function (instanceId, tokenId, resumeInstance = false) {
        return processInstance.deleteToken(bpmConfig, instanceId, tokenId, resumeInstance)
      },

      moveToken: function (instanceId, tokenId, targetStep, resumeInstance = false) {
        return processInstance.moveToken(bpmConfig, instanceId, tokenId, targetStep, resumeInstance)
      },

      getRuntimeErrors: function (instanceIds) {
        return processInstance.getRuntimeErrors(bpmConfig, instanceIds)
      },

      sendMessage: function (message, parameters = []) {
        return processInstance.sendMessage(bpmConfig, message, parameters)
      }
    }
  }
}

module.exports = BPMInstance
