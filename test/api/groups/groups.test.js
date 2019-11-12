const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const nock = require('nock')
const basicAuth = require('basic-auth')
const queryString = require('querystring')
const groups = require('../../../lib/api/groups')
const { handleUnauthorized, handleNotFound, handleUnknown, handleSuccess } = require('../../test-utils')

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
          expect(response.data).to.eql([])
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
          expect(response.data).to.eql([{
            groupID: 3,
            groupName: 'myGroup',
            displayName: 'myGroup',
            description: 'Group for people',
            members: [
              'myUser',
              'myOtherUser'
            ],
            managerGroupName: null
          }])
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

    it('should return group details when the correct input is provided', () => {
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

  describe('addUser', () => {
    beforeEach(() => {
      nock('https://myDomain:9443')
        .put(/^\/rest\/bpm\/wle\/v1\/group/)
        .query(queryObj => queryObj.action === 'addMember' && 'user' in queryObj && !('group' in queryObj))
        .reply(function (url, body) {
          const auth = basicAuth.parse(this.req.headers.authorization)
          if (auth && auth.name === 'myUser' && auth.pass === 'myPassword') {
            const groupName = this.req.path.split('?')[0].split('/').slice(-1)[0]
            const userName = queryString.parse(this.req.path.split('?')[1]).user
            if (groupName === 'myGroup') {
              if (userName === 'myUser') {
                return [200, require('./responses/addUser/success.json')]
              } else {
                const response = require('./responses/addUser/userNotFound.json')
                response.Data.errorMessage = response.Data.errorMessage.replace('@userName', userName)
                response.Data.errorMessageParameters[0] = response.Data.errorMessageParameters[0].replace('@userName', userName)
                return [404, response]
              }
            } else if (groupName === '123456789123456789') {
              return [500, require('./responses/addUser/exception.json')]
            } else {
              const response = require('./responses/addUser/groupNotFound.json')
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
      return expect(groups.addUser({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myWrongUser',
        password: 'myWrongPassword'
      }, 'myGroup', 'myUser')).to.eventually.be.rejected
        .then(handleUnauthorized)
    })

    it('should return a not found error when the group does not exist', () => {
      return expect(groups.addUser({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myOtherGroup', 'myUser')).to.eventually.be.rejected
        .then(handleNotFound)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0006E',
            errorMessage: 'CWTBG0006E: Group \'myOtherGroup\' not found.'
          })
        })
    })

    it('should return a server error when the group name cannot be parsed', () => {
      return expect(groups.addUser({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, '123456789123456789', 'myUser')).to.eventually.be.rejected
        .then(handleUnknown)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0019E',
            errorMessage: 'CWTBG0019E: Unexpected exception during execution. Exception information: \'Unexpected database exception\'.'
          })
        })
    })

    it('should return a not found error when the user does not exist', () => {
      return expect(groups.addUser({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myGroup', 'myOtherUser')).to.eventually.be.rejected
        .then(handleNotFound)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0007E',
            errorMessage: 'CWTBG0007E: User \'myOtherUser\' not found.'
          })
        })
    })

    it('should return group details when the correct input is provided', () => {
      return groups.addUser({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myGroup', 'myUser')
        .then(handleSuccess)
        .then((response) => {
          expect(response.data).to.be.an('object')
          expect(response.data.groupName).to.equal('myGroup')
        })
    })
  })

  describe('removeUser', () => {
    beforeEach(() => {
      nock('https://myDomain:9443')
        .put(/^\/rest\/bpm\/wle\/v1\/group/)
        .query(queryObj => queryObj.action === 'removeMember' && 'user' in queryObj && !('group' in queryObj))
        .reply(function (url, body) {
          const auth = basicAuth.parse(this.req.headers.authorization)
          if (auth && auth.name === 'myUser' && auth.pass === 'myPassword') {
            const groupName = this.req.path.split('?')[0].split('/').slice(-1)[0]
            const userName = queryString.parse(this.req.path.split('?')[1]).user
            if (groupName === 'myGroup') {
              if (userName === 'myUser') {
                return [200, require('./responses/removeUser/success.json')]
              } else {
                const response = require('./responses/removeUser/userNotFound.json')
                response.Data.errorMessage = response.Data.errorMessage.replace('@userName', userName)
                response.Data.errorMessageParameters[0] = response.Data.errorMessageParameters[0].replace('@userName', userName)
                return [404, response]
              }
            } else if (groupName === '123456789123456789') {
              return [500, require('./responses/removeUser/exception.json')]
            } else {
              const response = require('./responses/removeUser/groupNotFound.json')
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
      return expect(groups.removeUser({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myWrongUser',
        password: 'myWrongPassword'
      }, 'myGroup', 'myUser')).to.eventually.be.rejected
        .then(handleUnauthorized)
    })

    it('should return a not found error when the group does not exist', () => {
      return expect(groups.removeUser({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myOtherGroup', 'myUser')).to.eventually.be.rejected
        .then(handleNotFound)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0006E',
            errorMessage: 'CWTBG0006E: Group \'myOtherGroup\' not found.'
          })
        })
    })

    it('should return a server error when the group name cannot be parsed', () => {
      return expect(groups.removeUser({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, '123456789123456789', 'myUser')).to.eventually.be.rejected
        .then(handleUnknown)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0019E',
            errorMessage: 'CWTBG0019E: Unexpected exception during execution. Exception information: \'Unexpected database exception\'.'
          })
        })
    })

    it('should return a not found error when the user does not exist', () => {
      return expect(groups.removeUser({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myGroup', 'myOtherUser')).to.eventually.be.rejected
        .then(handleNotFound)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0007E',
            errorMessage: 'CWTBG0007E: User \'myOtherUser\' not found.'
          })
        })
    })

    it('should return group details when the correct input is provided', () => {
      return groups.removeUser({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myGroup', 'myUser')
        .then(handleSuccess)
        .then((response) => {
          expect(response.data).to.be.an('object')
          expect(response.data.groupName).to.equal('myGroup')
        })
    })
  })
})
