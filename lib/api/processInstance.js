const request = require('request')
const xmlbuilder = require('xmlbuilder')
const querystring = require('querystring')
const { buildConfig, buildResponseHandler } = require('./common')
const { HTTP_STATUS, HTTP_MESSAGES } = require('../utils/Constants')

/**
 * @typedef {object} InstanceDocument
 * @property {string} ID - Document internal ID
 * @property {string} ecmID - Document ECM identifier
 * @property {string} type - Document type
 * @property {string} name - Document name
 * @property {date} date - Document creation date
 * @property {number} length - Document size
 * @property {string} url - Document URL
 * @property {number} version - Document version
 */

/**
 * @typedef {object} TaskDetails
 * @property {string} tkiid - Task internal ID
 * @property {date} activationTime - Date the task instance is set into the ready state
 * @property {date} atRiskTime - Date the task instance is at risk
 * @property {date} completionTime - Date when the task instance reached an end state
 * @property {date} dueTime - Date when the task is due
 * @property {date} lastModificationTime - The latest date at which the task was created, started or completed
 * @property {date} startTime - Date when the task was claimed or when an invocation task enters the running state
 * @property {number} assignedToID - Task owner ID
 * @property {string} assignedTo - Task owner
 * @property {string} assignedToDisplayName - Task owner display name
 * @property {string} assignedToType - Identifies if the task is assigned to a user or group
 * @property {number} teamID - The ID of the assigned team. When `assignedToType` is `group`, it is the same as `assignedToID`
 * @property {string} teamName - The name of the assigned team. When `assignedToType` is `group`, it is the same as `assignedTo`
 * @property {string} teamDisplayName - The display name of the assigned team. When `assignedToType` is `group`, it is the same as `assignedToDisplayName`
 * @property {number} managerTeamID - The ID of the manager team
 * @property {string} managerTeamName - The name of the manager team
 * @property {string} managerTeamDisplayName - The display name of the manager team
 * @property {object} data - Task instance data
 * @property {object} processData - Data of the process instance containing the task
 * @property {string} description - Task description
 * @property {string} displayName - Task display name
 * @property {string} externalActivityID - ID of the external activity
 * @property {string} externalActivitySnapshotID - Snapshot ID of the external implementation
 * @property {string} kind - Task kind
 * @property {string} name - Task name
 * @property {string} originator - ID of the user that created the task instance or on whose behalf the task instance was created
 * @property {string} owner - Task owner
 * @property {number} priority - Task priority level
 * @property {string} priorityName - Task priority description
 * @property {string} kind - Task kind
 * @property {string} state - Task state
 * @property {string} status - Task status
 * @property {string} serviceID - If the task is a service, this field contains the service's ID
 * @property {string} serviceSnapshotID - Snapshot ID of the external implementation
 * @property {string} flowObjectID - ID of flow object
 * @property {number} nextTaskId - Next task ID
 * @property {Array<string>} actions - List of available actions for the task instance
 */

/**
 * @typedef {object} InstanceDetails
 * @property {string} piid - Instance internal ID
 * @property {string} name - Instance name
 * @property {string} description - Instance description
 * @property {string} starterId - User ID that created this instance
 * @property {date} creationTime - Instance creation date
 * @property {date} lastModificationTime - Instance last modification date
 * @property {date} dueDate - Instance due date
 * @property {string} executionState - Instance execution state description
 * @property {string} state - Instance execution state code
 * @property {string} processAppID - Process Application ID that this instance belongs to
 * @property {string} processAppAcronym - Process Application Acronym that this instance belongs to
 * @property {string} processAppName - Process Application Name that this instance belongs to
 * @property {string} snapshotID - Snapshot ID that this instance belongs to
 * @property {boolean} snapshotTip - `true` if the instance snapshot is the tip snapshot and `false` otherwise
 * @property {string} branchID - Branch ID that this instance belongs to
 * @property {string} branchName - Branch Name that this instance belongs to
 * @property {string} processTemplateID - Process Template ID that originated this instance
 * @property {string} processTemplateName - Process Template Name that originated this instance
 * @property {string} data - Instance data in a string representation
 * @property {Array<Object>} businessData - Business data defined for the instance, including name, alias, type and value
 * @property {object} variables - Variable values in a json object
 * @property {Array<string>} actions - List of available actions for the process instance
 * @property {object} executionTree - Execution tree associated with the process
 * @property {object} diagram - BPD diagram of this instance, including existing tokens and associated task for the instance
 * @property {Array<InstanceDocument>} documents - List of instance documents
 * @property {Array<TaskDetails>} tasks - List of instance tasks
 */

