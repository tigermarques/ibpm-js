import request from 'request-promise'

export const groups = filter => {
  return request.get(`https://acfinmdwbpmq01.atlantico.int:9444/rest/bpm/wle/v1/groups?filter=${filter}&includeDeleted=false&parts=all`, {
    auth: {
      username: 't99kmg07',
      password: 'Angola1234'
    },
    headers: {
      'Content-Type': 'application/json'
    },
    json: true
  })
}
