const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const nock = require('nock')
const basicAuth = require('basic-auth')
const users = require('../../lib/api/users')
const { HTTP_MESSAGES } = require('./../../lib/api/common')

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
            return [200, {
              'status': '200',
              'data': {
                'users': [
                  {
                    'userID': 12,
                    'userName': 'myUser',
                    'fullName': 'My User',
                    'isDisabled': false,
                    'primaryGroup': null,
                    'emailAddress': null,
                    'userPreferences': {

                    },
                    'memberships': [
                      'tw_authors',
                      'tw_allusers'
                    ]
                  }
                ]
              }
            }]
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
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.UNAUTHORIZED)
        })
    })

    it('should return status 200 when the correct input is provided', () => {
      return users.getByFilter({
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
        .get(/^\/rest\/bpm\/wle\/v1\/user/)
        .query(true)
        .reply(function (url, body) {
          const auth = basicAuth.parse(this.req.headers.authorization)
          if (auth && auth.name === 'myUser' && auth.pass === 'myPassword') {
            const userName = this.req.path.split('?')[0].split('/').slice(-1)[0]
            if (userName === 'myUser') {
              return [200, {
                'status': '200',
                'data': {
                  'userID': 12,
                  'userName': userName,
                  'fullName': 'My User',
                  'isDisabled': false,
                  'primaryGroup': null,
                  'emailAddress': null,
                  'userPreferences': {},
                  'memberships': [
                    'tw_authors',
                    'tw_allusers'
                  ]
                }
              }]
            } else {
              return [404]
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
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.UNAUTHORIZED)
        })
    })

    it('should return a Not found error when the user does not exist', () => {
      return expect(users.getByNameOrId({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myOtherUser')).to.eventually.be.rejected
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.NOT_FOUND)
        })
    })

    it('should return user details when the correct input is provided', () => {
      return users.getByNameOrId({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myUser').then((body) => {
        expect(body.status).to.equal('200')
        expect(body.data).to.be.an('object')
        expect(body.data.userName).to.equal('myUser')
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
            if (userName === 'myUser') {
              return [200, {
                'status': '200',
                'data': {
                  'userID': 12,
                  'userName': this.req.path.split('?')[0].split('/').slice(-1)[0],
                  'fullName': 'My User',
                  'isDisabled': false,
                  'primaryGroup': null,
                  'emailAddress': null,
                  'userPreferences': {},
                  'memberships': [
                    'tw_authors',
                    'tw_allusers'
                  ]
                }
              }]
            } else {
              return [404]
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
      }, 'myUser', 'email', 'test@domain.com')).to.eventually.be.rejected
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.UNAUTHORIZED)
        })
    })

    it('should return a Not found error when the user does not exist', () => {
      return expect(users.updatePreference({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myOtherUser', 'email', 'test@domain.com')).to.eventually.be.rejected
        .then(result => {
          expect(result).to.be.an('error')
          expect(result.message).to.equal(HTTP_MESSAGES.NOT_FOUND)
        })
    })

    it('should return succeed when the correct input is provided', () => {
      return users.updatePreference({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myUser', 'email', 'test@domain.com').then((body) => {
        expect(body.status).to.equal('200')
      })
    })
  })
})
