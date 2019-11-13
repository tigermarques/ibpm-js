const request = require('request')
const { buildConfig, buildResponseHandler } = require('./common')
const { filterProperties } = require('../utils/ObjectHandler')

/**
 * @typedef {Object} SystemDetails
 * @property {string} systemID - ID of the system that is described by this object
 * @property {string} systemType - Type of the system that is described by this object
 * @property {string} version - Version of the system that is described by this object
 * @property {string} buildLevel - Build level of the system that is described by this object
 * @property {string} apiVersion - A string indicating the version of the BPM REST API
 * @property {string} hostName - Hostname of the system that is described by this object
 */

/**
 * @typedef {object} SystemDetailsAPIResponse - Inherits `status` and `message` from {@link APIResponse} and overrides the `data` property
 * @augments APIResponse
 * @property {SystemDetails} data - system details
 */

const SYSTEM_PROPERTIES = [
  'systemID',
  'systemType',
  'version',
  'buildLevel',
  'apiVersion',
  'hostname'
]

module.exports = {
  getDetails: (config, filter) => new Promise((resolve, reject) => {
    request.get(`${config.restUrl}/systems`,
      buildConfig(config), buildResponseHandler(resolve, reject))
  }).then(response => {
    /* istanbul ignore else  */
    if (response && response.data && response.data.systems) {
      response.data = response.data.systems.map(item => filterProperties(item, SYSTEM_PROPERTIES))
    }
    return response
  }).catch(error => {
    if (error.data && error.data.Data) {
      error.data = {
        errorNumber: error.data.Data.errorNumber,
        errorMessage: error.data.Data.errorMessage
      }
    }
    throw error
  })
}