const commonChangeInstanceState = function commonChangeInstanceState (config, method, instanceId) {
  return new Promise((resolve, reject) => {
    request.put(`${config.restUrl}/process/${instanceId}?action=${method}&parts=all`,
      buildConfig(config), buildResponseHandler(resolve, reject))
  })
}

/**
 * @typedef {object} ProcessInstanceGetByIDAPIResponse - Inherits `status` and `message` from {@link APIResponse} and overrides the `data` property
 * @augments APIResponse
 * @property {InstanceDetails} data - instance details
 */

module.exports = {
  getById: (config, instanceId) => new Promise((resolve, reject) => {
    request.get(`${config.restUrl}/process/${instanceId}?parts=all`,
      buildConfig(config), buildResponseHandler(resolve, reject))
  }).catch(error => {
    if (error.data && error.data.Data) {
      error.data = {
        errorNumber: error.data.Data.errorNumber,
        errorMessage: error.data.Data.errorMessage
      }
    }
    throw error
  }),

  suspend: (config, instanceId) => commonChangeInstanceState(config, 'suspend', instanceId).catch(error => {
    if (error.data && error.data.Data) {
      error.data = {
        errorNumber: error.data.Data.errorNumber,
        errorMessage: error.data.Data.errorMessage
      }
    }
    switch (error.status) {
      case HTTP_STATUS.UNAUTHORIZED:
        if (error.data && error.data.errorNumber === 'CWTBG0549E') {
          error.status = HTTP_STATUS.CONFLICT
          error.message = HTTP_MESSAGES.CONFLICT
        }
        break
      case HTTP_STATUS.SERVER_ERROR:
        if (error.data && error.data.errorNumber === 'CWTBG0025E') {
          error.status = HTTP_STATUS.NOT_FOUND
          error.message = HTTP_MESSAGES.NOT_FOUND
        }
        break
    }
    throw error
  }),

  resume: (config, instanceId) => commonChangeInstanceState(config, 'resume', instanceId).catch(error => {
    if (error.data && error.data.Data) {
      error.data = {
        errorNumber: error.data.Data.errorNumber,
        errorMessage: error.data.Data.errorMessage
      }
    }
    switch (error.status) {
      case HTTP_STATUS.SERVER_ERROR:
        if (error.data && error.data.errorNumber === 'CWTBG0019E' && error.data.errorMessage.indexOf('BPDInstance') >= 0) {
          error.status = HTTP_STATUS.NOT_FOUND
          error.message = HTTP_MESSAGES.NOT_FOUND
        }
        break
    }
    throw error
  }),

  terminate: (config, instanceId) => commonChangeInstanceState(config, 'terminate', instanceId).catch(error => {
    if (error.data && error.data.Data) {
      error.data = {
        errorNumber: error.data.Data.errorNumber,
        errorMessage: error.data.Data.errorMessage
      }
    }
    switch (error.status) {
      case HTTP_STATUS.UNAUTHORIZED:
        if (error.data && error.data.errorNumber === 'CWTBG0549E') {
          error.status = HTTP_STATUS.CONFLICT
          error.message = HTTP_MESSAGES.CONFLICT
        }
        break
      case HTTP_STATUS.SERVER_ERROR:
        if (error.data && error.data.errorNumber === 'CWTBG0025E') {
          error.status = HTTP_STATUS.NOT_FOUND
          error.message = HTTP_MESSAGES.NOT_FOUND
        }
        break
    }
    throw error
  }),

  retry: (config, instanceId) => commonChangeInstanceState(config, 'retry', instanceId).catch(error => {
    if (error.data && error.data.Data) {
      error.data = {
        errorNumber: error.data.Data.errorNumber,
        errorMessage: error.data.Data.errorMessage
      }
    }
    switch (error.status) {
      case HTTP_STATUS.SERVER_ERROR:
        if (error.data && error.data.errorNumber === 'CWTBG0019E' && error.data.errorMessage.indexOf('BPDInstance') >= 0) {
          error.status = HTTP_STATUS.NOT_FOUND
          error.message = HTTP_MESSAGES.NOT_FOUND
        }
        break
    }
    throw error
  }),

  delete: (config, instanceId) => new Promise((resolve, reject) => {
    request.delete(`${config.restUrl}/process/${instanceId}?action=delete&parts=all`,
      buildConfig(config), buildResponseHandler(resolve, reject))
  }).catch(error => {
    if (error.data && error.data.Data) {
      error.data = {
        errorNumber: error.data.Data.errorNumber,
        errorMessage: error.data.Data.errorMessage
      }
    }
    throw error
  }),

  fireTimer: (config, instanceId, timerTokenId) => new Promise((resolve, reject) => {
    request.post(`${config.restUrl}/process/${instanceId}?action=fireTimer&timerTokenId=${timerTokenId}&parts=all`,
      buildConfig(config), buildResponseHandler(resolve, reject))
  }).catch(error => {
    const oldData = error && error.data ? error.data.Data : null
    if (error.data && error.data.Data) {
      error.data = {
        errorNumber: error.data.Data.errorNumber,
        errorMessage: error.data.Data.errorMessage
      }
    }
    switch (error.status) {
      case HTTP_STATUS.BAD_REQUEST:
        if (error.data && error.data.errorNumber === 'CWTBG0551E') {
          error.status = HTTP_STATUS.NOT_FOUND
          error.message = HTTP_MESSAGES.NOT_FOUND
        }
        break
      case HTTP_STATUS.SERVER_ERROR:
        if (error.data && error.data.errorNumber === 'CWTBG0019E' && oldData.programmersDetails.indexOf('BPDInstance') >= 0) {
          error.status = HTTP_STATUS.NOT_FOUND
          error.message = HTTP_MESSAGES.NOT_FOUND
          error.data.errorMessage = `${error.data.errorNumber}: ${oldData.programmersDetails}`
        }
        break
    }
    throw error
  }),

  deleteToken: (config, instanceId, tokenId, resumeInstance = false) => new Promise((resolve, reject) => {
    request.post(`${config.restUrl}/process/${instanceId}?action=deleteToken&tokenId=${tokenId}&parts=all&resume=${resumeInstance}`,
      buildConfig(config), buildResponseHandler(resolve, reject))
  }).catch(error => {
    if (error.data && error.data.Data) {
      error.data = {
        errorNumber: error.data.Data.errorNumber,
        errorMessage: error.data.Data.errorMessage
      }
    }
    switch (error.status) {
      case HTTP_STATUS.SERVER_ERROR:
        if (error.data && error.data.errorNumber === 'CWTBG0019E' && error.data.errorMessage.indexOf('tokenId') >= 0) {
          error.status = HTTP_STATUS.FORBIDDEN
          error.message = HTTP_MESSAGES.FORBIDDEN
        }
        break
    }
    throw error
  }),

  moveToken: (config, instanceId, tokenId, targetStep, resumeInstance = false) => new Promise((resolve, reject) => {
    request.post(`${config.restUrl}/process/${instanceId}?action=moveToken&tokenId=${tokenId}&target=${targetStep}&parts=all&resume=${resumeInstance}`,
      buildConfig(config), buildResponseHandler(resolve, reject))
  }).catch(error => {
    if (error.data && error.data.Data) {
      error.data = {
        errorNumber: error.data.Data.errorNumber,
        errorMessage: error.data.Data.errorMessage
      }
    }
    switch (error.status) {
      case HTTP_STATUS.SERVER_ERROR:
        if (error.data && error.data.errorNumber === 'CWTBG0019E' && error.data.errorMessage.indexOf('tokenId') >= 0) {
          error.status = HTTP_STATUS.FORBIDDEN
          error.message = HTTP_MESSAGES.FORBIDDEN
        } else if (error.data && error.data.errorNumber === 'CWTBG0019E' && error.data.errorMessage.indexOf('targetFlowObjectId') >= 0) {
          error.status = HTTP_STATUS.NOT_FOUND
          error.message = HTTP_MESSAGES.NOT_FOUND
        }
        break
    }
    throw error
  }),

  getRuntimeErrors: (config, instanceIds) => new Promise((resolve, reject) => {
    request.put(`${config.restUrl}/process/errors?instanceIds=${instanceIds.join(',')}`,
      buildConfig(config), buildResponseHandler(resolve, reject))
  }).then(response => {
    const newData = {
      failedOperations: [],
      runtimeErrors: []
    }
    if (response && response.data) {
      if (response.data.failedOperations) {
        response.data.failedOperations.map(failed => {
          if ('errorMessage' in failed) {
            newData.failedOperations.push(failed)
          } else {
            newData.runtimeErrors.push({
              instanceId: failed.instanceId,
              error: null
            })
          }
        })
      }
      if (response.data.runtimeErrors) {
        response.data.runtimeErrors.map(runtime => {
          newData.runtimeErrors.push({
            instanceId: runtime.instanceId.replace('BPDInstance.', ''),
            error: runtime
          })
        })
      }
    }
    response.data = newData
    return response
  }),

  sendMessage: (config, message, parameters = []) => new Promise((resolve, reject) => {
    const messageObj = xmlbuilder.create('eventmsg', { headless: true })
    const eventObj = xmlbuilder.create('event', { headless: true })

    if ('processApp' in message) {
      eventObj.att('processApp', message.processApp)
    }
    if ('eventName' in message) {
      eventObj.txt(message.eventName)
    }
    if ('ucaName' in message) {
      eventObj.att('ucaname', message.ucaName)
    }
    if ('snapshot' in message) {
      eventObj.att('snapshot', message.snapshot)
    }
    messageObj.importDocument(eventObj)
    if ('queue' in message) {
      messageObj.importDocument(xmlbuilder.create('queue', { headless: true }).txt(message.queue))
    }
    if (parameters && parameters.length > 0) {
      const parametersObj = xmlbuilder.create('parameters', { headless: true })
      for (let i = 0; i < parameters.length; i++) {
        const param = xmlbuilder.create('parameter')
          .ele('key').txt(parameters[i].key).up()
          .ele('value').dat(parameters[i].value).up()

        parametersObj.importDocument(param)
      }
      messageObj.importDocument(parametersObj)
    }
    const messageStr = messageObj.end()
    request.post(`${config.restUrl}/process?action=sendMessage&message=${querystring.escape(messageStr)}`,
      buildConfig(config), buildResponseHandler(resolve, reject))
  }).catch(error => {
    if (error.data && error.data.Data) {
      const details = error.data.Data.programmersDetails
      error.data = {
        errorNumber: error.data.Data.errorNumber,
        errorMessage: error.data.Data.errorMessage
      }
      error.data.errorMessage = error.data.errorMessage.replace('{1}', details)
    }
    switch (error.status) {
      case HTTP_STATUS.SERVER_ERROR:
        if (error.data && error.data.errorNumber === 'CWTBG0025E') {
          error.status = HTTP_STATUS.BAD_REQUEST
          error.message = HTTP_MESSAGES.BAD_REQUEST
        }
        break
    }
    throw error
  })
}
