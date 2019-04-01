const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const nock = require('nock')
const basicAuth = require('basic-auth')
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
})
