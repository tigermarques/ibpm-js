module.exports = {
  filterProperties: (obj, properties) => {
    if (obj && properties && typeof obj === 'object' && Array.isArray(properties)) {
      for (const prop in obj) {
        const currentProp = properties.find(item => {
          return (typeof item === 'string' && item === prop) ||
            (typeof item === 'object' && item.property === prop)
        })
        if (!currentProp) {
          delete obj[prop]
        } else if (typeof currentProp === 'object' && 'mapper' in currentProp && typeof currentProp.mapper === 'function') {
          obj[prop] = currentProp.mapper(obj[prop])
        }
      }
    }
    return obj
  }
}
