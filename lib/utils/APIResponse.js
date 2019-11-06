const { HTTP_STATUS, HTTP_MESSAGES } = require('./Constants')

class APIResponse {
  constructor (data) {
    this.status = HTTP_STATUS.OK.toString()
    this.message = HTTP_MESSAGES.OK
    this.data = data
  }
}

module.exports = APIResponse
