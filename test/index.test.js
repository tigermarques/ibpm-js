const chai = require('chai')
const app = require('../lib')

const expect = chai.expect

describe('Index', () => {
  it('should be a function', () => {
    expect(app).to.be.a('function')
  })

  it('should create an object', () => {
    const myApp = app({})
    expect(myApp).to.be.an('object')
  })
})
