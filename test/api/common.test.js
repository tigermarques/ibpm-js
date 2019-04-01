const chai = require('chai')
const common = require('../../lib/api/common')

const expect = chai.expect

describe('Common', () => {
  it('should should build the common configuration correctly', () => {
    expect(common.buildConfig({
      username: 'testUser',
      password: 'testPassword'
    })).to.eql({
      auth: {
        username: 'testUser',
        password: 'testPassword'
      },
      headers: {
        'Content-Type': 'application/json'
      },
      json: true
    })
  })

  it('should handle error responses properly', () => {
    return expect(new Promise((resolve, reject) => {
      return common.buildResponseHandler(resolve, reject)(new Error('my error'))
    })).to.eventually.be.rejected
      .then(result => {
        expect(result).to.be.an('error')
        expect(result.message).to.equal('my error')
      })
  })

  it('should handle 200 OK responses properly', () => {
    const body = {
      property: 'value'
    }
    return expect(new Promise((resolve, reject) => {
      return common.buildResponseHandler(resolve, reject)(null, { statusCode: 200 }, body)
    })).to.eventually.be.fulfilled
      .then(result => {
        expect(result).to.eql(body)
      })
  })

  it('should handle 400 BAD REQUEST responses properly', () => {
    return expect(new Promise((resolve, reject) => {
      return common.buildResponseHandler(resolve, reject)(null, { statusCode: 400 })
    })).to.eventually.be.rejected
      .then(result => {
        expect(result).to.be.an('error')
        expect(result.message).to.equal(common.HTTP_MESSAGES.BAD_REQUEST)
      })
  })

  it('should handle 401 UNAUTHORIZED responses properly', () => {
    return expect(new Promise((resolve, reject) => {
      return common.buildResponseHandler(resolve, reject)(null, { statusCode: 401 })
    })).to.eventually.be.rejected
      .then(result => {
        expect(result).to.be.an('error')
        expect(result.message).to.equal(common.HTTP_MESSAGES.UNAUTHORIZED)
      })
  })

  it('should handle 404 NOT FOUND responses properly', () => {
    return expect(new Promise((resolve, reject) => {
      return common.buildResponseHandler(resolve, reject)(null, { statusCode: 404 })
    })).to.eventually.be.rejected
      .then(result => {
        expect(result).to.be.an('error')
        expect(result.message).to.equal(common.HTTP_MESSAGES.NOT_FOUND)
      })
  })

  it('should handle 500 ERROR responses properly', () => {
    return expect(new Promise((resolve, reject) => {
      return common.buildResponseHandler(resolve, reject)(null, { statusCode: 500 })
    })).to.eventually.be.rejected
      .then(result => {
        expect(result).to.be.an('error')
        expect(result.message).to.equal(common.HTTP_MESSAGES.SERVER_ERROR)
      })
  })

  it('should have the correct HTTP status codes', () => {
    expect(common.HTTP_STATUS).to.eql({
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
    expect(common.HTTP_MESSAGES).to.eql({
      OK: 'OK',
      BAD_REQUEST: 'Bad HTTP Request',
      UNAUTHORIZED: 'Unauthorized Access',
      NOT_FOUND: 'Not Found',
      NOT_ACCEPTABLE: 'Not Acceptable',
      SERVER_ERROR: 'Unknown Exception'
    })
  })
})
