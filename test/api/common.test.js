const chai = require('chai')
const common = require('../../lib/api/common')
const { handleRequestError, handleBadRequest, handleUnauthorized, handleNotFound, handleUnknown, handleSuccess } = require('../test-utils')

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
      .then(handleRequestError)
      .then(result => {
        expect(result.message).to.equal('my error')
      })
  })

  it('should handle 200 OK responses properly', () => {
    const body = {
      data: {
        property: 'value'
      }
    }
    return expect(new Promise((resolve, reject) => {
      return common.buildResponseHandler(resolve, reject)(null, { statusCode: 200 }, body)
    })).to.eventually.be.fulfilled
      .then(handleSuccess)
      .then(result => {
        expect(result.data).to.eql({
          property: 'value'
        })
      })
  })

  it('should handle 400 BAD REQUEST responses properly', () => {
    return expect(new Promise((resolve, reject) => {
      return common.buildResponseHandler(resolve, reject)(null, { statusCode: 400 })
    })).to.eventually.be.rejected
      .then(handleBadRequest)
  })

  it('should handle 401 UNAUTHORIZED responses properly', () => {
    return expect(new Promise((resolve, reject) => {
      return common.buildResponseHandler(resolve, reject)(null, { statusCode: 401 })
    })).to.eventually.be.rejected
      .then(handleUnauthorized)
  })

  it('should handle 404 NOT FOUND responses properly', () => {
    return expect(new Promise((resolve, reject) => {
      return common.buildResponseHandler(resolve, reject)(null, { statusCode: 404 })
    })).to.eventually.be.rejected
      .then(handleNotFound)
  })

  it('should handle 500 ERROR responses properly', () => {
    return expect(new Promise((resolve, reject) => {
      return common.buildResponseHandler(resolve, reject)(null, { statusCode: 500 })
    })).to.eventually.be.rejected
      .then(handleUnknown)
  })
})
