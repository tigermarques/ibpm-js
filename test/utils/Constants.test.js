const chai = require('chai')
const Constants = require('../../lib/utils/Constants')

const expect = chai.expect

describe('Constants', () => {
  it('should have the correct HTTP status codes', () => {
    expect(Constants.HTTP_STATUS).to.eql({
      OK: 200,
      ERROR_THRESHOLD: 400,
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      NOT_FOUND: 404,
      NOT_ACCEPTABLE: 404,
      SERVER_ERROR: 500
    })
  })

  it('should have the correct HTTP messages', () => {
    expect(Constants.HTTP_MESSAGES).to.eql({
      OK: 'OK',
      BAD_REQUEST: 'Bad HTTP Request',
      UNAUTHORIZED: 'Unauthorized Access',
      NOT_FOUND: 'Not Found',
      NOT_ACCEPTABLE: 'Not Acceptable',
      SERVER_ERROR: 'Unknown Exception'
    })
  })
})
