[![Build Status](https://travis-ci.org/tigermarques/ibpm-js.svg?branch=master)](https://travis-ci.org/tigermarques/ibpm-js)
[![codecov](https://codecov.io/gh/tigermarques/ibpm-js/branch/master/graph/badge.svg)](https://codecov.io/gh/tigermarques/ibpm-js)
![npm](https://img.shields.io/npm/v/ibpm-js?color=green&label=npm%20package)

# ibpm-js
ibpm-js is a library built for interacting with IBM BPM REST API.

## Motivation
IBM BPM has a comprehensive REST API that allows to perform a lot of actions. However, the API documentation is not very complete, and there are not any client libraries for making this interaction easy and simple.

This tool aims to create a simple interface for dealing with this REST API, taking care of input and output transformation, as well as some basic error handling.

## Getting Started

### Installing

Use `npm` or `yarn` to install this library

```
npm install ibpm-js

yarn install ibpm-js
```

### Quick Examples

To get started using the library you can use the available public methods:

```javascript
const ibpm = require('ibpm-js')

const bpmInstance = ibpm.createInstance({
  protocol: 'https',
  hostname: '',
  port: '9443',
  context: '',
  username: 'bpmadmin',
  password: 'bpmadmin'
})

...

// retrieve details for a specific process instance
const details = await bpmInstance.processInstance.getById(1234)
console.log(details)
/* Output:
{
  "status": 200,
  "message": "OK",
  "data": {
    "creationTime": "2019-03-29T16:03:25Z",
    "data": "",
    "description": "",
    "richDescription": "",
    "executionState": "Active",
    "state": "STATE_RUNNING",
    "lastModificationTime": "2019-03-30T19:54:51Z",
    "name": "My Instance Name",
    "piid": "23972",
    ...
  }
}
*/

// send a message to trigger an UCA
const result = await bpmInstance.processInstance.sendMessage({
  processApp: 'MYAPP',
  ucaName: 'UCA1'
}, [{
  key: 'param1',
  value: 'value1'
}])
console.log(result)
/* Output:
{
  "status": 200,
  "message": "OK",
  "data": {
    "messageSent": true
  }
}
*/

// get user details
const userDetails = await bpmInstance.users.getByNameOrId('bpmadmin')
console.log(userDetails)
/* Output:
{
  "status": 200,
  "message": "OK"
  "data": {
    "userID": 9,
    "userName": "bpmadmin",
    "fullName": "bpmadmin",
    "isDisabled": false,
    "primaryGroup": null,
    "emailAddress": "email@domain.com",
    "userPreferences": {
      "Task Email Address": "email@domain.com",
      ...
    },
    "editableUserPreferences": null,
    "tasksCollaboration": null,
    "memberships": [
      "tw_authors",
      "tw_allusers",
      ...
    ]
  }
}

*/
```

## API

For the full API, please visit [this page](api.md)

## Developing

PR as welcome to this project. If you have a new feature that you would like to see in the library, please open an issue for discussion before the PR.

### Running Tests

To run the full test suite, simply run

```
npm test
```

To check for code style, run

```
npm run lint
```

### Generating Documentation

Documentation for the project is done with `jsdoc`. If you update any code that requires documentation update, please do so and update the `api.md` file using the command

```
npm run docs
```

### Versioning

This project follows the [Semantic Versioning 2.0.0](https://semver.org/) guide. Version numbering is handled by the package `semantic-release`. Therefore, never update the `version` field in the `package.json` file.

### Commit Messages

This project follows the [Angular Commit Message Guidelines](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits). To help creating compliant commit messages, please use the `npm run commit` command and follow the instructions.

## Roadmap

To be defined...

## Licence

The code in this project is licensed under MIT license.
## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/tigermarques"><img src="https://avatars0.githubusercontent.com/u/15315098?v=4" width="100px;" alt="João Marques"/><br /><sub><b>João Marques</b></sub></a><br /><a href="https://github.com/tigermarques/twx-parse/commits?author=tigermarques" title="Code">💻</a> <a href="https://github.com/tigermarques/twx-parse/commits?author=tigermarques" title="Documentation">📖</a> <a href="#example-tigermarques" title="Examples">💡</a> <a href="#projectManagement-tigermarques" title="Project Management">📆</a> <a href="https://github.com/tigermarques/twx-parse/commits?author=tigermarques" title="Tests">⚠️</a></td>
  </tr>
</table>
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!