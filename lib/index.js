const BPMInstance = require('./application')

/**
 * @typedef {Object} BPMInstanceConfig
 * @property {string} protocol=https - Protocol (HTTP/HTTPS)
 * @property {string} hostname - Hostname of the IBM BPM server
 * @property {string} port=9443 - Port Number
 * @property {string} context - Additional URL content
 * @property {string} username=bpmadmin - Username
 * @property {string} password=bpmadmin - Password
 */

/**
   * Method to get or create a workspace
   * @memberOf ibpm-js
   *
   * @param   {BPMInstanceConfig} config - BPM Instance configuration object. This will set the properties needed to establish a connection to the IBM BPM server
   *
   * @returns {BPMInstance} Object that represents the BPM Instance, and that will have all the available methods
   */
function createInstance (config) {
  return new BPMInstance(config)
}

/**
 *  Entry point for the library
 *  @namespace ibpm-js
 */
module.exports = createInstance
