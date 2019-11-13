const request = require('request')
const { buildConfig, buildResponseHandler, genericErrorHandler } = require('./common')
const { filterProperties } = require('../utils/ObjectHandler')

const dateMapper = val => val ? new Date(val) : null

const INSTANCE_PROPERTIES = [
  'piid',
  'name',
  'description',
  {
    property: 'starterId',
    mapper: val => val && val.indexOf('.') > -1 ? val.substr(val.indexOf('.') + 1) : val
  },
  {
    property: 'creationTime',
    mapper: dateMapper
  },
  {
    property: 'lastModificationTime',
    mapper: dateMapper
  },
  {
    property: 'dueDate',
    mapper: dateMapper
  },
  'executionState',
  'state',
  'processAppID',
  'processAppName',
  'processAppAcronym',
  'snapshotID',
  'snapshotName',
  'snapshotTip',
  'branchID',
  'branchName',
  'processTemplateID',
  'processTemplateName',
  'data',
  'businessData',
  'variables',
  'actions',
  'executionTree',
  'diagram',
  'documents',
  'tasks'
]

const TASK_PROPERTIES = [
  'tkiid',
  {
    property: 'activationTime',
    mapper: dateMapper
  },
  {
    property: 'atRiskTime',
    mapper: dateMapper
  },
  {
    property: 'completionTime',
    mapper: dateMapper
  },
  {
    property: 'dueTime',
    mapper: dateMapper
  },
  {
    property: 'lastModificationTime',
    mapper: dateMapper
  },
  {
    property: 'startTime',
    mapper: dateMapper
  },
  'assignedToID',
  'assignedTo',
  'assignedToDisplayName',
  'assignedToType',
  'teamID',
  'teamName',
  'teamDisplayName',
  'managerTeamID',
  'managerTeamName',
  'managerTeamDisplayName',
  'data',
  'processData',
  'description',
  'displayName',
  'externalActivityID',
  'externalActivitySnapshotID',
  'kind',
  'name',
  'originator',
  'owner',
  'priority',
  'priorityName',
  'state',
  'status',
  'serviceID',
  'serviceSnapshotID',
  'flowObjectID',
  'nextTaskId',
  'actions'
]

module.exports = {
  start: (config, bpdId, options = {}, parameters = {}) => new Promise((resolve, reject) => {
    let url = `${config.restUrl}/process?action=start&parts=all`
    if (bpdId) {
      url = `${url}&bpdId=${bpdId}`
    }
    if (options.snapshotId) {
      url = `${url}&snapshotId=${options.snapshotId}`
    } else if (options.branchId) {
      url = `${url}&branchId=${options.branchId}`
    } else if (options.processAppId) {
      url = `${url}&processAppId=${options.processAppId}`
    }
    if (parameters) {
      url = `${url}&params=${JSON.stringify(parameters)}`
    }
    request.post(url,
      buildConfig(config), buildResponseHandler(resolve, reject))
  }).then(response => {
    /* istanbul ignore else  */
    if (response && response.data) {
      response.data = filterProperties(response.data, INSTANCE_PROPERTIES)

      /* istanbul ignore else  */
      if (response.data.tasks) {
        response.data.tasks = response.data.tasks.map(item => filterProperties(item, TASK_PROPERTIES))
      }
    }
    return response
  }).catch(genericErrorHandler)
}
