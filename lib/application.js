const groups = require('./api/groups')
const users = require('./api/users')
const processInstance = require('./api/processInstance')
const system = require('./api/system')

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
       * @return {Promise<GroupsAPIResponse>|Promise<APIError>} a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.
       */
      getByNameOrId: function (nameOrId) {
        return groups.getByNameOrId(bpmConfig, nameOrId)
      },

      /**
       * Add a user to a group.
       * @async
       * @memberOf BPMInstance.groups
       * @param {string} groupNameOrId - Group name or ID
       * @param {string} userNameOrId - User name or ID
       * @return {Promise<GroupsAPIResponse>|Promise<APIError>} a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.
       */
      addUser: function (groupNameOrId, userNameOrId) {
        return groups.addUser(bpmConfig, groupNameOrId, userNameOrId)
      },

      /**
       * Remove a user from a group.
       * @async
       * @memberOf BPMInstance.groups
       * @param {string} groupNameOrId - Group name or ID
       * @param {string} userNameOrId - User name or ID
       * @return {Promise<GroupsAPIResponse>|Promise<APIError>} a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.
       */
      removeUser: function (groupNameOrId, userNameOrId) {
        return groups.removeUser(bpmConfig, groupNameOrId, userNameOrId)
      },

      /**
       * Add a group to another group.
       * @async
       * @memberOf BPMInstance.groups
       * @param {string} groupNameOrId - Group name or ID
       * @param {string} subGroupNameOrId - Sub Group name or ID
       * @return {Promise<GroupsAPIResponse>|Promise<APIError>} a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.
       */
      addGroup: function (groupNameOrId, subGroupNameOrId) {
        return groups.addGroup(bpmConfig, groupNameOrId, subGroupNameOrId)
      },

      /**
       * Remove a group from another group.
       * @async
       * @memberOf BPMInstance.groups
       * @param {string} groupNameOrId - Group name or ID
       * @param {string} subGroupNameOrId - Sub Group name or ID
       * @return {Promise<GroupsAPIResponse>|Promise<APIError>} a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.
       */
      removeGroup: function (groupNameOrId, subGroupNameOrId) {
        return groups.removeGroup(bpmConfig, groupNameOrId, subGroupNameOrId)
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
       * Get a process instance details.
       * @async
       * @memberOf BPMInstance.processInstance
       * @param {string} instanceId - Instance ID
       * @return {Promise<ProcessInstanceAPIResponse>|Promise<APIError>} a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.
       */
      getById: function (instanceId) {
        return processInstance.getById(bpmConfig, instanceId)
      },

      /**
       * Suspend a process instance.
       * @async
       * @memberOf BPMInstance.processInstance
       * @param {string} instanceId - Instance ID
       * @return {Promise<ProcessInstanceAPIResponse>|Promise<APIError>} a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.
       */
      suspend: function (instanceId) {
        return processInstance.suspend(bpmConfig, instanceId)
      },

      /**
       * Resume a process instance.
       * @async
       * @memberOf BPMInstance.processInstance
       * @param {string} instanceId - Instance ID
       * @return {Promise<ProcessInstanceAPIResponse>|Promise<APIError>} a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.
       */
      resume: function (instanceId) {
        return processInstance.resume(bpmConfig, instanceId)
      },

      /**
       * Terminate a process instance.
       * @async
       * @memberOf BPMInstance.processInstance
       * @param {string} instanceId - Instance ID
       * @return {Promise<ProcessInstanceAPIResponse>|Promise<APIError>} a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.
       */
      terminate: function (instanceId) {
        return processInstance.terminate(bpmConfig, instanceId)
      },

      /**
       * Retry a process instance.
       * @async
       * @memberOf BPMInstance.processInstance
       * @param {string} instanceId - Instance ID
       * @return {Promise<ProcessInstanceAPIResponse>|Promise<APIError>} a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.
       */
      retry: function (instanceId) {
        return processInstance.retry(bpmConfig, instanceId)
      },

      /**
       * Delete a process instance.
       * @async
       * @memberOf BPMInstance.processInstance
       * @param {string} instanceId - Instance ID
       * @return {Promise<ProcessInstanceAPIResponse>|Promise<APIError>} a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.
       */
      delete: function (instanceId) {
        return processInstance.delete(bpmConfig, instanceId)
      },

      /**
       * Fire a process instance timer.
       * @async
       * @memberOf BPMInstance.processInstance
       * @param {string} instanceId - Instance ID
       * @return {Promise<ProcessInstanceAPIResponse>|Promise<APIError>} a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.
       */
      fireTimer: function (instanceId, timerTokenId) {
        return processInstance.fireTimer(bpmConfig, instanceId, timerTokenId)
      },

      /**
       * Delete a process instance token.
       * @async
       * @memberOf BPMInstance.processInstance
       * @param {string} instanceId - Instance ID
       * @return {Promise<ProcessInstanceAPIResponse>|Promise<APIError>} a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.
       */
      deleteToken: function (instanceId, tokenId, resumeInstance = false) {
        return processInstance.deleteToken(bpmConfig, instanceId, tokenId, resumeInstance)
      },

      /**
       * Move a process instance token.
       * @async
       * @memberOf BPMInstance.processInstance
       * @param {string} instanceId - Instance ID
       * @return {Promise<ProcessInstanceAPIResponse>|Promise<APIError>} a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.
       */
      moveToken: function (instanceId, tokenId, targetStep, resumeInstance = false) {
        return processInstance.moveToken(bpmConfig, instanceId, tokenId, targetStep, resumeInstance)
      },

      /**
       * Get a list of runtime errors.
       * @async
       * @memberOf BPMInstance.processInstance
       * @param {Array<string>} instanceIds - List of IDs to get errors for
       * @return {Promise<RuntimeErrorResponse>|Promise<APIError>} a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.
       */
      getRuntimeErrors: function (instanceIds) {
        return processInstance.getRuntimeErrors(bpmConfig, instanceIds)
      },

      /**
       * Send a message to IBM BPM (for UCA triggering).
       * @async
       * @memberOf BPMInstance.processInstance
       * @param {MessageRequest} message - Message to send
       * @param {Array<MessageParameter>} parameters - List of parameters to send with the message
       * @return {Promise<ProcessInstanceSendMessageAPIResponse>|Promise<APIError>} a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.
       */
      sendMessage: function (message, parameters = []) {
        return processInstance.sendMessage(bpmConfig, message, parameters)
      }
    }

    /**
     * @name system
     * @namespace BPMInstance.system
     * @memberOf BPMInstance
     */
    this.system = {
      /**
       * Retrieve system details
       * @async
       * @memberOf BPMInstance.system
       * @return {Promise<ProcessInstanceSendMessageAPIResponse>|Promise<APIError>} a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.
       */
      getDetails: function () {
        return system.getDetails(bpmConfig)
      }
    }
  }
}

module.exports = BPMInstance
