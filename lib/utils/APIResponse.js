/** Class that represents a success response */
class APIResponse {
  /**
   * Class constructor
   * @param {string} message - message that is a text representation of the status property
   * @param {number} status - HTTP status code for the response (will be between 200 and 399)
   * @param {*} data - data concerning the response itself
   */
  constructor (message, status, data) {
    this.status = status
    this.message = message
    this.data = data
  }
}

module.exports = APIResponse
