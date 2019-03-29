const chai = require('chai')
const organization = require('../../lib/api/organization')

const expect = chai.expect

describe('Groups', () => {
  it('should return status 200', () => {
    return organization.groups('tw_*').then((body) => {
      expect(body.status).to.equal('200')
    })
  })
})
