import { expect } from 'chai'
import app from '.'
import { version } from '../package.json'

describe('Main app', () => {
  it('should have the correct version number', () => {
    expect(app.version).to.eql(version)
  })
})
