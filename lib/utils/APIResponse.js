class APIResponse {
  constructor (message, status, data) {
    this.status = status
    this.message = message
    this.data = data
  }
}

module.exports = APIResponse
