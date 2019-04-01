const groups = require('./api/groups')
const users = require('./api/users')
const processInstance = require('./api/processInstance')

class App {
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

    this.groups = {
      getByFilter: function (filter) {
        return groups.getByFilter(bpmConfig, filter)
      },

      getByNameOrId: function (nameOrId) {
        return groups.getByNameOrId(bpmConfig, nameOrId)
      }
    }

    this.users = {
      getByFilter: function (filter) {
        return users.getByFilter(bpmConfig, filter)
      },

      getByNameOrId: function (usernameOrId) {
        return users.getByNameOrId(bpmConfig, usernameOrId)
      },

      updatePreference: function (usernameOrId, key, value) {
        return users.updatePreference(bpmConfig, usernameOrId, key, value)
      }
    }

    this.processInstance = {
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

      bulkSuspend: function (instanceId) {
        return processInstance.bulkSuspend(bpmConfig, instanceId)
      },

      bulkResume: function (instanceId) {
        return processInstance.bulkResume(bpmConfig, instanceId)
      },

      bulkTerminate: function (instanceId) {
        return processInstance.bulkTerminate(bpmConfig, instanceId)
      },

      bulkRetry: function (instanceId) {
        return processInstance.bulkRetry(bpmConfig, instanceId)
      },

      bulkDelete: function (instanceId) {
        return processInstance.bulkDelete(bpmConfig, instanceId)
      }
    }
  }
}

module.exports = App
