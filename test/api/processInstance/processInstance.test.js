const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const chaiSubset = require('chai-subset')
const nock = require('nock')
const xml2js = require('xml2js')
const basicAuth = require('basic-auth')
const queryString = require('querystring')
const processInstance = require('../../../lib/api/processInstance')
const { HTTP_MESSAGES } = require('./../../../lib/utils/Constants')
const { handleBadRequest, handleUnauthorized, handleForbidden, handleConflict, handleNotFound, handleUnknown, handleSuccess } = require('../../test-utils')

const expect = chai.expect
chai.use(chaiAsPromised)
chai.use(chaiSubset)

describe('Process Instance', () => {
  describe('getById', () => {
    beforeEach(() => {
      nock('https://myDomain:9443')
        .get(/^\/rest\/bpm\/wle\/v1\/process/)
        .query(true)
        .reply(function (url, body) {
          const auth = basicAuth.parse(this.req.headers.authorization)
          if (auth && auth.name === 'myUser' && auth.pass === 'myPassword') {
            const instanceId = this.req.path.split('?')[0].split('/').slice(-1)[0]
            if (instanceId === '23972') {
              return [200, require('./responses/getById/success.json')]
            } else if (instanceId === 'asd') {
              return [400, require('./responses/getById/badRequest.json')]
            } else if (instanceId === '123456789123456789') {
              return [500, require('./responses/getById/exception.json')]
            } else {
              const response = require('./responses/getById/notFound.json')
              response.Data.errorMessage = response.Data.errorMessage.replace('@instanceId', instanceId)
              response.Data.errorMessageParameters[0] = response.Data.errorMessageParameters[0].replace('@instanceId', instanceId)
              return [404, response]
            }
          } else {
            return [401]
          }
        })
    })

    it('should return an Unauthorized error when wrong credentials are provided', () => {
      return expect(processInstance.getById({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myWrongUser',
        password: 'myWrongPassword'
      }, 123456)).to.eventually.be.rejected
        .then(handleUnauthorized)
    })

    it('should return a not found error when the instance id does not exist', () => {
      return expect(processInstance.getById({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 123456)).to.eventually.be.rejected
        .then(handleNotFound)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0059E',
            errorMessage: 'CWTBG0059E: The instance with the ID \'123456\' could not be found.'
          })
        })
    })

    it('should return a bad request error when the instance id is not a number', () => {
      return expect(processInstance.getById({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'asd')).to.eventually.be.rejected
        .then(handleBadRequest)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0553E',
            errorMessage: 'CWTBG0553E: A \'BPDInstance\' instance id was expected, but instead of a number the id is \'asd\'.'
          })
        })
    })

    it('should return a server error when the instance id cannot be parsed', () => {
      return expect(processInstance.getById({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, '123456789123456789')).to.eventually.be.rejected
        .then(handleUnknown)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0019E',
            errorMessage: 'CWTBG0019E: Unexpected exception during execution. Exception information: \'Unexpected database exception\'.'
          })
        })
    })

    it('should return instance details when the correct input is provided', () => {
      return expect(processInstance.getById({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 23972)).to.eventually.be.fulfilled
        .then(handleSuccess)
        .then((response) => {
          expect(response.data).to.be.an('object')
          expect(response.data.piid).to.equal('23972')
        })
    })
  })

  describe('suspend', () => {
    beforeEach(() => {
      nock('https://myDomain:9443')
        .put(/^\/rest\/bpm\/wle\/v1\/process/)
        .query(queryObj => queryObj.action === 'suspend')
        .reply(function (url, body) {
          const auth = basicAuth.parse(this.req.headers.authorization)
          if (auth && auth.name === 'myUser' && auth.pass === 'myPassword') {
            const instanceId = this.req.path.split('?')[0].split('/').slice(-1)[0]
            if (instanceId === '42667') {
              return [200, require('./responses/suspend/success.json')]
            } else if (instanceId === 'asd') {
              return [400, require('./responses/suspend/badRequest.json')]
            } else if (instanceId === '123456789123456789') {
              return [500, require('./responses/suspend/exception.json')]
            } else if (instanceId === '654321') {
              return [401, require('./responses/suspend/forbidden.json')]
            } else {
              const response = require('./responses/suspend/notFound.json')
              response.Data.errorMessage = response.Data.errorMessage.replace('@instanceId', instanceId)
              response.Data.errorMessageParameters[1] = response.Data.errorMessageParameters[1].replace('@instanceId', instanceId)
              response.Data.programmersDetails = response.Data.programmersDetails.replace('@instanceId', instanceId)
              return [500, response]
            }
          } else {
            return [401]
          }
        })
    })

    it('should return an Unauthorized error when wrong credentials are provided', () => {
      return expect(processInstance.suspend({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myWrongUser',
        password: 'myWrongPassword'
      }, 123456)).to.eventually.be.rejected
        .then(handleUnauthorized)
    })

    it('should return a not found error when the instance does not exist', () => {
      return expect(processInstance.suspend({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 123456)).to.eventually.be.rejected
        .then(handleNotFound)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0025E',
            errorMessage: 'CWTBG0025E: Unexpected failure occurred while performing the \'suspend\' action.  The reported failure is: \'BPDInstance with ID BPDInstance.123456 not found.\':'
          })
        })
    })

    it('should return a bad request error when the instance id is not a number', () => {
      return expect(processInstance.suspend({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'asd')).to.eventually.be.rejected
        .then(handleBadRequest)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0553E',
            errorMessage: 'CWTBG0553E: A \'BPDInstance\' instance id was expected, but instead of a number the id is \'asd\'.'
          })
        })
    })

    it('should return a server error when the instance id cannot be parsed', () => {
      return expect(processInstance.suspend({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, '123456789123456789')).to.eventually.be.rejected
        .then(handleUnknown)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0019E',
            errorMessage: 'CWTBG0019E: Unexpected exception during execution. Exception information: \'Unexpected database exception\'.'
          })
        })
    })

    it('should return a conflict error when the instance is not in a state that allows it to be suspended', () => {
      return expect(processInstance.suspend({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 654321)).to.eventually.be.rejected
        .then(handleConflict)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0549E',
            errorMessage: 'CWTBG0549E: You are not authorized to perform the \'suspend\' action.'
          })
        })
    })

    it('should return instance details when the instance was suspended', () => {
      return expect(processInstance.suspend({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 42667)).to.eventually.be.fulfilled
        .then(handleSuccess)
        .then((response) => {
          expect(response.data).to.be.an('object')
          expect(response.data.piid).to.equal('42667')
          expect(response.data.state).to.equal('STATE_SUSPENDED')
        })
    })
  })

  describe('resume', () => {
    beforeEach(() => {
      nock('https://myDomain:9443')
        .put(/^\/rest\/bpm\/wle\/v1\/process/)
        .query(queryObj => queryObj.action === 'resume')
        .reply(function (url, body) {
          const auth = basicAuth.parse(this.req.headers.authorization)
          if (auth && auth.name === 'myUser' && auth.pass === 'myPassword') {
            const instanceId = this.req.path.split('?')[0].split('/').slice(-1)[0]
            if (instanceId === '42667') {
              return [200, require('./responses/resume/success.json')]
            } else if (instanceId === 'asd') {
              return [400, require('./responses/resume/badRequest.json')]
            } else if (instanceId === '123456789123456789') {
              return [500, require('./responses/resume/exception.json')]
            } else if (instanceId === '654321') {
              return [409, require('./responses/resume/conflict.json')]
            } else {
              const response = require('./responses/resume/notFound.json')
              response.Data.errorMessage = response.Data.errorMessage.replace('@instanceId', instanceId)
              response.Data.errorMessageParameters[0] = response.Data.errorMessageParameters[0].replace('@instanceId', instanceId)
              response.Data.programmersDetails = response.Data.programmersDetails.replace('@instanceId', instanceId)
              return [500, response]
            }
          } else {
            return [401]
          }
        })
    })

    it('should return an Unauthorized error when wrong credentials are provided', () => {
      return expect(processInstance.resume({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myWrongUser',
        password: 'myWrongPassword'
      }, 123456)).to.eventually.be.rejected
        .then(handleUnauthorized)
    })

    it('should return a not found error when the instance does not exist', () => {
      return expect(processInstance.resume({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 123456)).to.eventually.be.rejected
        .then(handleNotFound)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0019E',
            errorMessage: 'CWTBG0019E: Unexpected exception during execution. Exception information: \'BPDInstance with ID BPDInstance.123456 not found.\'.'
          })
        })
    })

    it('should return a bad request error when the instance id is not a number', () => {
      return expect(processInstance.resume({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'asd')).to.eventually.be.rejected
        .then(handleBadRequest)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0553E',
            errorMessage: 'CWTBG0553E: A \'BPDInstance\' instance id was expected, but instead of a number the id is \'asd\'.'
          })
        })
    })

    it('should return a server error when the instance id cannot be parsed', () => {
      return expect(processInstance.resume({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, '123456789123456789')).to.eventually.be.rejected
        .then(handleUnknown)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0019E',
            errorMessage: 'CWTBG0019E: Unexpected exception during execution. Exception information: \'Unexpected database exception\'.'
          })
        })
    })

    it('should return a conflict error when the instance is not in a state that allows it to be resumed', () => {
      return expect(processInstance.resume({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 654321)).to.eventually.be.rejected
        .then(handleConflict)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0014E',
            errorMessage: 'CWTBG0014E: The state \'Active\' of object \'2072.42689\' does not allow the requested action \'resume\'.'
          })
        })
    })

    it('should return instance details when the instance was resumed', () => {
      return expect(processInstance.resume({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 42667)).to.eventually.be.fulfilled
        .then(handleSuccess)
        .then((response) => {
          expect(response.data).to.be.an('object')
          expect(response.data.piid).to.equal('42667')
          expect(response.data.state).to.equal('STATE_RUNNING')
        })
    })
  })

  describe('terminate', () => {
    beforeEach(() => {
      nock('https://myDomain:9443')
        .put(/^\/rest\/bpm\/wle\/v1\/process/)
        .query(queryObj => queryObj.action === 'terminate')
        .reply(function (url, body) {
          const auth = basicAuth.parse(this.req.headers.authorization)
          if (auth && auth.name === 'myUser' && auth.pass === 'myPassword') {
            const instanceId = this.req.path.split('?')[0].split('/').slice(-1)[0]
            if (instanceId === '42667') {
              return [200, require('./responses/terminate/success.json')]
            } else if (instanceId === 'asd') {
              return [400, require('./responses/terminate/badRequest.json')]
            } else if (instanceId === '123456789123456789') {
              return [500, require('./responses/terminate/exception.json')]
            } else if (instanceId === '654321') {
              return [401, require('./responses/terminate/forbidden.json')]
            } else {
              const response = require('./responses/terminate/notFound.json')
              response.Data.errorMessage = response.Data.errorMessage.replace('@instanceId', instanceId)
              response.Data.errorMessageParameters[1] = response.Data.errorMessageParameters[1].replace('@instanceId', instanceId)
              response.Data.programmersDetails = response.Data.programmersDetails.replace('@instanceId', instanceId)
              return [500, response]
            }
          } else {
            return [401]
          }
        })
    })

    it('should return an Unauthorized error when wrong credentials are provided', () => {
      return expect(processInstance.terminate({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myWrongUser',
        password: 'myWrongPassword'
      }, 123456)).to.eventually.be.rejected
        .then(handleUnauthorized)
    })

    it('should return a not found error when the instance does not exist', () => {
      return expect(processInstance.terminate({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 123456)).to.eventually.be.rejected
        .then(handleNotFound)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0025E',
            errorMessage: 'CWTBG0025E: Unexpected failure occurred while performing the \'terminate\' action.  The reported failure is: \'BPDInstance with ID BPDInstance.123456 not found.\':'
          })
        })
    })

    it('should return a bad request error when the instance id is not a number', () => {
      return expect(processInstance.terminate({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'asd')).to.eventually.be.rejected
        .then(handleBadRequest)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0553E',
            errorMessage: 'CWTBG0553E: A \'BPDInstance\' instance id was expected, but instead of a number the id is \'asd\'.'
          })
        })
    })

    it('should return a server error when the instance id cannot be parsed', () => {
      return expect(processInstance.terminate({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, '123456789123456789')).to.eventually.be.rejected
        .then(handleUnknown)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0019E',
            errorMessage: 'CWTBG0019E: Unexpected exception during execution. Exception information: \'Unexpected database exception\'.'
          })
        })
    })

    it('should return a conflict error when the instance is not in a state that allows it to be aborted', () => {
      return expect(processInstance.terminate({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 654321)).to.eventually.be.rejected
        .then(handleConflict)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0549E',
            errorMessage: 'CWTBG0549E: You are not authorized to perform the \'abort\' action.'
          })
        })
    })

    it('should return instance details when the instance was aborted', () => {
      return expect(processInstance.terminate({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 42667)).to.eventually.be.fulfilled
        .then(handleSuccess)
        .then((response) => {
          expect(response.data).to.be.an('object')
          expect(response.data.piid).to.equal('42667')
          expect(response.data.state).to.equal('STATE_TERMINATED')
        })
    })
  })

  describe('retry', () => {
    beforeEach(() => {
      nock('https://myDomain:9443')
        .put(/^\/rest\/bpm\/wle\/v1\/process/)
        .query(queryObj => queryObj.action === 'retry')
        .reply(function (url, body) {
          const auth = basicAuth.parse(this.req.headers.authorization)
          if (auth && auth.name === 'myUser' && auth.pass === 'myPassword') {
            const instanceId = this.req.path.split('?')[0].split('/').slice(-1)[0]
            if (instanceId === '42667') {
              return [200, require('./responses/retry/success.json')]
            } else if (instanceId === 'asd') {
              return [400, require('./responses/retry/badRequest.json')]
            } else if (instanceId === '123456789123456789') {
              return [500, require('./responses/retry/exception.json')]
            } else if (instanceId === '654321') {
              return [409, require('./responses/retry/conflict.json')]
            } else {
              const response = require('./responses/retry/notFound.json')
              response.Data.errorMessage = response.Data.errorMessage.replace('@instanceId', instanceId)
              response.Data.errorMessageParameters[0] = response.Data.errorMessageParameters[0].replace('@instanceId', instanceId)
              response.Data.programmersDetails = response.Data.programmersDetails.replace('@instanceId', instanceId)
              return [500, response]
            }
          } else {
            return [401]
          }
        })
    })

    it('should return an Unauthorized error when wrong credentials are provided', () => {
      return expect(processInstance.retry({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myWrongUser',
        password: 'myWrongPassword'
      }, 123456)).to.eventually.be.rejected
        .then(handleUnauthorized)
    })

    it('should return a not found error when the instance does not exist', () => {
      return expect(processInstance.retry({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 123456)).to.eventually.be.rejected
        .then(handleNotFound)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0019E',
            errorMessage: 'CWTBG0019E: Unexpected exception during execution. Exception information: \'BPDInstance with ID BPDInstance.123456 not found.\'.'
          })
        })
    })

    it('should return a bad request error when the instance id is not a number', () => {
      return expect(processInstance.retry({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'asd')).to.eventually.be.rejected
        .then(handleBadRequest)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0553E',
            errorMessage: 'CWTBG0553E: A \'BPDInstance\' instance id was expected, but instead of a number the id is \'asd\'.'
          })
        })
    })

    it('should return a server error when the instance id cannot be parsed', () => {
      return expect(processInstance.retry({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, '123456789123456789')).to.eventually.be.rejected
        .then(handleUnknown)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0019E',
            errorMessage: 'CWTBG0019E: Unexpected exception during execution. Exception information: \'Unexpected database exception\'.'
          })
        })
    })

    it('should return a conflict error when the instance is not in a state that allows it to be retried', () => {
      return expect(processInstance.retry({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 654321)).to.eventually.be.rejected
        .then(handleConflict)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0014E',
            errorMessage: 'CWTBG0014E: The state \'Active\' of object \'2072.42573\' does not allow the requested action \'retry\'.'
          })
        })
    })

    it('should return instance details when the instance was retried', () => {
      return expect(processInstance.retry({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 42667)).to.eventually.be.fulfilled
        .then(handleSuccess)
        .then((response) => {
          expect(response.data).to.be.an('object')
          expect(response.data.piid).to.equal('42667')
          expect(response.data.state).to.equal('STATE_RUNNING')
        })
    })
  })

  describe('delete', () => {
    beforeEach(() => {
      nock('https://myDomain:9443')
        .delete(/^\/rest\/bpm\/wle\/v1\/process/)
        .query(queryObj => queryObj.action === 'delete')
        .reply(function (url, body) {
          const auth = basicAuth.parse(this.req.headers.authorization)
          if (auth && auth.name === 'myUser' && auth.pass === 'myPassword') {
            const instanceId = this.req.path.split('?')[0].split('/').slice(-1)[0]
            if (instanceId === '42667') {
              return [200, require('./responses/delete/success.json')]
            } else if (instanceId === 'asd') {
              return [400, require('./responses/delete/badRequest.json')]
            } else if (instanceId === '123456789123456789') {
              return [500, require('./responses/delete/exception.json')]
            } else {
              const response = require('./responses/delete/notFound.json')
              response.Data.errorMessage = response.Data.errorMessage.replace('@instanceId', instanceId)
              response.Data.errorMessageParameters[0] = response.Data.errorMessageParameters[0].replace('@instanceId', instanceId)
              return [404, response]
            }
          } else {
            return [401]
          }
        })
    })

    it('should return an Unauthorized error when wrong credentials are provided', () => {
      return expect(processInstance.delete({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myWrongUser',
        password: 'myWrongPassword'
      }, 123456)).to.eventually.be.rejected
        .then(handleUnauthorized)
    })

    it('should return a not found error when the instance does not exist', () => {
      return expect(processInstance.delete({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 123456)).to.eventually.be.rejected
        .then(handleNotFound)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0059E',
            errorMessage: 'CWTBG0059E: The instance with the ID \'123456\' could not be found.'
          })
        })
    })

    it('should return a bad request error when the instance id is not a number', () => {
      return expect(processInstance.delete({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'asd')).to.eventually.be.rejected
        .then(handleBadRequest)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0553E',
            errorMessage: 'CWTBG0553E: A \'BPDInstance\' instance id was expected, but instead of a number the id is \'asd\'.'
          })
        })
    })

    it('should return a server error when the instance id cannot be parsed', () => {
      return expect(processInstance.delete({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, '123456789123456789')).to.eventually.be.rejected
        .then(handleUnknown)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0019E',
            errorMessage: 'CWTBG0019E: Unexpected exception during execution. Exception information: \'Unexpected database exception\'.'
          })
        })
    })

    it('should return instance details when the instance was deleted', () => {
      return expect(processInstance.delete({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 42667)).to.eventually.be.fulfilled
        .then(handleSuccess)
        .then((response) => {
          expect(response.data).to.be.an('object')
          expect(response.data.piid).to.equal('42667')
          expect(response.data.state).to.equal('Deleted')
        })
    })
  })

  describe('bulkSuspend', () => {
    beforeEach(() => {
      nock('https://myDomain:9443')
        .put('/rest/bpm/wle/v1/process/bulk')
        .query(queryObj => queryObj.action === 'suspend')
        .reply(function (url, body) {
          const auth = basicAuth.parse(this.req.headers.authorization)
          if (auth && auth.name === 'myUser' && auth.pass === 'myPassword') {
            const instanceIds = queryString.parse(this.req.path.split('?')[1]).instanceIds.split(',')
            const response = {
              status: '200',
              data: {
                failedOperation: null,
                processDetails: null,
                succeeded: null,
                failed: null
              }
            }
            for (let i = 0; i < instanceIds.length; i++) {
              const instanceId = instanceIds[i]
              if (instanceId === '23972') {
                response.data.processDetails = [require('./responses/bulkSuspend_success.json')]
              } else if (instanceId === '32664') {
                if (!response.data.failedOperations) {
                  response.data.failedOperations = []
                }
                response.data.failedOperations.push(require('./responses/bulkSuspend_failure.json'))
              } else {
                if (!response.data.failedOperations) {
                  response.data.failedOperations = []
                }
                const error = require('./responses/bulkSuspend_notfound.json')
                error.instanceId = instanceId
                error.errorMessage = error.errorMessage.replace('@instanceId', instanceId)
                response.data.failedOperations.push(error)
              }
            }
            return [200, response]
          } else {
            return [401]
          }
        })
    })

    it('should return an Unauthorized error when wrong credentials are provided', () => {
      return expect(processInstance.bulkSuspend({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myWrongUser',
        password: 'myWrongPassword'
      }, [123456])).to.eventually.be.rejected
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.UNAUTHORIZED)
        })
    })

    it('should return a success response with a not found error when the instance does not exist', () => {
      return expect(processInstance.bulkSuspend({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, [123456])).to.eventually.be.fulfilled
        .then(body => {
          expect(body.status).to.equal('200')
          expect(body.data).to.be.an('object')
          expect(body.data.failedOperations).to.be.an('array').and.to.have.length(1)
          expect(body.data.failedOperations).to.eql([{
            instanceId: '123456',
            errorNumber: 'CWTBG0025E',
            errorMessage: 'CWTBG0025E: Ocorreu uma falha inesperada ao executar a acção \'suspend\'.  A falha reportada é: \'BPDInstance com o ID BPDInstance.123456 não foi localizado.\':'
          }])
        })
    })

    it('should return a success response with a failure error when the instance cannot be suspended', () => {
      return expect(processInstance.bulkSuspend({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, [32664])).to.eventually.be.fulfilled
        .then(body => {
          expect(body.status).to.equal('200')
          expect(body.data).to.be.an('object')
          expect(body.data.failedOperations).to.be.an('array').and.to.have.length(1)
          expect(body.data.failedOperations).to.eql([{
            instanceId: '32664',
            errorNumber: 'CWTBG0549E',
            errorMessage: 'CWTBG0549E: Não está autorizado a efectuar a acção \'suspend\'.'
          }])
        })
    })

    it('should return a success response with the instance details when the instance was suspended', () => {
      return expect(processInstance.bulkSuspend({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, [23972])).to.eventually.be.fulfilled
        .then(body => {
          expect(body.status).to.equal('200')
          expect(body.data).to.be.an('object')
          expect(body.data.processDetails).to.be.an('array').and.to.have.length(1)
        })
    })

    it('should return a mixed response when some inputs were correct and some were not', () => {
      return expect(processInstance.bulkSuspend({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, [123456, 32664, 23972])).to.eventually.be.fulfilled
        .then(body => {
          expect(body.status).to.equal('200')
          expect(body.data).to.be.an('object')
          expect(body.data.processDetails).to.be.an('array').and.to.have.length(1)
          expect(body.data.failedOperations).to.be.an('array').and.to.have.length(2)
          expect(body.data.failedOperations).to.eql([{
            instanceId: '123456',
            errorNumber: 'CWTBG0025E',
            errorMessage: 'CWTBG0025E: Ocorreu uma falha inesperada ao executar a acção \'suspend\'.  A falha reportada é: \'BPDInstance com o ID BPDInstance.123456 não foi localizado.\':'
          }, {
            instanceId: '32664',
            errorNumber: 'CWTBG0549E',
            errorMessage: 'CWTBG0549E: Não está autorizado a efectuar a acção \'suspend\'.'
          }])
        })
    })
  })

  describe('bulkResume', () => {
    beforeEach(() => {
      nock('https://myDomain:9443')
        .put('/rest/bpm/wle/v1/process/bulk')
        .query(queryObj => queryObj.action === 'resume')
        .reply(function (url, body) {
          const auth = basicAuth.parse(this.req.headers.authorization)
          if (auth && auth.name === 'myUser' && auth.pass === 'myPassword') {
            const instanceIds = queryString.parse(this.req.path.split('?')[1]).instanceIds.split(',')
            const response = {
              status: '200',
              data: {
                failedOperation: null,
                processDetails: null,
                succeeded: null,
                failed: null
              }
            }
            for (let i = 0; i < instanceIds.length; i++) {
              const instanceId = instanceIds[i]
              if (instanceId === '23972') {
                response.data.processDetails = [require('./responses/bulkResume_success.json')]
              } else if (instanceId === '32664') {
                if (!response.data.failedOperations) {
                  response.data.failedOperations = []
                }
                response.data.failedOperations.push(require('./responses/bulkResume_failure.json'))
              } else {
                if (!response.data.failedOperations) {
                  response.data.failedOperations = []
                }
                const error = require('./responses/bulkResume_notfound.json')
                error.instanceId = instanceId
                error.errorMessage = error.errorMessage.replace('@instanceId', instanceId)
                response.data.failedOperations.push(error)
              }
            }
            return [200, response]
          } else {
            return [401]
          }
        })
    })

    it('should return an Unauthorized error when wrong credentials are provided', () => {
      return expect(processInstance.bulkResume({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myWrongUser',
        password: 'myWrongPassword'
      }, [123456])).to.eventually.be.rejected
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.UNAUTHORIZED)
        })
    })

    it('should return a success response with a not found error when the instance does not exist', () => {
      return expect(processInstance.bulkResume({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, [123456])).to.eventually.be.fulfilled
        .then(body => {
          expect(body.status).to.equal('200')
          expect(body.data).to.be.an('object')
          expect(body.data.failedOperations).to.be.an('array').and.to.have.length(1)
          expect(body.data.failedOperations).to.eql([{
            instanceId: '123456',
            errorNumber: 'CWTBG0025E',
            errorMessage: 'CWTBG0025E: Ocorreu uma falha inesperada ao executar a acção \'resume\'.  A falha reportada é: \'BPDInstance com o ID BPDInstance.123456 não foi localizado.\':'
          }])
        })
    })

    it('should return a success response with a failure error when the instance cannot be resumed', () => {
      return expect(processInstance.bulkResume({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, [32664])).to.eventually.be.fulfilled
        .then(body => {
          expect(body.status).to.equal('200')
          expect(body.data).to.be.an('object')
          expect(body.data.failedOperations).to.be.an('array').and.to.have.length(1)
          expect(body.data.failedOperations).to.eql([{
            instanceId: '32664',
            errorNumber: 'CWTBG0549E',
            errorMessage: 'CWTBG0549E: Não está autorizado a efectuar a acção \'resume\'.'
          }])
        })
    })

    it('should return a success response with the instance details when the instance was resumed', () => {
      return expect(processInstance.bulkResume({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, [23972])).to.eventually.be.fulfilled
        .then(body => {
          expect(body.status).to.equal('200')
          expect(body.data).to.be.an('object')
          expect(body.data.processDetails).to.be.an('array').and.to.have.length(1)
        })
    })

    it('should return a mixed response when some inputs were correct and some were not', () => {
      return expect(processInstance.bulkResume({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, [123456, 32664, 23972])).to.eventually.be.fulfilled
        .then(body => {
          expect(body.status).to.equal('200')
          expect(body.data).to.be.an('object')
          expect(body.data.processDetails).to.be.an('array').and.to.have.length(1)
          expect(body.data.failedOperations).to.be.an('array').and.to.have.length(2)
          expect(body.data.failedOperations).to.eql([{
            instanceId: '123456',
            errorNumber: 'CWTBG0025E',
            errorMessage: 'CWTBG0025E: Ocorreu uma falha inesperada ao executar a acção \'resume\'.  A falha reportada é: \'BPDInstance com o ID BPDInstance.123456 não foi localizado.\':'
          }, {
            instanceId: '32664',
            errorNumber: 'CWTBG0549E',
            errorMessage: 'CWTBG0549E: Não está autorizado a efectuar a acção \'resume\'.'
          }])
        })
    })
  })

  describe('bulkTerminate', () => {
    beforeEach(() => {
      nock('https://myDomain:9443')
        .put('/rest/bpm/wle/v1/process/bulk')
        .query(queryObj => queryObj.action === 'terminate')
        .reply(function (url, body) {
          const auth = basicAuth.parse(this.req.headers.authorization)
          if (auth && auth.name === 'myUser' && auth.pass === 'myPassword') {
            const instanceIds = queryString.parse(this.req.path.split('?')[1]).instanceIds.split(',')
            const response = {
              status: '200',
              data: {
                failedOperation: null,
                processDetails: null,
                succeeded: null,
                failed: null
              }
            }
            for (let i = 0; i < instanceIds.length; i++) {
              const instanceId = instanceIds[i]
              if (instanceId === '23972') {
                response.data.processDetails = [require('./responses/bulkTerminate_success.json')]
              } else if (instanceId === '32664') {
                if (!response.data.failedOperations) {
                  response.data.failedOperations = []
                }
                response.data.failedOperations.push(require('./responses/bulkTerminate_failure.json'))
              } else {
                if (!response.data.failedOperations) {
                  response.data.failedOperations = []
                }
                const error = require('./responses/bulkTerminate_notfound.json')
                error.instanceId = instanceId
                error.errorMessage = error.errorMessage.replace('@instanceId', instanceId)
                response.data.failedOperations.push(error)
              }
            }
            return [200, response]
          } else {
            return [401]
          }
        })
    })

    it('should return an Unauthorized error when wrong credentials are provided', () => {
      return expect(processInstance.bulkTerminate({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myWrongUser',
        password: 'myWrongPassword'
      }, [123456])).to.eventually.be.rejected
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.UNAUTHORIZED)
        })
    })

    it('should return a success response with a not found error when the instance does not exist', () => {
      return expect(processInstance.bulkTerminate({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, [123456])).to.eventually.be.fulfilled
        .then(body => {
          expect(body.status).to.equal('200')
          expect(body.data).to.be.an('object')
          expect(body.data.failedOperations).to.be.an('array').and.to.have.length(1)
          expect(body.data.failedOperations).to.eql([{
            instanceId: '123456',
            errorNumber: 'CWTBG0025E',
            errorMessage: 'CWTBG0025E: Ocorreu uma falha inesperada ao executar a acção \'terminate\'.  A falha reportada é: \'BPDInstance com o ID BPDInstance.123456 não foi localizado.\':'
          }])
        })
    })

    it('should return a success response with a failure error when the instance cannot be terminated', () => {
      return expect(processInstance.bulkTerminate({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, [32664])).to.eventually.be.fulfilled
        .then(body => {
          expect(body.status).to.equal('200')
          expect(body.data).to.be.an('object')
          expect(body.data.failedOperations).to.be.an('array').and.to.have.length(1)
          expect(body.data.failedOperations).to.eql([{
            instanceId: '32664',
            errorNumber: 'CWTBG0549E',
            errorMessage: 'CWTBG0549E: Não está autorizado a efectuar a acção \'terminate\'.'
          }])
        })
    })

    it('should return a success response with the instance details when the instance was terminated', () => {
      return expect(processInstance.bulkTerminate({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, [23972])).to.eventually.be.fulfilled
        .then(body => {
          expect(body.status).to.equal('200')
          expect(body.data).to.be.an('object')
          expect(body.data.processDetails).to.be.an('array').and.to.have.length(1)
        })
    })

    it('should return a mixed response when some inputs were correct and some were not', () => {
      return expect(processInstance.bulkTerminate({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, [123456, 32664, 23972])).to.eventually.be.fulfilled
        .then(body => {
          expect(body.status).to.equal('200')
          expect(body.data).to.be.an('object')
          expect(body.data.processDetails).to.be.an('array').and.to.have.length(1)
          expect(body.data.failedOperations).to.be.an('array').and.to.have.length(2)
          expect(body.data.failedOperations).to.eql([{
            instanceId: '123456',
            errorNumber: 'CWTBG0025E',
            errorMessage: 'CWTBG0025E: Ocorreu uma falha inesperada ao executar a acção \'terminate\'.  A falha reportada é: \'BPDInstance com o ID BPDInstance.123456 não foi localizado.\':'
          }, {
            instanceId: '32664',
            errorNumber: 'CWTBG0549E',
            errorMessage: 'CWTBG0549E: Não está autorizado a efectuar a acção \'terminate\'.'
          }])
        })
    })
  })

  describe('bulkRetry', () => {
    beforeEach(() => {
      nock('https://myDomain:9443')
        .put('/rest/bpm/wle/v1/process/bulk')
        .query(queryObj => queryObj.action === 'retry')
        .reply(function (url, body) {
          const auth = basicAuth.parse(this.req.headers.authorization)
          if (auth && auth.name === 'myUser' && auth.pass === 'myPassword') {
            const instanceIds = queryString.parse(this.req.path.split('?')[1]).instanceIds.split(',')
            const response = {
              status: '200',
              data: {
                failedOperation: null,
                processDetails: null,
                succeeded: null,
                failed: null
              }
            }
            for (let i = 0; i < instanceIds.length; i++) {
              const instanceId = instanceIds[i]
              if (instanceId === '23972') {
                response.data.processDetails = [require('./responses/bulkRetry_success.json')]
              } else if (instanceId === '32664') {
                if (!response.data.failedOperations) {
                  response.data.failedOperations = []
                }
                response.data.failedOperations.push(require('./responses/bulkRetry_failure.json'))
              } else {
                if (!response.data.failedOperations) {
                  response.data.failedOperations = []
                }
                const error = require('./responses/bulkRetry_notfound.json')
                error.instanceId = instanceId
                error.errorMessage = error.errorMessage.replace('@instanceId', instanceId)
                response.data.failedOperations.push(error)
              }
            }
            return [200, response]
          } else {
            return [401]
          }
        })
    })

    it('should return an Unauthorized error when wrong credentials are provided', () => {
      return expect(processInstance.bulkRetry({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myWrongUser',
        password: 'myWrongPassword'
      }, [123456])).to.eventually.be.rejected
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.UNAUTHORIZED)
        })
    })

    it('should return a success response with a not found error when the instance does not exist', () => {
      return expect(processInstance.bulkRetry({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, [123456])).to.eventually.be.fulfilled
        .then(body => {
          expect(body.status).to.equal('200')
          expect(body.data).to.be.an('object')
          expect(body.data.failedOperations).to.be.an('array').and.to.have.length(1)
          expect(body.data.failedOperations).to.eql([{
            instanceId: '123456',
            errorNumber: 'CWTBG0025E',
            errorMessage: 'CWTBG0025E: Ocorreu uma falha inesperada ao executar a acção \'retry\'.  A falha reportada é: \'BPDInstance com o ID BPDInstance.123456 não foi localizado.\':'
          }])
        })
    })

    it('should return a success response with a failure error when the instance cannot be retried', () => {
      return expect(processInstance.bulkRetry({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, [32664])).to.eventually.be.fulfilled
        .then(body => {
          expect(body.status).to.equal('200')
          expect(body.data).to.be.an('object')
          expect(body.data.failedOperations).to.be.an('array').and.to.have.length(1)
          expect(body.data.failedOperations).to.eql([{
            instanceId: '32664',
            errorNumber: 'CWTBG0549E',
            errorMessage: 'CWTBG0549E: Não está autorizado a efectuar a acção \'retry\'.'
          }])
        })
    })

    it('should return a success response with the instance details when the instance was retried', () => {
      return expect(processInstance.bulkRetry({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, [23972])).to.eventually.be.fulfilled
        .then(body => {
          expect(body.status).to.equal('200')
          expect(body.data).to.be.an('object')
          expect(body.data.processDetails).to.be.an('array').and.to.have.length(1)
        })
    })

    it('should return a mixed response when some inputs were correct and some were not', () => {
      return expect(processInstance.bulkRetry({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, [123456, 32664, 23972])).to.eventually.be.fulfilled
        .then(body => {
          expect(body.status).to.equal('200')
          expect(body.data).to.be.an('object')
          expect(body.data.processDetails).to.be.an('array').and.to.have.length(1)
          expect(body.data.failedOperations).to.be.an('array').and.to.have.length(2)
          expect(body.data.failedOperations).to.eql([{
            instanceId: '123456',
            errorNumber: 'CWTBG0025E',
            errorMessage: 'CWTBG0025E: Ocorreu uma falha inesperada ao executar a acção \'retry\'.  A falha reportada é: \'BPDInstance com o ID BPDInstance.123456 não foi localizado.\':'
          }, {
            instanceId: '32664',
            errorNumber: 'CWTBG0549E',
            errorMessage: 'CWTBG0549E: Não está autorizado a efectuar a acção \'retry\'.'
          }])
        })
    })
  })

  describe('bulkDelete', () => {
    beforeEach(() => {
      nock('https://myDomain:9443')
        .put('/rest/bpm/wle/v1/process/bulk')
        .query(queryObj => queryObj.action === 'delete')
        .reply(function (url, body) {
          const auth = basicAuth.parse(this.req.headers.authorization)
          if (auth && auth.name === 'myUser' && auth.pass === 'myPassword') {
            const instanceIds = queryString.parse(this.req.path.split('?')[1]).instanceIds.split(',')
            const response = {
              status: '200',
              data: {
                failedOperation: null,
                processDetails: null,
                succeeded: null,
                failed: null
              }
            }
            for (let i = 0; i < instanceIds.length; i++) {
              const instanceId = instanceIds[i]
              if (instanceId === '23972') {
                response.data.processDetails = [require('./responses/bulkDelete_success.json')]
              } else if (instanceId === '32664') {
                if (!response.data.failedOperations) {
                  response.data.failedOperations = []
                }
                response.data.failedOperations.push(require('./responses/bulkDelete_failure.json'))
              } else {
                if (!response.data.failedOperations) {
                  response.data.failedOperations = []
                }
                const error = require('./responses/bulkDelete_notfound.json')
                error.instanceId = instanceId
                error.errorMessage = error.errorMessage.replace('@instanceId', instanceId)
                response.data.failedOperations.push(error)
              }
            }
            return [200, response]
          } else {
            return [401]
          }
        })
    })

    it('should return an Unauthorized error when wrong credentials are provided', () => {
      return expect(processInstance.bulkDelete({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myWrongUser',
        password: 'myWrongPassword'
      }, [123456])).to.eventually.be.rejected
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.UNAUTHORIZED)
        })
    })

    it('should return a success response with a not found error when the instance does not exist', () => {
      return expect(processInstance.bulkDelete({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, [123456])).to.eventually.be.fulfilled
        .then(body => {
          expect(body.status).to.equal('200')
          expect(body.data).to.be.an('object')
          expect(body.data.failedOperations).to.be.an('array').and.to.have.length(1)
          expect(body.data.failedOperations).to.eql([{
            instanceId: '123456',
            errorNumber: 'CWTBG0025E',
            errorMessage: 'CWTBG0025E: Ocorreu uma falha inesperada ao executar a acção \'delete\'.  A falha reportada é: \'BPDInstance com o ID BPDInstance.123456 não foi localizado.\':'
          }])
        })
    })

    it('should return a success response with a failure error when the instance cannot be deleted', () => {
      return expect(processInstance.bulkDelete({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, [32664])).to.eventually.be.fulfilled
        .then(body => {
          expect(body.status).to.equal('200')
          expect(body.data).to.be.an('object')
          expect(body.data.failedOperations).to.be.an('array').and.to.have.length(1)
          expect(body.data.failedOperations).to.eql([{
            instanceId: '32664',
            errorNumber: 'CWTBG0549E',
            errorMessage: 'CWTBG0549E: Não está autorizado a efectuar a acção \'delete\'.'
          }])
        })
    })

    it('should return a success response with the instance details when the instance was deleted', () => {
      return expect(processInstance.bulkDelete({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, [23972])).to.eventually.be.fulfilled
        .then(body => {
          expect(body.status).to.equal('200')
          expect(body.data).to.be.an('object')
          expect(body.data.processDetails).to.be.an('array').and.to.have.length(1)
        })
    })

    it('should return a mixed response when some inputs were correct and some were not', () => {
      return expect(processInstance.bulkDelete({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, [123456, 32664, 23972])).to.eventually.be.fulfilled
        .then(body => {
          expect(body.status).to.equal('200')
          expect(body.data).to.be.an('object')
          expect(body.data.processDetails).to.be.an('array').and.to.have.length(1)
          expect(body.data.failedOperations).to.be.an('array').and.to.have.length(2)
          expect(body.data.failedOperations).to.eql([{
            instanceId: '123456',
            errorNumber: 'CWTBG0025E',
            errorMessage: 'CWTBG0025E: Ocorreu uma falha inesperada ao executar a acção \'delete\'.  A falha reportada é: \'BPDInstance com o ID BPDInstance.123456 não foi localizado.\':'
          }, {
            instanceId: '32664',
            errorNumber: 'CWTBG0549E',
            errorMessage: 'CWTBG0549E: Não está autorizado a efectuar a acção \'delete\'.'
          }])
        })
    })
  })

  describe('fireTimer', () => {
    beforeEach(() => {
      nock('https://myDomain:9443')
        .post(/^\/rest\/bpm\/wle\/v1\/process/)
        .query(true)
        .reply(function (url, body) {
          const auth = basicAuth.parse(this.req.headers.authorization)
          if (auth && auth.name === 'myUser' && auth.pass === 'myPassword') {
            const instanceId = this.req.path.split('?')[0].split('/').slice(-1)[0]
            const timerTokenId = queryString.parse(this.req.path.split('?')[1]).timerTokenId

            if (instanceId === '42584') {
              if (timerTokenId === '2') {
                return [200, require('./responses/fireTimer/success.json')]
              } else {
                return [400, require('./responses/fireTimer/timerNotFound.json')]
              }
            } else if (instanceId === 'asd') {
              return [400, require('./responses/fireTimer/badRequest.json')]
            } else if (instanceId === '123456789123456789') {
              return [500, require('./responses/fireTimer/exception.json')]
            } else {
              const response = require('./responses/fireTimer/notFound.json')
              response.Data.programmersDetails = response.Data.programmersDetails.replace('@instanceId', instanceId)
              return [500, response]
            }
          } else {
            return [401]
          }
        })
    })

    it('should return an Unauthorized error when wrong credentials are provided', () => {
      return expect(processInstance.fireTimer({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myWrongUser',
        password: 'myWrongPassword'
      }, 123456, 1)).to.eventually.be.rejected
        .then(handleUnauthorized)
    })

    it('should return a not found error when the instance does not exist', () => {
      return expect(processInstance.fireTimer({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 123456, 1)).to.eventually.be.rejected
        .then(handleNotFound)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0019E',
            errorMessage: 'CWTBG0019E: BPDInstance with ID BPDInstance.123456 not found.'
          })
        })
    })

    it('should return a not found error when the timer token does not exist', () => {
      return expect(processInstance.fireTimer({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 42584, 1)).to.eventually.be.rejected
        .then(handleNotFound)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0551E',
            errorMessage: 'CWTBG0551E: The ID \'1\' is not valid. Please provide a valid ID.'
          })
        })
    })

    it('should return a bad request error when the instance id is not a number', () => {
      return expect(processInstance.fireTimer({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'asd', 1)).to.eventually.be.rejected
        .then(handleBadRequest)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0553E',
            errorMessage: 'CWTBG0553E: A \'BPDInstance\' instance id was expected, but instead of a number the id is \'asd\'.'
          })
        })
    })

    it('should return a server error when the instance id cannot be parsed', () => {
      return expect(processInstance.fireTimer({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, '123456789123456789', 1)).to.eventually.be.rejected
        .then(handleUnknown)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0019E',
            errorMessage: 'CWTBG0019E: Unexpected exception during execution. Exception information: \'Unexpected database exception\'.'
          })
        })
    })

    it('should return a success response with the instance details when the timer was fired', () => {
      return expect(processInstance.fireTimer({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 42584, 2)).to.eventually.be.fulfilled
        .then(handleSuccess)
        .then(response => {
          expect(response.data).to.be.an('object')
          expect(response.data.piid).to.equal('42584')
        })
    })
  })

  describe('deleteToken', () => {
    beforeEach(() => {
      nock('https://myDomain:9443')
        .post(/^\/rest\/bpm\/wle\/v1\/process/)
        .query(true)
        .reply(function (url, body) {
          const auth = basicAuth.parse(this.req.headers.authorization)
          if (auth && auth.name === 'myUser' && auth.pass === 'myPassword') {
            const instanceId = this.req.path.split('?')[0].split('/').slice(-1)[0]
            const tokenId = queryString.parse(this.req.path.split('?')[1]).tokenId

            if (instanceId === '42584') {
              if (tokenId === '2') {
                return [200, require('./responses/deleteToken/success.json')]
              } else if (tokenId === '9') {
                return [500, require('./responses/deleteToken/invalidToken.json')]
              } else {
                const response = require('./responses/deleteToken/tokenNotFound.json')
                response.Data.errorMessage = response.Data.errorMessage.replace('@tokenId', tokenId)
                response.Data.errorMessageParameters[0] = response.Data.errorMessageParameters[0].replace('@tokenId', tokenId)
                return [404, response]
              }
            } else if (instanceId === 'asd') {
              return [400, require('./responses/deleteToken/badRequest')]
            } else if (instanceId === '123456789123456789') {
              return [500, require('./responses/deleteToken/exception')]
            } else {
              const response = require('./responses/deleteToken/notFound.json')
              response.Data.errorMessage = response.Data.errorMessage.replace('@instanceId', instanceId)
              response.Data.errorMessageParameters[0] = response.Data.errorMessageParameters[0].replace('@instanceId', instanceId)
              return [404, response]
            }
          } else {
            return [401]
          }
        })
    })

    it('should return an Unauthorized error when wrong credentials are provided', () => {
      return expect(processInstance.deleteToken({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myWrongUser',
        password: 'myWrongPassword'
      }, 123456, 1)).to.eventually.be.rejected
        .then(handleUnauthorized)
    })

    it('should return a not found error when the instance does not exist', () => {
      return expect(processInstance.deleteToken({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 123456, 1)).to.eventually.be.rejected
        .then(handleNotFound)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0059E',
            errorMessage: 'CWTBG0059E: The instance with the ID \'123456\' could not be found.'
          })
        })
    })

    it('should return a not found error when the instance exists but the token does not', () => {
      return expect(processInstance.deleteToken({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 42584, 1)).to.eventually.be.rejected
        .then(handleNotFound)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0013E',
            errorMessage: 'CWTBG0013E: The object \'1\' does not exist; it might have been deleted in the meantime.'
          })
        })
    })

    it('should return a bad request error when the instance id is not a number', () => {
      return expect(processInstance.deleteToken({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'asd', 1)).to.eventually.be.rejected
        .then(handleBadRequest)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0553E',
            errorMessage: 'CWTBG0553E: A \'BPDInstance\' instance id was expected, but instead of a number the id is \'asd\'.'
          })
        })
    })

    it('should return a forbidden error when the token cannot be deleted', () => {
      return expect(processInstance.deleteToken({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 42584, 9)).to.eventually.be.rejected
        .then(handleForbidden)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0019E',
            errorMessage: 'CWTBG0019E: Unexpected exception during execution. Exception information: \'Cannot perform flowObjectInstanceCompleted() for token: BPDToken(bpdInstanceId=BpmnInstanceId(42691), tokenId=9, locationId = BPDObjectIdImpl(bpdid:e2e9e50b31ab034a:60602bd9:15da211bd67:-7ff9)). No such token is registred\'.'
          })
        })
    })

    it('should return a server error when the instance id cannot be parsed', () => {
      return expect(processInstance.deleteToken({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, '123456789123456789', 1)).to.eventually.be.rejected
        .then(handleUnknown)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0019E',
            errorMessage: 'CWTBG0019E: Unexpected exception during execution. Exception information: \'Unexpected database exception\'.'
          })
        })
    })

    it('should return a success response with the instance details when the token is deleted', () => {
      return expect(processInstance.deleteToken({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 42584, 2)).to.eventually.be.fulfilled
        .then(handleSuccess)
        .then(body => {
          expect(body.data).to.be.an('object')
          expect(body.data.piid).to.equal('42584')
        })
    })
  })

  describe('moveToken', () => {
    beforeEach(() => {
      nock('https://myDomain:9443')
        .post(/^\/rest\/bpm\/wle\/v1\/process/)
        .query(true)
        .reply(function (url, body) {
          const auth = basicAuth.parse(this.req.headers.authorization)
          if (auth && auth.name === 'myUser' && auth.pass === 'myPassword') {
            const instanceId = this.req.path.split('?')[0].split('/').slice(-1)[0]
            const tokenId = queryString.parse(this.req.path.split('?')[1]).tokenId
            const target = queryString.parse(this.req.path.split('?')[1]).target

            if (instanceId === '42588') {
              if (tokenId === '2') {
                if (target === 'bpdid:fb34069ef86e808b:7a800ddb:16e361ee416:-7fd6') {
                  return [200, require('./responses/moveToken/success.json')]
                } else {
                  return [500, require('./responses/moveToken/targetNotFound.json')]
                }
              } else if (tokenId === '9') {
                return [500, require('./responses/moveToken/invalidToken.json')]
              } else {
                const response = require('./responses/moveToken/tokenNotFound.json')
                response.Data.errorMessage = response.Data.errorMessage.replace('@tokenId', tokenId)
                response.Data.errorMessageParameters[0] = response.Data.errorMessageParameters[0].replace('@tokenId', tokenId)
                return [404, response]
              }
            } else if (instanceId === 'asd') {
              return [400, require('./responses/moveToken/badRequest.json')]
            } else if (instanceId === '123456789123456789') {
              return [500, require('./responses/moveToken/exception.json')]
            } else {
              const response = require('./responses/moveToken/notFound.json')
              response.Data.errorMessage = response.Data.errorMessage.replace('@instanceId', instanceId)
              response.Data.errorMessageParameters[0] = response.Data.errorMessageParameters[0].replace('@instanceId', instanceId)
              return [404, response]
            }
          } else {
            return [401]
          }
        })
    })

    it('should return an Unauthorized error when wrong credentials are provided', () => {
      return expect(processInstance.moveToken({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myWrongUser',
        password: 'myWrongPassword'
      }, 123456, 1, 'x')).to.eventually.be.rejected
        .then(handleUnauthorized)
    })

    it('should return a not found error when the instance does not exist', () => {
      return expect(processInstance.moveToken({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 123456, 1, 'x')).to.eventually.be.rejected
        .then(handleNotFound)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0059E',
            errorMessage: 'CWTBG0059E: The instance with the ID \'123456\' could not be found.'
          })
        })
    })

    it('should return a not found error when the instance exists but the token does not', () => {
      return expect(processInstance.moveToken({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 42588, 1)).to.eventually.be.rejected
        .then(handleNotFound)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0013E',
            errorMessage: 'CWTBG0013E: The object \'1\' does not exist; it might have been deleted in the meantime.'
          })
        })
    })

    it('should return a not found error when the instance and token exist, but the target step does not', () => {
      return expect(processInstance.moveToken({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 42588, 2, 'x')).to.eventually.be.rejected
        .then(handleNotFound)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0019E',
            errorMessage: 'CWTBG0019E: Unexpected exception during execution. Exception information: \'targetFlowObjectId is invalid\'.'
          })
        })
    })

    it('should return a bad request error when the instance id is not a number', () => {
      return expect(processInstance.moveToken({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'asd', 1, 'x')).to.eventually.be.rejected
        .then(handleBadRequest)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0553E',
            errorMessage: 'CWTBG0553E: A \'BPDInstance\' instance id was expected, but instead of a number the id is \'asd\'.'
          })
        })
    })

    it('should return a forbidden error when the token cannot be deleted', () => {
      return expect(processInstance.moveToken({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 42588, 9, 'x')).to.eventually.be.rejected
        .then(handleForbidden)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0019E',
            errorMessage: 'CWTBG0019E: Unexpected exception during execution. Exception information: \'Cannot perform flowObjectInstanceCompleted() for token: BPDToken(bpdInstanceId=BpmnInstanceId(42691), tokenId=9, locationId = BPDObjectIdImpl(bpdid:e2e9e50b31ab034a:60602bd9:15da211bd67:-7ff9)). No such token is registred\'.'
          })
        })
    })

    it('should return a server error when the instance id cannot be parsed', () => {
      return expect(processInstance.moveToken({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, '123456789123456789', 1, 'x')).to.eventually.be.rejected
        .then(handleUnknown)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0019E',
            errorMessage: 'CWTBG0019E: Unexpected exception during execution. Exception information: \'Unexpected database exception\'.'
          })
        })
    })

    it('should return a success response with the instance details when the token is moved', () => {
      return expect(processInstance.moveToken({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 42588, 2, 'bpdid:fb34069ef86e808b:7a800ddb:16e361ee416:-7fd6')).to.eventually.be.fulfilled
        .then(handleSuccess)
        .then(body => {
          expect(body.data).to.be.an('object')
          expect(body.data.piid).to.equal('42588')
        })
    })
  })

  describe('getRuntimeErrors', () => {
    beforeEach(() => {
      nock('https://myDomain:9443')
        .put('/rest/bpm/wle/v1/process/errors')
        .query(true)
        .reply(function (url, body) {
          const auth = basicAuth.parse(this.req.headers.authorization)
          if (auth && auth.name === 'myUser' && auth.pass === 'myPassword') {
            const instanceIds = queryString.parse(this.req.path.split('?')[1]).instanceIds.split(',')
            const response = {
              data: {
                failedOperations: null,
                runtimeErrors: null
              }
            }
            for (let i = 0; i < instanceIds.length; i++) {
              const instanceId = instanceIds[i]
              if (instanceId === '42019') {
                if (!response.data.runtimeErrors) {
                  response.data.runtimeErrors = []
                }
                response.data.runtimeErrors.push(require('./responses/getRuntimeErrors/error.json'))
              } else if (instanceId === '42588') {
                if (!response.data.failedOperations) {
                  response.data.failedOperations = []
                }
                response.data.failedOperations.push(require('./responses/getRuntimeErrors/noError.json'))
              } else if (instanceId === 'asd') {
                if (!response.data.failedOperations) {
                  response.data.failedOperations = []
                }
                response.data.failedOperations.push(require('./responses/getRuntimeErrors/badRequest.json'))
              } else if (instanceId === '123456789123456789') {
                if (!response.data.failedOperations) {
                  response.data.failedOperations = []
                }
                response.data.failedOperations.push(require('./responses/getRuntimeErrors/exception.json'))
              } else {
                if (!response.data.failedOperations) {
                  response.data.failedOperations = []
                }
                const error = require('./responses/getRuntimeErrors/notFound.json')
                error.instanceId = instanceId
                error.errorMessage = error.errorMessage.replace('@instanceId', instanceId)
                response.data.failedOperations.push(error)
              }
            }
            return [200, response]
          } else {
            return [401]
          }
        })
    })

    it('should return an Unauthorized error when wrong credentials are provided', () => {
      return expect(processInstance.getRuntimeErrors({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myWrongUser',
        password: 'myWrongPassword'
      }, [123456])).to.eventually.be.rejected
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.UNAUTHORIZED)
        })
    })

    it('should return a success response with an error when the instance does not exist', () => {
      return expect(processInstance.getRuntimeErrors({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, [123456])).to.eventually.be.fulfilled
        .then(handleSuccess)
        .then(response => {
          expect(response.data).to.be.an('object')
          expect(response.data.runtimeErrors).to.eql([])
          expect(response.data.failedOperations).to.eql([{
            instanceId: '123456',
            errorMessage: 'BPDInstance with ID BPDInstance.123456 not found.'
          }])
        })
    })

    it('should return a success response with an error when the instance id is not a number', () => {
      return expect(processInstance.getRuntimeErrors({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, ['asd'])).to.eventually.be.fulfilled
        .then(handleSuccess)
        .then(response => {
          expect(response.data).to.be.an('object')
          expect(response.data.runtimeErrors).to.eql([])
          expect(response.data.failedOperations).to.eql([{
            instanceId: 'asd',
            errorMessage: 'com.ibm.bpm.wle.api.UnexpectedInstanceIDException: CWTBG0553E: Era esperado um ID de ocorrência \'BPDInstance\', mas em vez de um número o ID é \'asd\'.'
          }])
        })
    })

    it('should return a success response with an error when the instance id cannot be parsed', () => {
      return expect(processInstance.getRuntimeErrors({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, ['123456789123456789'])).to.eventually.be.fulfilled
        .then(handleSuccess)
        .then(response => {
          expect(response.data).to.be.an('object')
          expect(response.data.runtimeErrors).to.eql([])
          expect(response.data.failedOperations).to.eql([{
            instanceId: '123456789123456789',
            errorMessage: 'PreparedStatementCallback; SQL [select BPD_INSTANCE_ID,INSTANCE_NAME,CACHED_BPD_VERSION_ID,CREATE_DATETIME,DUE_DATE,LAST_MODIFIED_DATETIME,SAVE_SEQ,EXECUTION_STATUS,ERROR,ERROR_STACK_TRACE,SHAREPOINT_SITE_URL,AT_RISK_DATE,ATTACHMENT_STORE,CLOSE_DATETIME,CASE_FOLDER_ID,CASE_FOLDER_SERVER_NAME,SECURITY_FOLDER_ID,STARTING_DOCUMENT_ID,STARTING_DOCUMENT_SERVER_NAME,DOCUMENTS_STATE,BPD_NAME,SNAPSHOT_ID,GROUP_ID,OWNER_GROUP_ID,STARTER_ID,PROJECT_ID,BPD_REF,TIP,SBO_SYNC_ENABLED from LSW_BPD_INSTANCE where BPD_INSTANCE_ID = ?]; [jcc][t4][1037][11190][4.21.29] Ocorreu uma excepção durante a conversão de BigDecimal.  Consulte Throwable anexado para mais detalhes. ERRORCODE=-4220, SQLSTATE=22003; nested exception is com.ibm.db2.jcc.am.SqlDataException: [jcc][t4][1037][11190][4.21.29] Ocorreu uma excepção durante a conversão de BigDecimal.  Consulte Throwable anexado para mais detalhes. ERRORCODE=-4220, SQLSTATE=22003'
          }])
        })
    })

    it('should return a success response with a failure error when the instance does not have runtime errors', () => {
      return expect(processInstance.getRuntimeErrors({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, [42588])).to.eventually.be.fulfilled
        .then(handleSuccess)
        .then(response => {
          expect(response.data).to.be.an('object')
          expect(response.data.failedOperations).to.eql([])
          expect(response.data.runtimeErrors).to.eql([{
            instanceId: '42588',
            error: null
          }])
        })
    })

    it('should return a success response with the error details when the instance has errors', () => {
      return expect(processInstance.getRuntimeErrors({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, [42019])).to.eventually.be.fulfilled
        .then(handleSuccess)
        .then(response => {
          expect(response.data).to.be.an('object')
          expect(response.data.failedOperations).to.eql([])
          expect(response.data.runtimeErrors).to.be.an('array').and.to.have.length(1)
          expect(response.data.runtimeErrors).to.containSubset([{
            instanceId: '42019',
            error: {
              instanceId: 'BPDInstance.42019',
              errorMessage: 'Connection reset'
            }
          }])
        })
    })

    it('should return a mixed response when some inputs were correct and some were not', () => {
      return expect(processInstance.getRuntimeErrors({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, [123456, 'asd', '123456789123456789', 42588, 42019])).to.eventually.be.fulfilled
        .then(handleSuccess)
        .then(response => {
          expect(response.data).to.be.an('object')
          expect(response.data.failedOperations).to.eql([{
            instanceId: '123456',
            errorMessage: 'BPDInstance with ID BPDInstance.123456 not found.'
          }, {
            instanceId: 'asd',
            errorMessage: 'com.ibm.bpm.wle.api.UnexpectedInstanceIDException: CWTBG0553E: Era esperado um ID de ocorrência \'BPDInstance\', mas em vez de um número o ID é \'asd\'.'
          }, {
            instanceId: '123456789123456789',
            errorMessage: 'PreparedStatementCallback; SQL [select BPD_INSTANCE_ID,INSTANCE_NAME,CACHED_BPD_VERSION_ID,CREATE_DATETIME,DUE_DATE,LAST_MODIFIED_DATETIME,SAVE_SEQ,EXECUTION_STATUS,ERROR,ERROR_STACK_TRACE,SHAREPOINT_SITE_URL,AT_RISK_DATE,ATTACHMENT_STORE,CLOSE_DATETIME,CASE_FOLDER_ID,CASE_FOLDER_SERVER_NAME,SECURITY_FOLDER_ID,STARTING_DOCUMENT_ID,STARTING_DOCUMENT_SERVER_NAME,DOCUMENTS_STATE,BPD_NAME,SNAPSHOT_ID,GROUP_ID,OWNER_GROUP_ID,STARTER_ID,PROJECT_ID,BPD_REF,TIP,SBO_SYNC_ENABLED from LSW_BPD_INSTANCE where BPD_INSTANCE_ID = ?]; [jcc][t4][1037][11190][4.21.29] Ocorreu uma excepção durante a conversão de BigDecimal.  Consulte Throwable anexado para mais detalhes. ERRORCODE=-4220, SQLSTATE=22003; nested exception is com.ibm.db2.jcc.am.SqlDataException: [jcc][t4][1037][11190][4.21.29] Ocorreu uma excepção durante a conversão de BigDecimal.  Consulte Throwable anexado para mais detalhes. ERRORCODE=-4220, SQLSTATE=22003'
          }])
          expect(response.data.runtimeErrors).to.be.an('array').and.to.have.length(2)
          expect(response.data.runtimeErrors).to.containSubset([{
            instanceId: '42588',
            error: null
          }, {
            instanceId: '42019',
            error: {
              instanceId: 'BPDInstance.42019',
              errorMessage: 'Connection reset'
            }
          }])
        })
    })
  })

  describe('sendMessage', () => {
    beforeEach(() => {
      nock('https://myDomain:9443')
        .post('/rest/bpm/wle/v1/process')
        .query(true)
        .reply(function (url, body, cb) {
          const auth = basicAuth.parse(this.req.headers.authorization)
          if (auth && auth.name === 'myUser' && auth.pass === 'myPassword') {
            const messageStr = queryString.parse(this.req.path.split('?')[1]).message
            xml2js.parseStringPromise(messageStr).then(message => {
              const processApp = message.eventmsg.event[0].$.processApp
              const ucaName = message.eventmsg.event[0].$.ucaName
              const eventName = message.eventmsg.event[0]._
              if (processApp) {
                if (ucaName || eventName) {
                  cb(null, [200, require('./responses/sendMessage/success.json')])
                } else {
                  cb(null, [500, require('./responses/sendMessage/noEvent.json')])
                }
              } else {
                cb(null, [500, require('./responses/sendMessage/noProcessApp.json')])
              }
            }).catch(err => {
              cb(null, [400, err])
            })
          } else {
            cb(null, [401])
          }
        })
    })

    it('should return an Unauthorized error when wrong credentials are provided', () => {
      return expect(processInstance.sendMessage({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myWrongUser',
        password: 'myWrongPassword'
      }, {
        processApp: 'TFLSAND',
        eventName: '2c5f63e6-6627-427a-81cb-e8eb1496330c'
      })).to.eventually.be.rejected
        .then(handleUnauthorized)
    })

    it('should return a bad request error response if no process application is provided', () => {
      return expect(processInstance.sendMessage({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, {
        eventName: '2c5f63e6-6627-427a-81cb-e8eb1496330c',
        snapshot: 'SNAP1',
        queue: 'Async Queue'
      }, [])).to.eventually.be.rejected
        .then(handleBadRequest)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0025E',
            errorMessage: 'CWTBG0025E: Unexpected failure occurred while performing the \'sendMessage\' action.  The reported failure is: \'Malformed Event Manager message: expected processAppShortName\':'
          })
        })
    })

    it('should return a bad request error response if no uca name and no event name are provided', () => {
      return expect(processInstance.sendMessage({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, {
        processApp: 'TFLSAND',
        snapshot: 'SNAP1',
        queue: 'Async Queue'
      }, [])).to.eventually.be.rejected
        .then(handleBadRequest)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0025E',
            errorMessage: 'CWTBG0025E: Unexpected failure occurred while performing the \'sendMessage\' action.  The reported failure is: \'Malformed Event Manager message; neither ucaname attribute nor event name are specified.\':'
          })
        })
    })

    it('should return a success response if all inputs are provided', () => {
      return expect(processInstance.sendMessage({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, {
        processApp: 'TFLSAND',
        snapshot: 'SNAP1',
        eventName: '2c5f63e6-6627-427a-81cb-e8eb1496330c',
        ucaName: 'UCA1',
        queue: 'Async Queue'
      }, [{
        key: 'param1',
        value: 'value1'
      }])).to.eventually.be.fulfilled
        .then(handleSuccess)
        .then(response => {
          expect(response.data).to.eql({
            messageSent: true
          })
        })
    })
  })
})
