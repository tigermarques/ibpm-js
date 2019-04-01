const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const nock = require('nock')
const basicAuth = require('basic-auth')
const groups = require('../../../lib/api/groups')
const { HTTP_MESSAGES } = require('./../../../lib/api/common')

const expect = chai.expect
chai.use(chaiAsPromised)

describe('Groups', () => {
  describe('getByFilter', () => {
    beforeEach(() => {
      nock('https://myDomain:9443')
        .get('/rest/bpm/wle/v1/groups')
        .query(true)
        .reply(function (url, body) {
          const auth = basicAuth.parse(this.req.headers.authorization)
          if (auth && auth.name === 'myUser' && auth.pass === 'myPassword') {
            return [200, require('./responses/getByFilter.json')]
          } else {
            return [401]
          }
        })
    })

    it('should return an Unauthorized error when wrong credentials are provided', () => {
      return expect(groups.getByFilter({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myWrongUser',
        password: 'myWrongPassword'
      }, 'testFilter*')).to.eventually.be.rejected
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.UNAUTHORIZED)
        })
    })

    it('should return status 200 when the correct input is provided', () => {
      return groups.getByFilter({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'testFilter*').then((body) => {
        expect(body.status).to.equal('200')
      })
    })
  })

  describe('getByNameOrId', () => {
    beforeEach(() => {
      nock('https://myDomain:9443')
        .get(/^\/rest\/bpm\/wle\/v1\/group/)
        .query(true)
        .reply(function (url, body) {
          const auth = basicAuth.parse(this.req.headers.authorization)
          if (auth && auth.name === 'myUser' && auth.pass === 'myPassword') {
            const groupName = this.req.path.split('?')[0].split('/').slice(-1)[0]
            if (groupName === 'myGroup') {
              return [200, require('./responses/getByNameOrId.json')]
            } else {
              return [404]
            }
          } else {
            return [401]
          }
        })
    })

    it('should return an Unauthorized error when wrong credentials are provided', () => {
      return expect(groups.getByNameOrId({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myWrongUser',
        password: 'myWrongPassword'
      }, 'myGroup')).to.eventually.be.rejected
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.UNAUTHORIZED)
        })
    })

    it('should return a Not found error when the group does not exist', () => {
      return expect(groups.getByNameOrId({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myOtherGroup')).to.eventually.be.rejected
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.NOT_FOUND)
        })
    })

    it('should return group details when the correct input is provided', () => {
      return groups.getByNameOrId({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myGroup').then((body) => {
        expect(body.status).to.equal('200')
        expect(body.data).to.be.an('object')
        expect(body.data.groupName).to.equal('myGroup')
      })
    })
  })
})