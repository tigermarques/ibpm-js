import { expect } from 'chai'
import * as organization from './organization'

describe('Groups', () => {
  it('should return status 200', () => {
    return organization.groups('tw_*').then((body) => {
      expect(body.status).to.equal('200')
    })
  })
})
