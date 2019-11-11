const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const nock = require('nock')
const basicAuth = require('basic-auth')
const queryString = require('querystring')
const groups = require('../../../lib/api/groups')
const { handleUnauthorized, handleNotFound, handleSuccess } = require('../../test-utils')

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
            const filter = queryString.parse(this.req.path.split('?')[1]).filter
            if (filter === 'myG*') {
              return [200, require('./responses/getByFilter/results.json')]
            } else {
              return [200, require('./responses/getByFilter/empty.json')]
            }
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
        .then(handleUnauthorized)
    })

    it('should return no groups when a search filter that matches no groups is provided', () => {
      return expect(groups.getByFilter({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'testFilter*')).to.eventually.be.fulfilled
        .then(handleSuccess)
        .then((response) => {
          expect(response.data).to.eql({
            groups: []
          })
        })
    })

    it('should return groups when a search filter that matches groups is provided', () => {
      return expect(groups.getByFilter({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myG*')).to.eventually.be.fulfilled
        .then(handleSuccess)
        .then((response) => {
          expect(response.data).to.eql({
            groups: [{
              groupID: 3,
              groupName: 'myGroup',
              displayName: 'myGroup',
              description: 'Group for people',
              members: [
                'myUser',
                'myOtherUser'
              ],
              managerGroupName: null
            }]
          })
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
              return [200, require('./responses/getByNameOrId/success.json')]
            } else {
              const response = require('./responses/getByNameOrId/notFound.json')
              response.Data.errorMessage = response.Data.errorMessage.replace('@groupName', groupName)
              response.Data.errorMessageParameters[0] = response.Data.errorMessageParameters[0].replace('@groupName', groupName)
              return [404, response]
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
        .then(handleUnauthorized)
    })

    it('should return a not found error when the group does not exist', () => {
      return expect(groups.getByNameOrId({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myOtherGroup')).to.eventually.be.rejected
        .then(handleNotFound)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0006E',
            errorMessage: 'CWTBG0006E: Group \'myOtherGroup\' not found.'
          })
        })
    })

    it('should return user details when the correct input is provided', () => {
      return groups.getByNameOrId({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myGroup')
        .then(handleSuccess)
        .then((response) => {
          expect(response.data).to.be.an('object')
          expect(response.data.groupName).to.equal('myGroup')
        })
    })
  })
})
