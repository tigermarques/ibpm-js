const request = require('request')
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
  })
}
