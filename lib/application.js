class App {
  constructor (config) {
    this.protocol = process.env.IBM_BPM_PROTOCOL || 'https'
    this.hostname = process.env.IBM_BPM_HOSTNAME || ''
    this.port = process.env.IBM_BPM_PORT || '9443'
    this.context = process.env.IBM_BPM_CONTEXT || ''
    this.username = process.env.IBM_BPM_USERNAME || 'bpmadmin'
    this.password = process.env.IBM_BPM_PASSWORD || 'bpmadmin'
    if (config && typeof config === 'object') {
      this.protocol = config.protocol || this.protocol
      this.hostname = config.hostname || this.hostname
      this.port = config.port || this.port
      this.context = config.context || this.context
      this.username = config.username || this.username
      this.password = config.password || this.password
    }
    if (this.context) {
      // this removes leading spaces and trailing spaces
      this.context = this.context.replace(/\/$/, '').replace(/^\//, '')
      this.context = `${this.context}/`
    }
  }

  get restUrl () {
    return `${this.protocol}://${this.hostname}:${this.port}/${this.context}rest/bpm/wle/v1`
  }
}

module.exports = App
