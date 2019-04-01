const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const App = require('../lib/application')
const groups = require('./../lib/api/groups')
const users = require('./../lib/api/users')
const processInstance = require('./../lib/api/processInstance')

chai.use(sinonChai)
const expect = chai.expect

describe('Application', () => {
  describe('Configuration', () => {
    it('should be a function', () => {
      expect(App).to.be.a('function')
    })

    it('should set default values when no config is provided', () => {
      const myApp = new App({})
      expect(myApp.restUrl).to.equal('https://:9443/rest/bpm/wle/v1')
    })

    it('should set environment values when no config is provided but environment variables exist', () => {
      process.env.IBM_BPM_PROTOCOL = 'http'
      process.env.IBM_BPM_HOSTNAME = 'myHostname'
      process.env.IBM_BPM_PORT = '9444'
      process.env.IBM_BPM_CONTEXT = 'myContext'
      process.env.IBM_BPM_USERNAME = 'myUser'
      process.env.IBM_BPM_PASSWORD = 'myPass'
      const myApp = new App()
      expect(myApp.restUrl).to.equal('http://myHostname:9444/myContext/rest/bpm/wle/v1')
      delete process.env.IBM_BPM_PROTOCOL
      delete process.env.IBM_BPM_HOSTNAME
      delete process.env.IBM_BPM_PORT
      delete process.env.IBM_BPM_CONTEXT
      delete process.env.IBM_BPM_USERNAME
      delete process.env.IBM_BPM_PASSWORD
    })

    it('should set config values when they are passed', () => {
      const myApp = new App({
        protocol: 'http',
        hostname: 'domain',
        port: '9445',
        context: 'dev',
        username: 'user',
        password: 'pass'
      })
      expect(myApp.restUrl).to.equal('http://domain:9445/dev/rest/bpm/wle/v1')
    })

    it('should use config values passed even when environment variables exist', () => {
      process.env.IBM_BPM_PROTOCOL = 'http'
      process.env.IBM_BPM_HOSTNAME = 'myHostname'
      process.env.IBM_BPM_PORT = '9444'
      process.env.IBM_BPM_CONTEXT = 'myContext'
      process.env.IBM_BPM_USERNAME = 'myUser'
      process.env.IBM_BPM_PASSWORD = 'myPass'
      const myApp = new App({
        protocol: 'https',
        hostname: 'domain',
        port: '9445',
        context: 'dev',
        username: 'user',
        password: 'pass'
      })
      expect(myApp.restUrl).to.equal('https://domain:9445/dev/rest/bpm/wle/v1')
      delete process.env.IBM_BPM_PROTOCOL
      delete process.env.IBM_BPM_HOSTNAME
      delete process.env.IBM_BPM_PORT
      delete process.env.IBM_BPM_CONTEXT
      delete process.env.IBM_BPM_USERNAME
      delete process.env.IBM_BPM_PASSWORD
    })
  })

  describe('Groups namespace', () => {
    it('should have namespace and methods available', () => {
      const myApp = new App({})
      expect(myApp.groups).to.be.an('object')
      expect(myApp.groups).to.respondTo('getByFilter')
      expect(myApp.groups).to.respondTo('getByNameOrId')
    })

    it('should call the getByFilter with the correct configurations', () => {
      const myApp = new App({
        protocol: 'https',
        hostname: 'domain',
        port: '9445',
        context: 'dev',
        username: 'user',
        password: 'pass'
      })

      const stub = sinon.stub(groups, 'getByFilter').resolves()
      expect(stub).not.to.have.been.called
      return myApp.groups.getByFilter('filter*').then(result => {
        expect(stub).to.have.been.calledWith({
          restUrl: 'https://domain:9445/dev/rest/bpm/wle/v1',
          username: 'user',
          password: 'pass'
        }, 'filter*')
      })
    })

    it('should call the getByNameOrId with the correct configurations', () => {
      const myApp = new App({
        protocol: 'https',
        hostname: 'domain',
        port: '9445',
        context: 'dev',
        username: 'user',
        password: 'pass'
      })

      const stub = sinon.stub(groups, 'getByNameOrId').resolves()
      expect(stub).not.to.have.been.called
      return myApp.groups.getByNameOrId('myGroup').then(result => {
        expect(stub).to.have.been.calledWith({
          restUrl: 'https://domain:9445/dev/rest/bpm/wle/v1',
          username: 'user',
          password: 'pass'
        }, 'myGroup')
      })
    })
  })

  describe('Users namespace', () => {
    it('should have namespace and methods available', () => {
      const myApp = new App({})
      expect(myApp.users).to.be.an('object')
      expect(myApp.users).to.respondTo('getByFilter')
      expect(myApp.users).to.respondTo('getByNameOrId')
      expect(myApp.users).to.respondTo('updatePreference')
    })

    it('should call the getByFilter with the correct configurations', () => {
      const myApp = new App({
        protocol: 'https',
        hostname: 'domain',
        port: '9445',
        context: 'dev',
        username: 'user',
        password: 'pass'
      })

      const stub = sinon.stub(users, 'getByFilter').resolves()
      expect(stub).not.to.have.been.called
      return myApp.users.getByFilter('filter*').then(result => {
        expect(stub).to.have.been.calledWith({
          restUrl: 'https://domain:9445/dev/rest/bpm/wle/v1',
          username: 'user',
          password: 'pass'
        }, 'filter*')
      })
    })

    it('should call the getByNameOrId with the correct configurations', () => {
      const myApp = new App({
        protocol: 'https',
        hostname: 'domain',
        port: '9445',
        context: 'dev',
        username: 'user',
        password: 'pass'
      })

      const stub = sinon.stub(users, 'getByNameOrId').resolves()
      expect(stub).not.to.have.been.called
      return myApp.users.getByNameOrId('myUser').then(result => {
        expect(stub).to.have.been.calledWith({
          restUrl: 'https://domain:9445/dev/rest/bpm/wle/v1',
          username: 'user',
          password: 'pass'
        }, 'myUser')
      })
    })

    it('should call the updatePreference with the correct configurations', () => {
      const myApp = new App({
        protocol: 'https',
        hostname: 'domain',
        port: '9445',
        context: 'dev',
        username: 'user',
        password: 'pass'
      })

      const stub = sinon.stub(users, 'updatePreference').resolves()
      expect(stub).not.to.have.been.called
      return myApp.users.updatePreference('myUser', 'email', 'newValue@domain.com').then(result => {
        expect(stub).to.have.been.calledWith({
          restUrl: 'https://domain:9445/dev/rest/bpm/wle/v1',
          username: 'user',
          password: 'pass'
        }, 'myUser', 'email', 'newValue@domain.com')
      })
    })
  })

  describe('ProcessInstance namespace', () => {
    it('should have namespace and methods available', () => {
      const myApp = new App({})
      expect(myApp.processInstance).to.be.an('object')
      expect(myApp.processInstance).to.respondTo('getById')
      expect(myApp.processInstance).to.respondTo('suspend')
      expect(myApp.processInstance).to.respondTo('resume')
      expect(myApp.processInstance).to.respondTo('terminate')
      expect(myApp.processInstance).to.respondTo('retry')
      expect(myApp.processInstance).to.respondTo('delete')
      expect(myApp.processInstance).to.respondTo('bulkSuspend')
      expect(myApp.processInstance).to.respondTo('bulkResume')
      expect(myApp.processInstance).to.respondTo('bulkTerminate')
      expect(myApp.processInstance).to.respondTo('bulkRetry')
      expect(myApp.processInstance).to.respondTo('bulkDelete')
    })

    it('should call the getById with the correct configurations', () => {
      const myApp = new App({
        protocol: 'https',
        hostname: 'domain',
        port: '9445',
        context: 'dev',
        username: 'user',
        password: 'pass'
      })

      const stub = sinon.stub(processInstance, 'getById').resolves()
      expect(stub).not.to.have.been.called
      return myApp.processInstance.getById('1234').then(result => {
        expect(stub).to.have.been.calledWith({
          restUrl: 'https://domain:9445/dev/rest/bpm/wle/v1',
          username: 'user',
          password: 'pass'
        }, '1234')
      })
    })

    it('should call the suspend with the correct configurations', () => {
      const myApp = new App({
        protocol: 'https',
        hostname: 'domain',
        port: '9445',
        context: 'dev',
        username: 'user',
        password: 'pass'
      })

      const stub = sinon.stub(processInstance, 'suspend').resolves()
      expect(stub).not.to.have.been.called
      return myApp.processInstance.suspend('1234').then(result => {
        expect(stub).to.have.been.calledWith({
          restUrl: 'https://domain:9445/dev/rest/bpm/wle/v1',
          username: 'user',
          password: 'pass'
        }, '1234')
      })
    })

    it('should call the resume with the correct configurations', () => {
      const myApp = new App({
        protocol: 'https',
        hostname: 'domain',
        port: '9445',
        context: 'dev',
        username: 'user',
        password: 'pass'
      })

      const stub = sinon.stub(processInstance, 'resume').resolves()
      expect(stub).not.to.have.been.called
      return myApp.processInstance.resume('1234').then(result => {
        expect(stub).to.have.been.calledWith({
          restUrl: 'https://domain:9445/dev/rest/bpm/wle/v1',
          username: 'user',
          password: 'pass'
        }, '1234')
      })
    })

    it('should call the terminate with the correct configurations', () => {
      const myApp = new App({
        protocol: 'https',
        hostname: 'domain',
        port: '9445',
        context: 'dev',
        username: 'user',
        password: 'pass'
      })

      const stub = sinon.stub(processInstance, 'terminate').resolves()
      expect(stub).not.to.have.been.called
      return myApp.processInstance.terminate('1234').then(result => {
        expect(stub).to.have.been.calledWith({
          restUrl: 'https://domain:9445/dev/rest/bpm/wle/v1',
          username: 'user',
          password: 'pass'
        }, '1234')
      })
    })

    it('should call the retry with the correct configurations', () => {
      const myApp = new App({
        protocol: 'https',
        hostname: 'domain',
        port: '9445',
        context: 'dev',
        username: 'user',
        password: 'pass'
      })

      const stub = sinon.stub(processInstance, 'retry').resolves()
      expect(stub).not.to.have.been.called
      return myApp.processInstance.retry('1234').then(result => {
        expect(stub).to.have.been.calledWith({
          restUrl: 'https://domain:9445/dev/rest/bpm/wle/v1',
          username: 'user',
          password: 'pass'
        }, '1234')
      })
    })

    it('should call the delete with the correct configurations', () => {
      const myApp = new App({
        protocol: 'https',
        hostname: 'domain',
        port: '9445',
        context: 'dev',
        username: 'user',
        password: 'pass'
      })

      const stub = sinon.stub(processInstance, 'delete').resolves()
      expect(stub).not.to.have.been.called
      return myApp.processInstance.delete('1234').then(result => {
        expect(stub).to.have.been.calledWith({
          restUrl: 'https://domain:9445/dev/rest/bpm/wle/v1',
          username: 'user',
          password: 'pass'
        }, '1234')
      })
    })

    it('should call the bulkSuspend with the correct configurations', () => {
      const myApp = new App({
        protocol: 'https',
        hostname: 'domain',
        port: '9445',
        context: 'dev',
        username: 'user',
        password: 'pass'
      })

      const stub = sinon.stub(processInstance, 'bulkSuspend').resolves()
      expect(stub).not.to.have.been.called
      return myApp.processInstance.bulkSuspend(['1234', '5678']).then(result => {
        expect(stub).to.have.been.calledWith({
          restUrl: 'https://domain:9445/dev/rest/bpm/wle/v1',
          username: 'user',
          password: 'pass'
        }, ['1234', '5678'])
      })
    })

    it('should call the bulkResume with the correct configurations', () => {
      const myApp = new App({
        protocol: 'https',
        hostname: 'domain',
        port: '9445',
        context: 'dev',
        username: 'user',
        password: 'pass'
      })

      const stub = sinon.stub(processInstance, 'bulkResume').resolves()
      expect(stub).not.to.have.been.called
      return myApp.processInstance.bulkResume(['1234', '5678']).then(result => {
        expect(stub).to.have.been.calledWith({
          restUrl: 'https://domain:9445/dev/rest/bpm/wle/v1',
          username: 'user',
          password: 'pass'
        }, ['1234', '5678'])
      })
    })

    it('should call the bulkTerminate with the correct configurations', () => {
      const myApp = new App({
        protocol: 'https',
        hostname: 'domain',
        port: '9445',
        context: 'dev',
        username: 'user',
        password: 'pass'
      })

      const stub = sinon.stub(processInstance, 'bulkTerminate').resolves()
      expect(stub).not.to.have.been.called
      return myApp.processInstance.bulkTerminate(['1234', '5678']).then(result => {
        expect(stub).to.have.been.calledWith({
          restUrl: 'https://domain:9445/dev/rest/bpm/wle/v1',
          username: 'user',
          password: 'pass'
        }, ['1234', '5678'])
      })
    })

    it('should call the bulkRetry with the correct configurations', () => {
      const myApp = new App({
        protocol: 'https',
        hostname: 'domain',
        port: '9445',
        context: 'dev',
        username: 'user',
        password: 'pass'
      })

      const stub = sinon.stub(processInstance, 'bulkRetry').resolves()
      expect(stub).not.to.have.been.called
      return myApp.processInstance.bulkRetry(['1234', '5678']).then(result => {
        expect(stub).to.have.been.calledWith({
          restUrl: 'https://domain:9445/dev/rest/bpm/wle/v1',
          username: 'user',
          password: 'pass'
        }, ['1234', '5678'])
      })
    })

    it('should call the bulkDelete with the correct configurations', () => {
      const myApp = new App({
        protocol: 'https',
        hostname: 'domain',
        port: '9445',
        context: 'dev',
        username: 'user',
        password: 'pass'
      })

      const stub = sinon.stub(processInstance, 'bulkDelete').resolves()
      expect(stub).not.to.have.been.called
      return myApp.processInstance.bulkDelete(['1234', '5678']).then(result => {
        expect(stub).to.have.been.calledWith({
          restUrl: 'https://domain:9445/dev/rest/bpm/wle/v1',
          username: 'user',
          password: 'pass'
        }, ['1234', '5678'])
      })
    })
  })
})
