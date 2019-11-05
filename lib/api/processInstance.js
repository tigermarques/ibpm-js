const request = require('request')
const xmlbuilder = require('xmlbuilder')
const querystring = require('querystring')
const { buildConfig, buildResponseHandler } = require('./common')

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
  }),

  suspend: (config, instanceId) => commonChangeInstanceState(config, 'suspend', instanceId),

  resume: (config, instanceId) => commonChangeInstanceState(config, 'resume', instanceId),

  terminate: (config, instanceId) => commonChangeInstanceState(config, 'terminate', instanceId),

  retry: (config, instanceId) => commonChangeInstanceState(config, 'retry', instanceId),

  delete: (config, instanceId) => new Promise((resolve, reject) => {
    request.delete(`${config.restUrl}/process/${instanceId}?action=delete&parts=all`,
      buildConfig(config), buildResponseHandler(resolve, reject))
  }),

  bulkSuspend: (config, instanceIds) => commonChangeBulkInstanceState(config, 'suspend', instanceIds),

  bulkResume: (config, instanceIds) => commonChangeBulkInstanceState(config, 'resume', instanceIds),

  bulkTerminate: (config, instanceIds) => commonChangeBulkInstanceState(config, 'terminate', instanceIds),

  bulkRetry: (config, instanceIds) => commonChangeBulkInstanceState(config, 'retry', instanceIds),

  bulkDelete: (config, instanceIds) => commonChangeBulkInstanceState(config, 'delete', instanceIds),

  fireTimer: (config, instanceId, timerTokenId) => new Promise((resolve, reject) => {
    request.post(`${config.restUrl}/process/${instanceId}?action=fireTimer&timerTokenId=${timerTokenId}&parts=all`,
      buildConfig(config), buildResponseHandler(resolve, reject))
  }),

  deleteToken: (config, instanceId, tokenId, resumeInstance = false) => new Promise((resolve, reject) => {
    request.post(`${config.restUrl}/process/${instanceId}?action=deleteToken&tokenId=${tokenId}&parts=all&resume=${resumeInstance}`,
      buildConfig(config), buildResponseHandler(resolve, reject))
  }),

  moveToken: (config, instanceId, tokenId, targetStep, resumeInstance = false) => new Promise((resolve, reject) => {
    request.post(`${config.restUrl}/process/${instanceId}?action=moveToken&tokenId=${tokenId}&target=${targetStep}&parts=all&resume=${resumeInstance}`,
      buildConfig(config), buildResponseHandler(resolve, reject))
  }),

  getRuntimeErrors: (config, instanceIds) => new Promise((resolve, reject) => {
    request.put(`${config.restUrl}/process/errors?instanceIds=${instanceIds.join(',')}`,
      buildConfig(config), buildResponseHandler(resolve, reject))
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
  })
}
