const chai = require('chai')
const organization = require('../../lib/api/organization')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const expect = chai.expect

describe('Groups', () => {
  it('should return status 200', () => {
    return organization.groups({
      restUrl: 'https://acfinmdwbpmq01.atlantico.int:9444/rest/bpm/wle/v1/',
      username: 't99kmg07',
      password: 'Angola1234'
    }, 'tw_*').then((body) => {
      expect(body.status).to.equal('200')
    })
  })
})
