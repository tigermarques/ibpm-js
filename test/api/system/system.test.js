const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const nock = require('nock')
const basicAuth = require('basic-auth')
const system = require('../../../lib/api/system')
const { handleUnauthorized, handleSuccess } = require('../../test-utils')

const expect = chai.expect
chai.use(chaiAsPromised)

describe('System', () => {
  describe('getDetails', () => {
    beforeEach(() => {
      nock('https://myDomain:9443')
        .get('/rest/bpm/wle/v1/systems')
        .reply(function (url, body) {
          const auth = basicAuth.parse(this.req.headers.authorization)
          if (auth && auth.name === 'myUser' && auth.pass === 'myPassword') {
            return [200, require('./responses/getDetails/success.json')]
          } else {
            return [401]
          }
        })
    })

    it('should return an Unauthorized error when wrong credentials are provided', () => {
      return expect(system.getDetails({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myWrongUser',
        password: 'myWrongPassword'
      })).to.eventually.be.rejected
        .then(handleUnauthorized)
    })

    it('should return system details when the correct input is provided', () => {
      return expect(system.getDetails({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      })).to.eventually.be.fulfilled
        .then(handleSuccess)
        .then((response) => {
          expect(response.data).to.be.an('array')
          expect(response.data).to.eql([{
            systemID: '81653271-2986-4821-a352-dfede989c415',
            systemType: 'SYSTEM_TYPE_WLE',
            version: '8.6.0.201803',
            buildLevel: 'BPM8600-20180316-105427',
            apiVersion: '1.0',
            hostname: 'myHostname.domain.com'
          }])
        })
    })
  })
})
