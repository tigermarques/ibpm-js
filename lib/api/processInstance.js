const request = require('request')
const { buildConfig, buildResponseHandler } = require('./common')

/* const commonChangeInstanceState = function commonChangeInstanceState (config, method, instanceId) {
  return request.post(`${config.restUrl}/process/${instanceId}?action=${method}&parts=all`,
    buildConfig(config))
}

const commonChangeBulkInstanceState = function commonChangeBulkInstanceState (config, method, instanceIds) {
  return request.post(`${config.restUrl}/process/bulk?instanceIds=${instanceIds.join(',')}&action=${method}&parts=all`,
    buildConfig(config))
} */

module.exports = {
  getById: (config, instanceId) => new Promise((resolve, reject) => {
    request.get(`${config.restUrl}/process/${instanceId}?parts=all`,
      buildConfig(config), buildResponseHandler(resolve, reject))
  })/* ,

  suspend: (config, instanceId) => commonChangeInstanceState(config, 'suspend', instanceId),

  resume: (config, instanceId) => commonChangeInstanceState(config, 'resume', instanceId),

  terminate: (config, instanceId) => commonChangeInstanceState(config, 'terminate', instanceId),

  retry: (config, instanceId) => commonChangeInstanceState(config, 'retry', instanceId),

  delete: (config, instanceId) => {
    return request.delete(`${config.restUrl}/process/${instanceId}?action=delete&parts=all`,
      buildConfig(config))
  },

  bulkSuspend: (config, instanceIds) => commonChangeBulkInstanceState(config, 'suspend', instanceIds),

  bulkResume: (config, instanceIds) => commonChangeBulkInstanceState(config, 'resume', instanceIds),

  bulkTerminate: (config, instanceIds) => commonChangeBulkInstanceState(config, 'terminate', instanceIds),

  bulkRetry: (config, instanceIds) => commonChangeBulkInstanceState(config, 'retry', instanceIds),

  bulkDelete: (config, instanceIds) => commonChangeBulkInstanceState(config, 'delete', instanceIds),

  evaluateJSCode: (config, instanceId, jsExpression) => {
    return request.post(`${config.restUrl}/process/${instanceId}?action=js&script=${jsExpression}`,
      buildConfig(config))
  },

  fireTimer: (config, instanceId, timerTokenId) => {
    return request.post(`${config.restUrl}/process/${instanceId}?action=fireTimer&timerTokenId=${timerTokenId}&parts=all`,
      buildConfig(config))
  },

  moveToken: (config, instanceId, tokenId, targetStep) => {
    return request.post(`${config.restUrl}/process/${instanceId}?action=moveToken&tokenId=${tokenId}&target=${targetStep}&parts=all`,
      buildConfig(config))
  },

  deleteToken: (config, instanceId, tokenId) => {
    return request.post(`${config.restUrl}/process/${instanceId}?action=moveToken&tokenId=${tokenId}&parts=all`,
      buildConfig(config))
  },

  getRuntimeErrors: (config, instanceId) => {
    return request.put(`${config.restUrl}/process/errors?instanceIds=${instanceId}`,
      buildConfig(config))
  },

  getBulkRuntimeErrors: (config, instanceIds) => {
    return request.put(`${config.restUrl}/process/errors?instanceIds=${instanceIds.join(',')}`,
      buildConfig(config))
  } */
}
