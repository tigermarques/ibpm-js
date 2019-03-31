const chai = require('chai')
const groups = require('../../lib/api/groups')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const expect = chai.expect

describe('Groups', () => {
  it('should return status 200', () => {
    return groups.getByFilter({
      restUrl: 'https://acfinmdwbpmd01.atlantico.int:9444/rest/bpm/wle/v1/',
      username: 't99kmg07',
      password: 'Angola1234'
    }, 'tw_*').then((body) => {
      expect(body.status).to.equal('200')
    })
  })
})
