module.exports = {
  buildConfig: (config) => {
    return {
      auth: {
        username: config.username,
        password: config.password
      },
      headers: {
        'Content-Type': 'application/json'
      },
      json: true
    }
  }
}
