const chai = require('chai')
const Constants = require('../../lib/utils/Constants')

const expect = chai.expect

describe('Constants', () => {
  it('should have the correct HTTP status codes', () => {
    expect(Constants.HTTP_STATUS).to.eql({
      REQUEST_ERROR: 0,
      OK: 200,
      ERROR_THRESHOLD: 400,
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      NOT_ACCEPTABLE: 404,
      CONFLICT: 409,
      SERVER_ERROR: 500
    })
  })

  it('should have the correct HTTP messages', () => {
    expect(Constants.HTTP_MESSAGES).to.eql({
      REQUEST_ERROR: 'Request Error',
      OK: 'OK',
      BAD_REQUEST: 'Bad HTTP Request',
      UNAUTHORIZED: 'Unauthorized Access',
      FORBIDDEN: 'Forbidden',
      NOT_FOUND: 'Not Found',
      NOT_ACCEPTABLE: 'Not Acceptable',
      CONFLICT: 'Conflict',
      SERVER_ERROR: 'Unknown Exception'
    })
  })
})
