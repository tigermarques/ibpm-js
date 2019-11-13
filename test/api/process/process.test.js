const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const nock = require('nock')
const basicAuth = require('basic-auth')
const queryString = require('querystring')
const processNamespace = require('../../../lib/api/process')
const { handleBadRequest, handleUnauthorized, handleForbidden, handleNotFound, handleConflict, handleSuccess } = require('../../test-utils')

const expect = chai.expect
chai.use(chaiAsPromised)

describe('Process', () => {
  describe('start', () => {
    beforeEach(() => {
      nock('https://myDomain:9443')
        .post('/rest/bpm/wle/v1/process')
        .query(queryObj => queryObj.action === 'start')
        .reply(function (url, body) {
          const auth = basicAuth.parse(this.req.headers.authorization)
          if (auth && auth.name === 'myUser' && auth.pass === 'myPassword') {
            const parsedParams = queryString.parse(this.req.path.split('?')[1])
            const {
              bpdId,
              snapshotId,
              branchId,
              processAppId
            } = parsedParams
            const params = JSON.parse(parsedParams.params)
            if (bpdId === 'myBpdId') {
              if (snapshotId) {
                if (snapshotId === 'mySnapshotId') {
                  if (params.myVariable) {
                    if (params.myVariable !== 'myInvalidValue') {
                      return [200, require('./responses/start/200/success.json')]
                    } else {
                      return [400, require('./responses/start/400/invalidVariableValue.json')]
                    }
                  } else if (params.myInvalidVariable) {
                    return [400, require('./responses/start/400/invalidVariable.json')]
                  }
                } else if (snapshotId === 'myInvalidSnapshotId') {
                  return [400, require('./responses/start/400/invalidSnapshot.json')]
                } else if (snapshotId === 'myInactiveSnapshotId') {
                  return [409, require('./responses/start/409/wrongState.json')]
                } else {
                  const response = require('./responses/start/404/snapshotNotFound.json')
                  response.Data.errorMessage = response.Data.errorMessage.replace('@bpdId', bpdId)
                  response.Data.errorMessageParameters[0] = response.Data.errorMessageParameters[0].replace('@bpdId', bpdId)
                  return [404, response]
                }
              } else if (branchId) {
                if (branchId === 'myInvalidBranchId') {
                  return [400, require('./responses/start/400/invalidBranch.json')]
                } else {
                  const response = require('./responses/start/404/branchNotFound.json')
                  response.Data.errorMessage = response.Data.errorMessage.replace('@bpdId', bpdId)
                  response.Data.errorMessageParameters[0] = response.Data.errorMessageParameters[0].replace('@bpdId', bpdId)
                  return [404, response]
                }
              } else if (processAppId) {
                if (processAppId === 'myInvalidProcessAppId') {
                  return [400, require('./responses/start/400/invalidProcessApp.json')]
                } else {
                  const response = require('./responses/start/404/processAppNotFound.json')
                  response.Data.errorMessage = response.Data.errorMessage.replace('@appId', processAppId)
                  response.Data.errorMessageParameters[0] = response.Data.errorMessageParameters[0].replace('@appId', processAppId)
                  return [404, response]
                }
              } else {
                return [400, require('./responses/start/400/snapshotOrProcessAppRequired.json')]
              }
            } else if (bpdId === 'myInvalidBpdId') {
              return [400, require('./responses/start/400/invalidBpd.json')]
            } else if (bpdId === 'myUnauthorizedBpdId') {
              return [401, require('./responses/start/401/notAuthorizedToStart.json')]
            } else if (bpdId === 'myErrorBpdId') {
              return [403, require('./responses/start/403/errorStarting.json')]
            } else if (bpdId === 'myNotExposedBpdId') {
              return [409, require('./responses/start/409/bpdNotExposed.json')]
            } else if (!bpdId) {
              return [400, require('./responses/start/400/bpdIdRequired.json')]
            } else {
              const response = require('./responses/start/404/bpdNotFound.json')
              response.Data.errorMessage = response.Data.errorMessage.replace('@bpdId', bpdId)
              response.Data.errorMessageParameters[0] = response.Data.errorMessageParameters[0].replace('@bpdId', bpdId)
              return [404, response]
            }
          } else {
            return [401]
          }
        })
    })

    it('should return an Unauthorized error when wrong credentials are provided', () => {
      return expect(processNamespace.start({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myWrongUser',
        password: 'myWrongPassword'
      })).to.eventually.be.rejected
        .then(handleUnauthorized)
    })

    it('should return a bad request error if no bpd id is provided', () => {
      return expect(processNamespace.start({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      })).to.eventually.be.rejected
        .then(handleBadRequest)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0023E',
            errorMessage: 'CWTBG0023E: The \'bpdId\' query parameter was required but was not specified or has no value.'
          })
        })
    })

    it('should return a bad request error if no snapshot and no process app are provided', () => {
      return expect(processNamespace.start({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myBpdId')).to.eventually.be.rejected
        .then(handleBadRequest)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0022E',
            errorMessage: 'CWTBG0022E: The \'snapshotId\' or \'processAppId\' query parameter was required but was not specified.'
          })
        })
    })

    it('should return a bad request error if an invalid bpd id is provided', () => {
      return expect(processNamespace.start({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myInvalidBpdId', { snapshotId: 'mySnapshotId' })).to.eventually.be.rejected
        .then(handleBadRequest)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0554E',
            errorMessage: 'CWTBG0554E: The ID \'myInvalidBpdId\' is not valid. This ID is a number, and a dot-qualified ID was expected.'
          })
        })
    })

    it('should return a bad request error if an invalid branch id is provided', () => {
      return expect(processNamespace.start({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myBpdId', { branchId: 'myInvalidBranchId' })).to.eventually.be.rejected
        .then(handleBadRequest)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0012E',
            errorMessage: 'CWTBG0012E: The parameter \'branchId\' is invalid.'
          })
        })
    })

    it('should return a bad request error if an invalid snapshot id is provided', () => {
      return expect(processNamespace.start({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myBpdId', { snapshotId: 'myInvalidSnapshotId' })).to.eventually.be.rejected
        .then(handleBadRequest)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0012E',
            errorMessage: 'CWTBG0012E: The parameter \'snapshotId\' is invalid.'
          })
        })
    })

    it('should return a bad request error if an invalid process app id is provided', () => {
      return expect(processNamespace.start({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myBpdId', { processAppId: 'myInvalidProcessAppId' })).to.eventually.be.rejected
        .then(handleBadRequest)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0012E',
            errorMessage: 'CWTBG0012E: The parameter \'projectId\' is invalid.'
          })
        })
    })

    it('should return a bad request error if an invalid variable is provided', () => {
      return expect(processNamespace.start({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myBpdId', { snapshotId: 'mySnapshotId' }, {
        myInvalidVariable: 'value'
      })).to.eventually.be.rejected
        .then(handleBadRequest)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0543E',
            errorMessage: 'CWTBG0543E: The variable \'myInvalidVariable\' does not exist.'
          })
        })
    })

    it('should return a bad request error if an invalid variable value is provided', () => {
      return expect(processNamespace.start({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myBpdId', { snapshotId: 'mySnapshotId' }, {
        myVariable: 'myInvalidValue'
      })).to.eventually.be.rejected
        .then(handleBadRequest)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0029E',
            errorMessage: 'CWTBG0029E: The parameter \'params\' has an unsupported value \'myInvalidValue\'. Supported values are: \'Integer\''
          })
        })
    })

    it('should return an unauthorized error if the user is not authorized to start the process', () => {
      return expect(processNamespace.start({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myUnauthorizedBpdId', { snapshotId: 'mySnapshotId' })).to.eventually.be.rejected
        .then(handleUnauthorized)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0549E',
            errorMessage: 'CWTBG0549E: You are not authorized to perform the \'start\' action.'
          })
        })
    })

    it('should return a forbidden error if an error is found starting the process', () => {
      return expect(processNamespace.start({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myErrorBpdId', { snapshotId: 'mySnapshotId' })).to.eventually.be.rejected
        .then(handleForbidden)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0570E',
            errorMessage: 'CWTBG0570E: A \'start\' action could not be performed due to [myMessage].'
          })
        })
    })

    it('should return a not found error if the bpd id provided does not exist', () => {
      return expect(processNamespace.start({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myOtherBpdId', { snapshotId: 'mySnapshotId' })).to.eventually.be.rejected
        .then(handleNotFound)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0047E',
            errorMessage: 'CWTBG0047E: Process \'myOtherBpdId\' does not exist; it might have been deleted in the meantime.'
          })
        })
    })

    it('should return a not found error if the branch id provided does not exist', () => {
      return expect(processNamespace.start({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myBpdId', { branchId: 'myOtherBranchId' })).to.eventually.be.rejected
        .then(handleNotFound)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0047E',
            errorMessage: 'CWTBG0047E: Process \'myBpdId\' does not exist; it might have been deleted in the meantime.'
          })
        })
    })

    it('should return a not found error if the snapshot id provided does not exist', () => {
      return expect(processNamespace.start({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myBpdId', { snapshotId: 'myOtherSnapshotId' })).to.eventually.be.rejected
        .then(handleNotFound)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0047E',
            errorMessage: 'CWTBG0047E: Process \'myBpdId\' does not exist; it might have been deleted in the meantime.'
          })
        })
    })

    it('should return a not found error if the process app id provided does not exist', () => {
      return expect(processNamespace.start({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myBpdId', { processAppId: 'myOtherProcessAppId' })).to.eventually.be.rejected
        .then(handleNotFound)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0050E',
            errorMessage: 'CWTBG0050E: Project \'myOtherProcessAppId\' does not exist.'
          })
        })
    })

    it('should return a conflict error when the bpd is not exposed', () => {
      return expect(processNamespace.start({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myNotExposedBpdId', { snapshotId: 'mySnapshotId' })).to.eventually.be.rejected
        .then(handleConflict)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0587E',
            errorMessage: 'CWTBG0587E: Cannot start BPD because the BPD is not exposed.'
          })
        })
    })

    it('should return a conflict error when the snapshot state does not allow to start the process', () => {
      return expect(processNamespace.start({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myBpdId', { snapshotId: 'myInactiveSnapshotId' })).to.eventually.be.rejected
        .then(handleConflict)
        .then(response => {
          expect(response.data).to.eql({
            errorNumber: 'CWTBG0586E',
            errorMessage: 'CWTBG0586E: Cannot start BPD because the snapshot or BPD is in the wrong state.'
          })
        })
    })

    it('should return newly created instance details when the correct input is provided', () => {
      return expect(processNamespace.start({
        restUrl: 'https://myDomain:9443/rest/bpm/wle/v1',
        username: 'myUser',
        password: 'myPassword'
      }, 'myBpdId', { snapshotId: 'mySnapshotId' }, {
        myVariable: 'myValue'
      })).to.eventually.be.fulfilled
        .then(handleSuccess)
        .then((response) => {
          expect(response.data).to.be.an('object')
          expect(response.data).to.eql({
            piid: '42891',
            name: 'Processo1:42891',
            description: null,
            starterId: '1',
            creationTime: new Date('2019-11-13T10:09:00Z'),
            lastModificationTime: new Date('2019-11-13T10:09:00Z'),
            dueDate: new Date('2019-11-13T18:09:00Z'),
            executionState: 'Active',
            state: 'STATE_RUNNING',
            processAppID: '2066.f5200583-e8d0-4a12-8606-74ac37bd7443',
            processAppName: 'My App',
            processAppAcronym: 'MYAPP',
            snapshotID: '2064.a07ab423-ef66-4954-ace3-4e4cef2a2ab1',
            snapshotName: null,
            snapshotTip: true,
            branchID: '2063.9c34de55-381f-4ac5-80ca-1226bdd4ba0c',
            branchName: 'Main',
            processTemplateID: '25.0dcc9130-7c0a-4fe9-9055-9e6688d6be01',
            processTemplateName: 'Process2',
            data: '"{}"',
            businessData: [],
            variables: {},
            actions: null,
            executionTree: {},
            diagram: {},
            documents: null,
            tasks: [{
              tkiid: '189812',
              activationTime: new Date('2019-11-13T10:09:00Z'),
              atRiskTime: new Date('2019-11-13T11:03:00Z'),
              completionTime: null,
              dueTime: new Date('2019-11-13T11:09:00Z'),
              lastModificationTime: new Date('2019-11-13T10:09:00Z'),
              startTime: new Date('2019-11-13T10:09:00Z'),
              assignedToID: 2254,
              assignedTo: 'All Users',
              assignedToDisplayName: 'All Users',
              assignedToType: 'group',
              teamID: 2254,
              teamName: 'All Users',
              teamDisplayName: 'All Users',
              managerTeamID: 41461,
              managerTeamName: 'Managers of All Users',
              managerTeamDisplayName: 'Managers of All Users',
              data: {
                variables: {
                  bpdInstanceName: null,
                  subject: null,
                  bpdName: null,
                  activityName: null,
                  taskNarrative: null,
                  bpdInstanceId: null,
                  defaultText: null,
                  bpdDescription: null,
                  activityDescription: null,
                  userName: null,
                  taskId: null
                }
              },
              description: '',
              displayName: 'Passo: Untitled',
              externalActivitySnapshotID: null,
              kind: 'KIND_PARTICIPATING',
              name: 'Untitled',
              originator: 'deadmin',
              owner: null,
              priority: 30,
              priorityName: 'Normal',
              state: 'STATE_READY',
              status: 'Received',
              serviceID: '1.c2d00e9e-9c34-3e08-9258-101bd61b964d',
              serviceSnapshotID: '2064.c7680890-5385-3f24-bbc9-20da937ac8c4',
              flowObjectID: 'bpdid:fb34069ef86e808b:7a800ddb:16e361ee416:-7fe3',
              nextTaskId: null,
              actions: null
            }]
          })
        })
    })
  })
})
