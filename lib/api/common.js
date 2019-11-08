const APIError = require('../utils/APIError')
const APIResponse = require('../utils/APIResponse')
const { HTTP_STATUS, HTTP_MESSAGES } = require('../utils/Constants')

module.exports = {
  buildConfig: (config) => {
    return {
      auth: {
        username: config.username,
        password: config.password
      },
      headers: {
        'Content-Type': 'application/json'
      },
      json: true
    }
  },

  buildResponseHandler: (resolve, reject) => {
    return (error, httpResponse, body) => {
      if (error) {
        const newError = new APIError(error.message, HTTP_STATUS.REQUEST_ERROR)
        return reject(Object.assign(newError, error))
      }

      switch (httpResponse.statusCode) {
        case HTTP_STATUS.OK:
          resolve(new APIResponse(HTTP_MESSAGES.OK, HTTP_STATUS.OK, body.data))
          break
        case HTTP_STATUS.BAD_REQUEST:
          reject(new APIError(HTTP_MESSAGES.BAD_REQUEST, HTTP_STATUS.BAD_REQUEST, body))
          break
        case HTTP_STATUS.UNAUTHORIZED:
          reject(new APIError(HTTP_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED, body))
          break
        case HTTP_STATUS.FORBIDDEN:
          reject(new APIError(HTTP_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN, body))
          break
        case HTTP_STATUS.NOT_FOUND:
          reject(new APIError(HTTP_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND, body))
          break
        case HTTP_STATUS.CONFLICT:
          reject(new APIError(HTTP_MESSAGES.CONFLICT, HTTP_STATUS.CONFLICT, body))
          break
        case HTTP_STATUS.SERVER_ERROR:
          reject(new APIError(HTTP_MESSAGES.SERVER_ERROR, HTTP_STATUS.SERVER_ERROR, body))
          break
        default:
          if (httpResponse.statusCode < HTTP_STATUS.ERROR_THRESHOLD) {
            resolve(new APIResponse(httpResponse.statusText, httpResponse.statusCode, 'data' in body ? body.data : body))
          } else {
            reject(new APIError(httpResponse.statusText, httpResponse.statusCode, body))
          }
      }
    }
  }
}
