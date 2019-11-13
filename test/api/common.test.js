const chai = require('chai')
const common = require('../../lib/api/common')
const APIResponse = require('../../lib/utils/APIResponse')
const APIError = require('../../lib/utils/APIError')
const { handleRequestError, handleBadRequest, handleUnauthorized, handleForbidden, handleNotFound, handleConflict, handleUnknown, handleSuccess } = require('../test-utils')

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

  it('should handle 403 FORBIDDEN responses properly', () => {
    return expect(new Promise((resolve, reject) => {
      return common.buildResponseHandler(resolve, reject)(null, { statusCode: 403 })
    })).to.eventually.be.rejected
      .then(handleForbidden)
  })

  it('should handle 404 NOT FOUND responses properly', () => {
    return expect(new Promise((resolve, reject) => {
      return common.buildResponseHandler(resolve, reject)(null, { statusCode: 404 })
    })).to.eventually.be.rejected
      .then(handleNotFound)
  })

  it('should handle 409 CONFLICT responses properly', () => {
    return expect(new Promise((resolve, reject) => {
      return common.buildResponseHandler(resolve, reject)(null, { statusCode: 409 })
    })).to.eventually.be.rejected
      .then(handleConflict)
  })

  it('should handle 500 ERROR responses properly', () => {
    return expect(new Promise((resolve, reject) => {
      return common.buildResponseHandler(resolve, reject)(null, { statusCode: 500 })
    })).to.eventually.be.rejected
      .then(handleUnknown)
  })

  it('should handle unrecognized success responses property', () => {
    const bodyWithData = {
      data: {
        property: 'value'
      }
    }
    const bodyWithoutData = {
      response: {
        property: 'value'
      }
    }
    return Promise.all([
      expect(new Promise((resolve, reject) => {
        return common.buildResponseHandler(resolve, reject)(null, { statusCode: 201, statusText: 'Created' }, bodyWithData)
      })).to.eventually.be.fulfilled,
      expect(new Promise((resolve, reject) => {
        return common.buildResponseHandler(resolve, reject)(null, { statusCode: 302, statusText: 'Found' }, bodyWithoutData)
      })).to.eventually.be.fulfilled
    ]).then(([res1, res2]) => {
      expect(res1).not.to.be.an('error')
      expect(res1).to.be.an.instanceOf(APIResponse)
      expect(res1.status).to.equal(201)
      expect(res1.message).to.equal('Created')
      expect(res1).to.have.property('data')
      expect(res1.data).to.eql({
        property: 'value'
      })

      expect(res2).not.to.be.an('error')
      expect(res2).to.be.an.instanceOf(APIResponse)
      expect(res2.status).to.equal(302)
      expect(res2.message).to.equal('Found')
      expect(res2).to.have.property('data')
      expect(res2.data).to.eql({
        response: {
          property: 'value'
        }
      })
    })
  })

  it('should handle unrecognized error responses property', () => {
    const body = {
      data: {
        property: 'value'
      }
    }
    return expect(new Promise((resolve, reject) => {
      return common.buildResponseHandler(resolve, reject)(null, { statusCode: 418, statusText: 'I\'m a teapot' }, body)
    })).to.eventually.be.rejected
      .then(response => {
        expect(response).to.be.an('error')
        expect(response).to.be.an.instanceOf(APIError)
        expect(response.status).to.equal(418)
        expect(response.message).to.equal('I\'m a teapot')
        expect(response).to.have.property('data')
        expect(response.data).to.eql({
          data: {
            property: 'value'
          }
        })
      })
  })

  it('should rethrow errors with the correct modifications in genericErrorHandler', () => {
    const error1 = new APIError('message', 'status', null)
    const error2 = new APIError('message', 'status', {
      key: 'value'
    })
    const error3 = new APIError('message', 'status', {
      Data: {
        errorNumber: 'value1',
        errorMessage: 'value2'
      }
    })
    expect(() => common.genericErrorHandler(error1)).to.throw(APIError).with.property('data', null)
    expect(() => common.genericErrorHandler(error2)).to.throw(APIError).with.deep.property('data', {
      key: 'value'
    })
    expect(() => common.genericErrorHandler(error3)).to.throw(APIError).with.deep.property('data', {
      errorNumber: 'value1',
      errorMessage: 'value2'
    })
  })
})
