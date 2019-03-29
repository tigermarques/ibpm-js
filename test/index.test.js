const chai = require('chai')
const app = require('../lib')

const expect = chai.expect

describe('Main app', () => {
  it('should be an object', () => {
    expect(app).to.be.an('object')
  })
})
