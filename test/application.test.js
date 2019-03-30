const chai = require('chai')
const App = require('../lib/application')

const expect = chai.expect

describe('Application', () => {
  it('should be a function', () => {
    expect(App).to.be.a('function')
  })

  it('should set default values when no config is provided', () => {
    const myApp = new App({})
    expect(myApp.protocol).to.equal('https')
    expect(myApp.hostname).to.equal('')
    expect(myApp.port).to.equal('9443')
    expect(myApp.context).to.equal('')
    expect(myApp.username).to.equal('bpmadmin')
    expect(myApp.password).to.equal('bpmadmin')
    expect(myApp.restUrl).to.equal('https://:9443/rest/bpm/wle/v1/')
  })

  it('should set environment values when no config is provided but environment variables exist', () => {
    process.env.IBM_BPM_PROTOCOL = 'http'
    process.env.IBM_BPM_HOSTNAME = 'myHostname'
    process.env.IBM_BPM_PORT = '9444'
    process.env.IBM_BPM_CONTEXT = 'myContext'
    process.env.IBM_BPM_USERNAME = 'myUser'
    process.env.IBM_BPM_PASSWORD = 'myPass'
    const myApp = new App()
    expect(myApp.protocol).to.equal('http')
    expect(myApp.hostname).to.equal('myHostname')
    expect(myApp.port).to.equal('9444')
    expect(myApp.context).to.equal('myContext/')
    expect(myApp.username).to.equal('myUser')
    expect(myApp.password).to.equal('myPass')
    expect(myApp.restUrl).to.equal('http://myHostname:9444/myContext/rest/bpm/wle/v1/')
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
    expect(myApp.protocol).to.equal('http')
    expect(myApp.hostname).to.equal('domain')
    expect(myApp.port).to.equal('9445')
    expect(myApp.context).to.equal('dev/')
    expect(myApp.username).to.equal('user')
    expect(myApp.password).to.equal('pass')
    expect(myApp.restUrl).to.equal('http://domain:9445/dev/rest/bpm/wle/v1/')
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
    expect(myApp.protocol).to.equal('https')
    expect(myApp.hostname).to.equal('domain')
    expect(myApp.port).to.equal('9445')
    expect(myApp.context).to.equal('dev/')
    expect(myApp.username).to.equal('user')
    expect(myApp.password).to.equal('pass')
    expect(myApp.restUrl).to.equal('https://domain:9445/dev/rest/bpm/wle/v1/')
    delete process.env.IBM_BPM_PROTOCOL
    delete process.env.IBM_BPM_HOSTNAME
    delete process.env.IBM_BPM_PORT
    delete process.env.IBM_BPM_CONTEXT
    delete process.env.IBM_BPM_USERNAME
    delete process.env.IBM_BPM_PASSWORD
  })
})
