const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const nock = require('nock')
const basicAuth = require('basic-auth')
const queryString = require('querystring')
const users = require('../../../lib/api/users')
const { handleBadRequest, handleUnauthorized, handleNotFound, handleUnknown, handleSuccess } = require('../../test-utils')

const expect = chai.expect
chai.use(chaiAsPromised)

describe('Users', () => {
  describe('getByFilter', () => {
    beforeEach(() => {
      nock('https://myDomain:9443')
        .get('/rest/bpm/wle/v1/users')
        .query(true)
        .reply(function (url, body) {
          const auth = basicAuth.parse(this.req.headers.authorization)
          if (auth && auth.name === 'myUser' && auth.pass === 'myPassword') {
            const filter = queryString.parse(this.req.path.split('?')[1]).filter
            if (filter === 'myU*') {
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
      return expect(users.getByFilter({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myWrongUser',
        password: 'myWrongPassword'
      }, 'testFilter*')).to.eventually.be.rejected
        .then(handleUnauthorized)
    })

    it('should return no users when a search filter that matches no users is provided', () => {
      return expect(users.getByFilter({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'testFilter*')).to.eventually.be.fulfilled
        .then(handleSuccess)
        .then((response) => {
          expect(response.data).to.eql([])
        })
    })

    it('should return users when a search filter that matches users is provided', () => {
      return expect(users.getByFilter({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myU*')).to.eventually.be.fulfilled
        .then(handleSuccess)
        .then((response) => {
          expect(response.data).to.eql([{
            userID: 12,
            userName: 'myUser',
            fullName: 'My User',
            emailAddress: null,
            userPreferences: {},
            memberships: [
              'tw_authors',
              'tw_allusers'
            ]
          }])
        })
    })
  })

  describe('getByNameOrId', () => {
    beforeEach(() => {
      nock('https://myDomain:9443')
        .get(/^\/rest\/bpm\/wle\/v1\/user/)
        .query(true)
        .reply(function (url, body) {
          const auth = basicAuth.parse(this.req.headers.authorization)
          if (auth && auth.name === 'myUser' && auth.pass === 'myPassword') {
            const userName = this.req.path.split('?')[0].split('/').slice(-1)[0]
            if (userName === 'myUser') {
              return [200, require('./responses/getByNameOrId/success.json')]
            } else if (queryString.unescape(userName) === 'my"User') {
              return [500, require('./responses/getByNameOrId/exception.json')]
            } else {
              const response = require('./responses/getByNameOrId/notFound.json')
              response.Data.errorMessage = response.Data.errorMessage.replace('@userName', userName)
              response.Data.errorMessageParameters[0] = response.Data.errorMessageParameters[0].replace('@userName', userName)
              return [404, response]
            }
          } else {
            return [401]
          }
        })
    })

    it('should return an Unauthorized error when wrong credentials are provided', () => {
      return expect(users.getByNameOrId({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myWrongUser',
        password: 'myWrongPassword'
      }, 'myUser')).to.eventually.be.rejected
        .then(handleUnauthorized)
    })

    it('should return a not found error when the user does not exist', () => {
      return expect(users.getByNameOrId({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myOtherUser')).to.eventually.be.rejected
        .then(handleNotFound)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0007E',
            errorMessage: 'CWTBG0007E: User \'myOtherUser\' not found.'
          })
        })
    })

    it('should return an unknown error when the user has invalid characters', () => {
      return expect(users.getByNameOrId({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'my"User')).to.eventually.be.rejected
        .then(handleUnknown)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0019E',
            errorMessage: 'CWTBG0019E: Unexpected exception during execution. Exception information: \'CWWIM3006W  The \'@xsi:type=\'PersonAccount\' and principalName= "my"User"\' search expression is malformed.\'.'
          })
        })
    })

    it('should return user details when the correct input is provided', () => {
      return users.getByNameOrId({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myUser')
        .then(handleSuccess)
        .then((response) => {
          expect(response.data).to.be.an('object')
          expect(response.data.userName).to.equal('myUser')
        })
    })
  })

  describe('updatePreference', () => {
    beforeEach(() => {
      nock('https://myDomain:9443')
        .put(/^\/rest\/bpm\/wle\/v1\/user/)
        .query(true)
        .reply(function (url, body) {
          const auth = basicAuth.parse(this.req.headers.authorization)
          if (auth && auth.name === 'myUser' && auth.pass === 'myPassword') {
            const userName = this.req.path.split('?')[0].split('/').slice(-1)[0]
            const attribute = queryString.parse(this.req.path.split('?')[1]).key
            if (userName === 'myUser') {
              if (attribute === 'myAttribute') {
                return [200, require('./responses/updatePreference/success.json')]
              } else {
                const response = require('./responses/updatePreference/attributeNotFound.json')
                response.Data.errorMessage = response.Data.errorMessage.replace('@attribute', attribute)
                response.Data.errorMessageParameters[0] = response.Data.errorMessageParameters[0].replace('@attribute', attribute)
                return [400, response]
              }
            } else if (queryString.unescape(userName) === 'my"User') {
              return [500, require('./responses/updatePreference/exception.json')]
            } else {
              const response = require('./responses/updatePreference/userNotFound.json')
              response.Data.errorMessage = response.Data.errorMessage.replace('@userName', userName)
              response.Data.errorMessageParameters[0] = response.Data.errorMessageParameters[0].replace('@userName', userName)
              return [404, response]
            }
          } else {
            return [401]
          }
        })
    })

    it('should return an Unauthorized error when wrong credentials are provided', () => {
      return expect(users.updatePreference({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myWrongUser',
        password: 'myWrongPassword'
      }, 'myUser', 'myAttribute', 'test@domain.com')).to.eventually.be.rejected
        .then(handleUnauthorized)
    })

    it('should return a not found error when the user does not exist', () => {
      return expect(users.updatePreference({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myOtherUser', 'myAttribute', 'test@domain.com')).to.eventually.be.rejected
        .then(handleNotFound)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0007E',
            errorMessage: 'CWTBG0007E: User \'myOtherUser\' not found.'
          })
        })
    })

    it('should return a bad request error when the attribute is not defined', () => {
      return expect(users.updatePreference({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myUser', 'myOtherAttribute', 'test@domain.com')).to.eventually.be.rejected
        .then(handleBadRequest)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0541E',
            errorMessage: 'CWTBG0541E: User preference key \'myOtherAttribute\' is not valid.'
          })
        })
    })

    it('should return an unknown error when the user has invalid characters', () => {
      return expect(users.updatePreference({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'my"User', 'myAttribute', 'test@domain.com')).to.eventually.be.rejected
        .then(handleUnknown)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0019E',
            errorMessage: 'CWTBG0019E: Unexpected exception during execution. Exception information: \'CWWIM3006W  The \'@xsi:type=\'PersonAccount\' and principalName= "my"User"\' search expression is malformed.\'.'
          })
        })
    })

    it('should return user details when the correct input is provided', () => {
      return users.updatePreference({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myUser', 'myAttribute', 'test@domain.com')
        .then(handleSuccess)
        .then((response) => {
          expect(response.data).to.be.an('object')
          expect(response.data.userName).to.equal('myUser')
        })
    })
  })
})
