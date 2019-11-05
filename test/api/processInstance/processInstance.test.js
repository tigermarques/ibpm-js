const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const nock = require('nock')
const xml2js = require('xml2js')
const basicAuth = require('basic-auth')
const queryString = require('querystring')
const processInstance = require('../../../lib/api/processInstance')
const { HTTP_MESSAGES } = require('./../../../lib/api/common')

const expect = chai.expect
chai.use(chaiAsPromised)

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
              const response = require('./responses/getById.json')
              return [200, response]
            } else {
              return [404]
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
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.UNAUTHORIZED)
        })
    })

    it('should return a not found error when the instance does not exist', () => {
      return expect(processInstance.getById({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 123456)).to.eventually.be.rejected
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.NOT_FOUND)
        })
    })

    it('should return instance details when the correct input is provided', () => {
      return processInstance.getById({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 23972).then((body) => {
        expect(body.status).to.equal('200')
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
            if (instanceId === '23972') {
              const response = require('./responses/suspend.json')
              return [200, response]
            } else {
              return [404]
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
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.UNAUTHORIZED)
        })
    })

    it('should return a not found error when the instance does not exist', () => {
      return expect(processInstance.suspend({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 123456)).to.eventually.be.rejected
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.NOT_FOUND)
        })
    })

    it('should return instance details when the correct input is provided', () => {
      return processInstance.suspend({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 23972).then((body) => {
        expect(body.status).to.equal('200')
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
            if (instanceId === '23972') {
              const response = require('./responses/resume.json')
              return [200, response]
            } else {
              return [404]
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
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.UNAUTHORIZED)
        })
    })

    it('should return a not found error when the instance does not exist', () => {
      return expect(processInstance.resume({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 123456)).to.eventually.be.rejected
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.NOT_FOUND)
        })
    })

    it('should return instance details when the correct input is provided', () => {
      return processInstance.resume({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 23972).then((body) => {
        expect(body.status).to.equal('200')
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
            if (instanceId === '23972') {
              const response = require('./responses/terminate.json')
              return [200, response]
            } else {
              return [404]
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
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.UNAUTHORIZED)
        })
    })

    it('should return a not found error when the instance does not exist', () => {
      return expect(processInstance.terminate({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 123456)).to.eventually.be.rejected
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.NOT_FOUND)
        })
    })

    it('should return instance details when the correct input is provided', () => {
      return processInstance.terminate({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 23972).then((body) => {
        expect(body.status).to.equal('200')
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
            if (instanceId === '23972') {
              const response = require('./responses/retry.json')
              return [200, response]
            } else {
              return [404]
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
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.UNAUTHORIZED)
        })
    })

    it('should return a not found error when the instance does not exist', () => {
      return expect(processInstance.retry({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 123456)).to.eventually.be.rejected
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.NOT_FOUND)
        })
    })

    it('should return instance details when the correct input is provided', () => {
      return processInstance.retry({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 23972).then((body) => {
        expect(body.status).to.equal('200')
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
            if (instanceId === '23972') {
              const response = require('./responses/delete.json')
              return [200, response]
            } else {
              return [404]
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
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.UNAUTHORIZED)
        })
    })

    it('should return a not found error when the instance does not exist', () => {
      return expect(processInstance.delete({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 123456)).to.eventually.be.rejected
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.NOT_FOUND)
        })
    })

    it('should return instance details when the correct input is provided', () => {
      return processInstance.delete({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 23972).then((body) => {
        expect(body.status).to.equal('200')
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
                return [200, require('./responses/fireTimer_success.json')]
              } else {
                return [400, require('./responses/fireTimer_timernotfound.json')]
              }
            } else {
              return [500, require('./responses/fireTimer_instancenotfound.json')]
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
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.UNAUTHORIZED)
        })
    })

    it('should return a 500 error when the instance does not exist', () => {
      return expect(processInstance.fireTimer({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 123456, 1)).to.eventually.be.rejected
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.SERVER_ERROR)
        })
    })

    it('should return a 400 error when the instance exists but the timer token does not', () => {
      return expect(processInstance.fireTimer({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 42584, 1)).to.eventually.be.rejected
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.BAD_REQUEST)
        })
    })

    it('should return a success response with the instance details when the timer was fired', () => {
      return expect(processInstance.fireTimer({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 42584, 2)).to.eventually.be.fulfilled
        .then(body => {
          expect(body.status).to.equal('200')
          expect(body.data).to.be.an('object')
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
                return [200, require('./responses/deleteToken_success.json')]
              } else {
                return [404, require('./responses/deleteToken_tokennotfound.json')]
              }
            } else {
              return [404, require('./responses/deleteToken_instancenotfound.json')]
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
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.UNAUTHORIZED)
        })
    })

    it('should return a 404 error when the instance does not exist', () => {
      return expect(processInstance.deleteToken({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 123456, 1)).to.eventually.be.rejected
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.NOT_FOUND)
        })
    })

    it('should return a 404 error when the instance exists but the timer token does not', () => {
      return expect(processInstance.deleteToken({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 42584, 1)).to.eventually.be.rejected
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.NOT_FOUND)
        })
    })

    it('should return a success response with the instance details when the token is deleted', () => {
      return expect(processInstance.deleteToken({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 42584, 2)).to.eventually.be.fulfilled
        .then(body => {
          expect(body.status).to.equal('200')
          expect(body.data).to.be.an('object')
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
                  return [200, require('./responses/moveToken_success.json')]
                } else {
                  return [500, require('./responses/moveToken_targetnotfound.json')]
                }
              } else {
                return [404, require('./responses/moveToken_tokennotfound.json')]
              }
            } else {
              return [404, require('./responses/moveToken_instancenotfound.json')]
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
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.UNAUTHORIZED)
        })
    })

    it('should return a 404 error when the instance does not exist', () => {
      return expect(processInstance.moveToken({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 123456, 1, 'x')).to.eventually.be.rejected
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.NOT_FOUND)
        })
    })

    it('should return a 404 error when the instance exists but the timer token does not', () => {
      return expect(processInstance.moveToken({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 42588, 1, 'x')).to.eventually.be.rejected
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.NOT_FOUND)
        })
    })

    it('should return a 500 error when the instance and token exist but the target does not', () => {
      return expect(processInstance.moveToken({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 42588, 2, 'x')).to.eventually.be.rejected
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.SERVER_ERROR)
        })
    })

    it('should return a success response with the instance details when the token is moved', () => {
      return expect(processInstance.moveToken({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 42588, 2, 'bpdid:fb34069ef86e808b:7a800ddb:16e361ee416:-7fd6')).to.eventually.be.fulfilled
        .then(body => {
          expect(body.status).to.equal('200')
          expect(body.data).to.be.an('object')
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
              status: '200',
              data: {
                failedOperation: null,
                runtimeErrors: null
              }
            }
            for (let i = 0; i < instanceIds.length; i++) {
              const instanceId = instanceIds[i]
              if (instanceId === '42019') {
                if (!response.data.runtimeErrors) {
                  response.data.runtimeErrors = []
                }
                response.data.runtimeErrors.push(require('./responses/getRuntimeErrors_error.json'))
              } else if (instanceId === '42588') {
                if (!response.data.failedOperations) {
                  response.data.failedOperations = []
                }
                response.data.failedOperations.push(require('./responses/getRuntimeErrors_noerror.json'))
              } else {
                if (!response.data.failedOperations) {
                  response.data.failedOperations = []
                }
                const error = require('./responses/getRuntimeErrors_instancenotfound.json')
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

    it('should return a success response with a not found error when the instance does not exist', () => {
      return expect(processInstance.getRuntimeErrors({
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
            errorMessage: 'BPDInstance with ID BPDInstance.123456 not found.'
          }])
        })
    })

    it('should return a success response with a failure error when the instance does not have runtime errors', () => {
      return expect(processInstance.getRuntimeErrors({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, [42588])).to.eventually.be.fulfilled
        .then(body => {
          expect(body.status).to.equal('200')
          expect(body.data).to.be.an('object')
          expect(body.data.failedOperations).to.be.an('array').and.to.have.length(1)
          expect(body.data.failedOperations).to.eql([{
            instanceId: '42588'
          }])
        })
    })

    it('should return a success response with the error details when the instance has errors', () => {
      return expect(processInstance.getRuntimeErrors({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, [42019])).to.eventually.be.fulfilled
        .then(body => {
          expect(body.status).to.equal('200')
          expect(body.data).to.be.an('object')
          expect(body.data.runtimeErrors).to.be.an('array').and.to.have.length(1)
        })
    })

    it('should return a mixed response when some inputs were correct and some were not', () => {
      return expect(processInstance.getRuntimeErrors({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, [123456, 42588, 42019])).to.eventually.be.fulfilled
        .then(body => {
          expect(body.status).to.equal('200')
          expect(body.data).to.be.an('object')
          expect(body.data.runtimeErrors).to.be.an('array').and.to.have.length(1)
          expect(body.data.failedOperations).to.be.an('array').and.to.have.length(2)
          expect(body.data.failedOperations).to.eql([{
            instanceId: '123456',
            errorMessage: 'BPDInstance with ID BPDInstance.123456 not found.'
          }, {
            instanceId: '42588'
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
                  cb(null, [200, require('./responses/sendMessage_success.json')])
                } else {
                  cb(null, [500, require('./responses/sendMessage_noevent.json')])
                }
              } else {
                cb(null, [500, require('./responses/sendMessage_noprocessapp.json')])
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
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.UNAUTHORIZED)
        })
    })

    it('should return an error response if no process application is provided', () => {
      return expect(processInstance.sendMessage({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, {
        eventName: '2c5f63e6-6627-427a-81cb-e8eb1496330c',
        snapshot: 'SNAP1',
        queue: 'Async Queue'
      }, [])).to.eventually.be.rejected
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.SERVER_ERROR)
        })
    })

    it('should return an error response if no uca name and no event name are provided', () => {
      return expect(processInstance.sendMessage({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, {
        processApp: 'TFLSAND',
        snapshot: 'SNAP1',
        queue: 'Async Queue'
      }, [])).to.eventually.be.rejected
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.SERVER_ERROR)
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
        .then(body => {
          expect(body.status).to.equal('200')
          expect(body.data).to.eql({
            messageSent: true
          })
        })
    })
  })
})
