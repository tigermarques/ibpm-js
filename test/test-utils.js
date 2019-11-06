const chai = require('chai')
const APIError = require('../lib/utils/APIError')
const APIResponse = require('../lib/utils/APIResponse')
const { HTTP_STATUS, HTTP_MESSAGES } = require('./../lib/api/common')

const expect = chai.expect

module.exports = {
  handleBadRequest: result => {
    expect(result).to.be.an('error')
    expect(result).to.be.an.instanceOf(APIError)
    expect(result.status).to.equal(HTTP_STATUS.BAD_REQUEST)
    expect(result.message).to.equal(HTTP_MESSAGES.BAD_REQUEST)
    return result
  },

  handleUnauthorized: result => {
    expect(result).to.be.an('error')
    expect(result).to.be.an.instanceOf(APIError)
    expect(result.status).to.equal(HTTP_STATUS.UNAUTHORIZED)
    expect(result.message).to.equal(HTTP_MESSAGES.UNAUTHORIZED)
    return result
  },

  handleNotFound: result => {
    expect(result).to.be.an('error')
    expect(result).to.be.an.instanceOf(APIError)
    expect(result.status).to.equal(HTTP_STATUS.NOT_FOUND)
    expect(result.message).to.equal(HTTP_MESSAGES.NOT_FOUND)
    return result
  },

  handleUnknown: result => {
    expect(result).to.be.an('error')
    expect(result).to.be.an.instanceOf(APIError)
    expect(result.status).to.equal(HTTP_STATUS.SERVER_ERROR)
    expect(result.message).to.equal(HTTP_MESSAGES.SERVER_ERROR)
    return result
  },

  handleSuccess: result => {
    expect(result).not.to.be.an('error')
    expect(result).to.be.an.instanceOf(APIResponse)
    expect(result.status).to.equal(HTTP_STATUS.OK.toString())
    expect(result.message).to.equal(HTTP_MESSAGES.OK)
    expect(result).to.have.property('data')
    return result
  }
}
