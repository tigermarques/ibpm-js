/**
 * @typedef {object} APIErrorDetails
 * @property {string} errorNumber - IBM BPM error code
 * @property {string} errorMessage - IBM BPM error description
 */

/** Class that represents an error response */
class APIError extends Error {
  /**
   * Class constructor
   * @param {string} message - message that is a text representation of the status property
   * @param {number} status - HTTP status code for the response (will be at least 400)
   * @param {APIErrorDetails} data - data concerning the error itself
   */
  constructor (message, status, data) {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.data = data
  }
}

module.exports = APIError
