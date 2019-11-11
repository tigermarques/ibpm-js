const chai = require('chai')
const { filterProperties } = require('../../lib/utils/ObjectHandler')

const expect = chai.expect

describe('ObjectHandler', () => {
  it('should be a function', () => {
    expect(filterProperties).to.be.a('function')
  })

  it('should do nothing if wrong inputs are provided', () => {
    expect(filterProperties(null, null)).to.equal(null)
    expect(filterProperties({}, null)).to.eql({})
    expect(filterProperties(3, [])).to.equal(3)
    expect(filterProperties({ name: 'value' }, 4)).to.eql({ name: 'value' })
  })

  it('should return an empty object if no properties are matched', () => {
    expect(filterProperties({ name: 'value' }, [])).to.eql({})
    expect(filterProperties({ name: 'value' }, ['otherName', { property: 'yetAnotherName' }])).to.eql({})
  })

  it('should filter object with given properties', () => {
    expect(filterProperties({ prop1: 'value', prop2: 'value2' }, ['prop1'])).to.eql({ prop1: 'value' })
  })

  it('should ignore mapper if it is not a function', () => {
    expect(filterProperties({ prop1: 'value', prop2: 'value2' }, [{ property: 'prop1', mapper: 2 }])).to.eql({ prop1: 'value' })
  })

  it('should use mapper if it is a function', () => {
    expect(filterProperties({ prop1: 'value', prop2: 'value2' }, [{ property: 'prop1', mapper: (val) => val.toUpperCase() }])).to.eql({ prop1: 'VALUE' })
  })
})
