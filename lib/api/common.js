const APIError = require('../utils/APIError')
const APIResponse = require('../utils/APIResponse')

const HTTP_STATUS = {
  OK: 200,
  ERROR_THRESHOLD: 400,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  NOT_ACCEPTABLE: 404,
  SERVER_ERROR: 500
}

const HTTP_MESSAGES = {
  OK: 'OK',
  BAD_REQUEST: 'Bad HTTP Request',
  UNAUTHORIZED: 'Unauthorized Access',
  NOT_FOUND: 'Not Found',
  NOT_ACCEPTABLE: 'Not Acceptable',
  SERVER_ERROR: 'Unknown Exception'
}

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
        return reject(error)
      }

      switch (httpResponse.statusCode) {
        case HTTP_STATUS.OK:
          resolve(new APIResponse(body.data))
          break
        case HTTP_STATUS.BAD_REQUEST:
          reject(new APIError(HTTP_MESSAGES.BAD_REQUEST, HTTP_STATUS.BAD_REQUEST, body))
          break
        case HTTP_STATUS.UNAUTHORIZED:
          reject(new APIError(HTTP_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED, body))
          break
        case HTTP_STATUS.NOT_FOUND:
          reject(new APIError(HTTP_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND, body))
          break
        case HTTP_STATUS.SERVER_ERROR:
          reject(new APIError(HTTP_MESSAGES.SERVER_ERROR, HTTP_STATUS.SERVER_ERROR, body))
          break
      }
    }
  },

  HTTP_STATUS: HTTP_STATUS,

  HTTP_MESSAGES: HTTP_MESSAGES
}
