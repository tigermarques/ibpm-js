const request = require('request')
const xmlbuilder = require('xmlbuilder')
const querystring = require('querystring')
const { buildConfig, buildResponseHandler } = require('./common')
const { HTTP_STATUS, HTTP_MESSAGES } = require('../utils/Constants')

const commonChangeInstanceState = function commonChangeInstanceState (config, method, instanceId) {
  return new Promise((resolve, reject) => {
    request.put(`${config.restUrl}/process/${instanceId}?action=${method}&parts=all`,
      buildConfig(config), buildResponseHandler(resolve, reject))
  })
}

const commonChangeBulkInstanceState = function commonChangeInstanceState (config, method, instanceIds) {
  return new Promise((resolve, reject) => {
    request.put(`${config.restUrl}/process/bulk?instanceIds=${instanceIds.join(',')}&action=${method}&parts=all`,
      buildConfig(config), buildResponseHandler(resolve, reject))
  })
}

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

  bulkSuspend: (config, instanceIds) => commonChangeBulkInstanceState(config, 'suspend', instanceIds),

  bulkResume: (config, instanceIds) => commonChangeBulkInstanceState(config, 'resume', instanceIds),

  bulkTerminate: (config, instanceIds) => commonChangeBulkInstanceState(config, 'terminate', instanceIds),

  bulkRetry: (config, instanceIds) => commonChangeBulkInstanceState(config, 'retry', instanceIds),

  bulkDelete: (config, instanceIds) => commonChangeBulkInstanceState(config, 'delete', instanceIds),

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
    throw error
  }),

  moveToken: (config, instanceId, tokenId, targetStep, resumeInstance = false) => new Promise((resolve, reject) => {
    request.post(`${config.restUrl}/process/${instanceId}?action=moveToken&tokenId=${tokenId}&target=${targetStep}&parts=all&resume=${resumeInstance}`,
      buildConfig(config), buildResponseHandler(resolve, reject))
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
