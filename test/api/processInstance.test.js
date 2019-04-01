const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const nock = require('nock')
const basicAuth = require('basic-auth')
const processInstance = require('../../lib/api/processInstance')
const { HTTP_MESSAGES } = require('./../../lib/api/common')

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
              return [200, {
                'status': '200',
                'data': {
                  'creationTime': '2019-03-29T16:03:25Z',
                  'data': '',
                  'description': '',
                  'richDescription': '',
                  'executionState': 'Active',
                  'state': 'STATE_RUNNING',
                  'lastModificationTime': '2019-03-30T19:54:51Z',
                  'name': 'My Instance Name',
                  'piid': '23972',
                  'caseFolderServerName': null,
                  'processTemplateID': '25.912f1c9b-8eaa-44fc-ae35-4914349f4df6',
                  'processTemplateName': 'My Process',
                  'processAppName': 'My Process Application',
                  'processAppAcronym': 'MYPA',
                  'processAppID': '2066.5612af53-33ac-42e6-ab5d-0b65a0b2f03b',
                  'snapshotName': null,
                  'snapshotID': '2064.64c13d68-c128-413b-92c1-ad3f5a7b0273',
                  'branchID': '2063.e56ca3ef-6ee8-4a3f-abb4-cab310234363',
                  'branchName': 'Main',
                  'snapshotTip': true,
                  'startingDocumentServerName': null,
                  'dueDate': '2019-04-23T07:00:00Z',
                  'comments': [],
                  'documents': [],
                  'actionDetails': null,
                  'relationship': [],
                  'businessData': [],
                  'tasks': [],
                  'diagram': {},
                  'executionTree': {},
                  'variables': {},
                  'actions': null,
                  'starterId': '2048.9'
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
