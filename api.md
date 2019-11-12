## Classes

<dl>
<dt><a href="#BPMInstance">BPMInstance</a></dt>
<dd><p>Class that represents a BPM Instance</p>
</dd>
<dt><a href="#APIError">APIError</a></dt>
<dd><p>Class that represents an error response</p>
</dd>
<dt><a href="#APIResponse">APIResponse</a></dt>
<dd><p>Class that represents a success response</p>
</dd>
</dl>

## Objects

<dl>
<dt><a href="#ibpm-js">ibpm-js</a> : <code>object</code></dt>
<dd><p>Entry point for the library</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#GroupDetails">GroupDetails</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#GroupsGetByFilterAPIResponse">GroupsGetByFilterAPIResponse</a> : <code>object</code></dt>
<dd><p>Inherits <code>status</code> and <code>message</code> from <a href="#APIResponse">APIResponse</a> and overrides the <code>data</code> property</p>
</dd>
<dt><a href="#GroupsAPIResponse">GroupsAPIResponse</a> : <code>object</code></dt>
<dd><p>Inherits <code>status</code> and <code>message</code> from <a href="#APIResponse">APIResponse</a> and overrides the <code>data</code> property</p>
</dd>
<dt><a href="#InstanceDocument">InstanceDocument</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#TaskDetails">TaskDetails</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#InstanceDetails">InstanceDetails</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#MessageRequest">MessageRequest</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#MessageParameter">MessageParameter</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#MessageResponse">MessageResponse</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#RuntimeErrorFailedOperation">RuntimeErrorFailedOperation</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#RuntimeError">RuntimeError</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#RuntimeErrorResponse">RuntimeErrorResponse</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#ProcessInstanceAPIResponse">ProcessInstanceAPIResponse</a> : <code>object</code></dt>
<dd><p>Inherits <code>status</code> and <code>message</code> from <a href="#APIResponse">APIResponse</a> and overrides the <code>data</code> property</p>
</dd>
<dt><a href="#ProcessInstanceSendMessageAPIResponse">ProcessInstanceSendMessageAPIResponse</a> : <code>object</code></dt>
<dd><p>Inherits <code>status</code> and <code>message</code> from <a href="#APIResponse">APIResponse</a> and overrides the <code>data</code> property</p>
</dd>
<dt><a href="#UserDetails">UserDetails</a> : <code>object</code></dt>
<dd></dd>
<dt><a href="#UsersGetByFilterAPIResponse">UsersGetByFilterAPIResponse</a> : <code>object</code></dt>
<dd><p>Inherits <code>status</code> and <code>message</code> from <a href="#APIResponse">APIResponse</a> and overrides the <code>data</code> property</p>
</dd>
<dt><a href="#UsersGetByNameOrIdAPIResponse">UsersGetByNameOrIdAPIResponse</a> : <code>object</code></dt>
<dd><p>Inherits <code>status</code> and <code>message</code> from <a href="#APIResponse">APIResponse</a> and overrides the <code>data</code> property</p>
</dd>
<dt><a href="#UsersUpdatePreferenceAPIResponse">UsersUpdatePreferenceAPIResponse</a> : <code>object</code></dt>
<dd><p>Inherits <code>status</code> and <code>message</code> from <a href="#APIResponse">APIResponse</a> and overrides the <code>data</code> property</p>
</dd>
<dt><a href="#BPMInstanceConfig">BPMInstanceConfig</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#APIErrorDetails">APIErrorDetails</a> : <code>object</code></dt>
<dd></dd>
</dl>

<a name="BPMInstance"></a>

## BPMInstance
Class that represents a BPM Instance

**Kind**: global class  

* [BPMInstance](#BPMInstance)
    * [.groups](#BPMInstance.groups) : <code>object</code>
        * [.getByFilter(filter)](#BPMInstance.groups.getByFilter) ⇒ [<code>Promise.&lt;GroupsGetByFilterAPIResponse&gt;</code>](#GroupsGetByFilterAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
        * [.getByNameOrId(nameOrId)](#BPMInstance.groups.getByNameOrId) ⇒ [<code>Promise.&lt;GroupsAPIResponse&gt;</code>](#GroupsAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
        * [.addUser(groupNameOrId, userNameOrId)](#BPMInstance.groups.addUser) ⇒ [<code>Promise.&lt;GroupsAPIResponse&gt;</code>](#GroupsAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
        * [.removeUser(groupNameOrId, userNameOrId)](#BPMInstance.groups.removeUser) ⇒ [<code>Promise.&lt;GroupsAPIResponse&gt;</code>](#GroupsAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
        * [.addGroup(groupNameOrId, subGroupNameOrId)](#BPMInstance.groups.addGroup) ⇒ [<code>Promise.&lt;GroupsAPIResponse&gt;</code>](#GroupsAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
        * [.removeGroup(groupNameOrId, subGroupNameOrId)](#BPMInstance.groups.removeGroup) ⇒ [<code>Promise.&lt;GroupsAPIResponse&gt;</code>](#GroupsAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
    * [.users](#BPMInstance.users) : <code>object</code>
        * [.getByFilter(filter)](#BPMInstance.users.getByFilter) ⇒ [<code>Promise.&lt;UsersGetByFilterAPIResponse&gt;</code>](#UsersGetByFilterAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
        * [.getByNameOrId(usernameOrId)](#BPMInstance.users.getByNameOrId) ⇒ [<code>Promise.&lt;UsersGetByNameOrIdAPIResponse&gt;</code>](#UsersGetByNameOrIdAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
        * [.updatePreference(usernameOrId, key, value)](#BPMInstance.users.updatePreference) ⇒ [<code>Promise.&lt;UsersUpdatePreferenceAPIResponse&gt;</code>](#UsersUpdatePreferenceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
    * [.processInstance](#BPMInstance.processInstance) : <code>object</code>
        * [.getById(instanceId)](#BPMInstance.processInstance.getById) ⇒ [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
        * [.suspend(instanceId)](#BPMInstance.processInstance.suspend) ⇒ [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
        * [.resume(instanceId)](#BPMInstance.processInstance.resume) ⇒ [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
        * [.terminate(instanceId)](#BPMInstance.processInstance.terminate) ⇒ [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
        * [.retry(instanceId)](#BPMInstance.processInstance.retry) ⇒ [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
        * [.delete(instanceId)](#BPMInstance.processInstance.delete) ⇒ [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
        * [.fireTimer(instanceId)](#BPMInstance.processInstance.fireTimer) ⇒ [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
        * [.deleteToken(instanceId)](#BPMInstance.processInstance.deleteToken) ⇒ [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
        * [.moveToken(instanceId)](#BPMInstance.processInstance.moveToken) ⇒ [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
        * [.getRuntimeErrors(instanceIds)](#BPMInstance.processInstance.getRuntimeErrors) ⇒ [<code>Promise.&lt;RuntimeErrorResponse&gt;</code>](#RuntimeErrorResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
        * [.sendMessage(message, parameters)](#BPMInstance.processInstance.sendMessage) ⇒ [<code>Promise.&lt;ProcessInstanceSendMessageAPIResponse&gt;</code>](#ProcessInstanceSendMessageAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)

<a name="BPMInstance.groups"></a>

### BPMInstance.groups : <code>object</code>
**Kind**: static namespace of [<code>BPMInstance</code>](#BPMInstance)  

* [.groups](#BPMInstance.groups) : <code>object</code>
    * [.getByFilter(filter)](#BPMInstance.groups.getByFilter) ⇒ [<code>Promise.&lt;GroupsGetByFilterAPIResponse&gt;</code>](#GroupsGetByFilterAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
    * [.getByNameOrId(nameOrId)](#BPMInstance.groups.getByNameOrId) ⇒ [<code>Promise.&lt;GroupsAPIResponse&gt;</code>](#GroupsAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
    * [.addUser(groupNameOrId, userNameOrId)](#BPMInstance.groups.addUser) ⇒ [<code>Promise.&lt;GroupsAPIResponse&gt;</code>](#GroupsAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
    * [.removeUser(groupNameOrId, userNameOrId)](#BPMInstance.groups.removeUser) ⇒ [<code>Promise.&lt;GroupsAPIResponse&gt;</code>](#GroupsAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
    * [.addGroup(groupNameOrId, subGroupNameOrId)](#BPMInstance.groups.addGroup) ⇒ [<code>Promise.&lt;GroupsAPIResponse&gt;</code>](#GroupsAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
    * [.removeGroup(groupNameOrId, subGroupNameOrId)](#BPMInstance.groups.removeGroup) ⇒ [<code>Promise.&lt;GroupsAPIResponse&gt;</code>](#GroupsAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)

<a name="BPMInstance.groups.getByFilter"></a>

#### groups.getByFilter(filter) ⇒ [<code>Promise.&lt;GroupsGetByFilterAPIResponse&gt;</code>](#GroupsGetByFilterAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
Get a list of groups by providing a search filter.

**Kind**: static method of [<code>groups</code>](#BPMInstance.groups)  
**Returns**: [<code>Promise.&lt;GroupsGetByFilterAPIResponse&gt;</code>](#GroupsGetByFilterAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError) - a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.  

| Param | Type | Description |
| --- | --- | --- |
| filter | <code>string</code> | A simple regular expression to be used to filter the list of groups returned. Example: `tw_*` returns all groupa whose names begin with `tw_` |

<a name="BPMInstance.groups.getByNameOrId"></a>

#### groups.getByNameOrId(nameOrId) ⇒ [<code>Promise.&lt;GroupsAPIResponse&gt;</code>](#GroupsAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
Get a group details.

**Kind**: static method of [<code>groups</code>](#BPMInstance.groups)  
**Returns**: [<code>Promise.&lt;GroupsAPIResponse&gt;</code>](#GroupsAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError) - a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.  

| Param | Type | Description |
| --- | --- | --- |
| nameOrId | <code>string</code> | Group name or ID |

<a name="BPMInstance.groups.addUser"></a>

#### groups.addUser(groupNameOrId, userNameOrId) ⇒ [<code>Promise.&lt;GroupsAPIResponse&gt;</code>](#GroupsAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
Add a user to a group.

**Kind**: static method of [<code>groups</code>](#BPMInstance.groups)  
**Returns**: [<code>Promise.&lt;GroupsAPIResponse&gt;</code>](#GroupsAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError) - a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.  

| Param | Type | Description |
| --- | --- | --- |
| groupNameOrId | <code>string</code> | Group name or ID |
| userNameOrId | <code>string</code> | User name or ID |

<a name="BPMInstance.groups.removeUser"></a>

#### groups.removeUser(groupNameOrId, userNameOrId) ⇒ [<code>Promise.&lt;GroupsAPIResponse&gt;</code>](#GroupsAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
Remove a user from a group.

**Kind**: static method of [<code>groups</code>](#BPMInstance.groups)  
**Returns**: [<code>Promise.&lt;GroupsAPIResponse&gt;</code>](#GroupsAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError) - a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.  

| Param | Type | Description |
| --- | --- | --- |
| groupNameOrId | <code>string</code> | Group name or ID |
| userNameOrId | <code>string</code> | User name or ID |

<a name="BPMInstance.groups.addGroup"></a>

#### groups.addGroup(groupNameOrId, subGroupNameOrId) ⇒ [<code>Promise.&lt;GroupsAPIResponse&gt;</code>](#GroupsAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
Add a group to another group.

**Kind**: static method of [<code>groups</code>](#BPMInstance.groups)  
**Returns**: [<code>Promise.&lt;GroupsAPIResponse&gt;</code>](#GroupsAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError) - a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.  

| Param | Type | Description |
| --- | --- | --- |
| groupNameOrId | <code>string</code> | Group name or ID |
| subGroupNameOrId | <code>string</code> | Sub Group name or ID |

<a name="BPMInstance.groups.removeGroup"></a>

#### groups.removeGroup(groupNameOrId, subGroupNameOrId) ⇒ [<code>Promise.&lt;GroupsAPIResponse&gt;</code>](#GroupsAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
Remove a group from another group.

**Kind**: static method of [<code>groups</code>](#BPMInstance.groups)  
**Returns**: [<code>Promise.&lt;GroupsAPIResponse&gt;</code>](#GroupsAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError) - a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.  

| Param | Type | Description |
| --- | --- | --- |
| groupNameOrId | <code>string</code> | Group name or ID |
| subGroupNameOrId | <code>string</code> | Sub Group name or ID |

<a name="BPMInstance.users"></a>

### BPMInstance.users : <code>object</code>
**Kind**: static namespace of [<code>BPMInstance</code>](#BPMInstance)  

* [.users](#BPMInstance.users) : <code>object</code>
    * [.getByFilter(filter)](#BPMInstance.users.getByFilter) ⇒ [<code>Promise.&lt;UsersGetByFilterAPIResponse&gt;</code>](#UsersGetByFilterAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
    * [.getByNameOrId(usernameOrId)](#BPMInstance.users.getByNameOrId) ⇒ [<code>Promise.&lt;UsersGetByNameOrIdAPIResponse&gt;</code>](#UsersGetByNameOrIdAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
    * [.updatePreference(usernameOrId, key, value)](#BPMInstance.users.updatePreference) ⇒ [<code>Promise.&lt;UsersUpdatePreferenceAPIResponse&gt;</code>](#UsersUpdatePreferenceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)

<a name="BPMInstance.users.getByFilter"></a>

#### users.getByFilter(filter) ⇒ [<code>Promise.&lt;UsersGetByFilterAPIResponse&gt;</code>](#UsersGetByFilterAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
Get a list of users by providing a search filter.

**Kind**: static method of [<code>users</code>](#BPMInstance.users)  
**Returns**: [<code>Promise.&lt;UsersGetByFilterAPIResponse&gt;</code>](#UsersGetByFilterAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError) - a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.  

| Param | Type | Description |
| --- | --- | --- |
| filter | <code>string</code> | A simple regular expression to be used to filter the list of users returned. Example: `tw_*` returns all users whose names begin with `tw_` |

<a name="BPMInstance.users.getByNameOrId"></a>

#### users.getByNameOrId(usernameOrId) ⇒ [<code>Promise.&lt;UsersGetByNameOrIdAPIResponse&gt;</code>](#UsersGetByNameOrIdAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
Get a user details.

**Kind**: static method of [<code>users</code>](#BPMInstance.users)  
**Returns**: [<code>Promise.&lt;UsersGetByNameOrIdAPIResponse&gt;</code>](#UsersGetByNameOrIdAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError) - a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.  

| Param | Type | Description |
| --- | --- | --- |
| usernameOrId | <code>string</code> | User name or ID |

<a name="BPMInstance.users.updatePreference"></a>

#### users.updatePreference(usernameOrId, key, value) ⇒ [<code>Promise.&lt;UsersUpdatePreferenceAPIResponse&gt;</code>](#UsersUpdatePreferenceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
Update a user preference.

**Kind**: static method of [<code>users</code>](#BPMInstance.users)  
**Returns**: [<code>Promise.&lt;UsersUpdatePreferenceAPIResponse&gt;</code>](#UsersUpdatePreferenceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError) - a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.  

| Param | Type | Description |
| --- | --- | --- |
| usernameOrId | <code>string</code> | User name or ID |
| key | <code>string</code> | Attribute key |
| value | <code>string</code> | Attribute value |

<a name="BPMInstance.processInstance"></a>

### BPMInstance.processInstance : <code>object</code>
**Kind**: static namespace of [<code>BPMInstance</code>](#BPMInstance)  

* [.processInstance](#BPMInstance.processInstance) : <code>object</code>
    * [.getById(instanceId)](#BPMInstance.processInstance.getById) ⇒ [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
    * [.suspend(instanceId)](#BPMInstance.processInstance.suspend) ⇒ [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
    * [.resume(instanceId)](#BPMInstance.processInstance.resume) ⇒ [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
    * [.terminate(instanceId)](#BPMInstance.processInstance.terminate) ⇒ [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
    * [.retry(instanceId)](#BPMInstance.processInstance.retry) ⇒ [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
    * [.delete(instanceId)](#BPMInstance.processInstance.delete) ⇒ [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
    * [.fireTimer(instanceId)](#BPMInstance.processInstance.fireTimer) ⇒ [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
    * [.deleteToken(instanceId)](#BPMInstance.processInstance.deleteToken) ⇒ [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
    * [.moveToken(instanceId)](#BPMInstance.processInstance.moveToken) ⇒ [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
    * [.getRuntimeErrors(instanceIds)](#BPMInstance.processInstance.getRuntimeErrors) ⇒ [<code>Promise.&lt;RuntimeErrorResponse&gt;</code>](#RuntimeErrorResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
    * [.sendMessage(message, parameters)](#BPMInstance.processInstance.sendMessage) ⇒ [<code>Promise.&lt;ProcessInstanceSendMessageAPIResponse&gt;</code>](#ProcessInstanceSendMessageAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)

<a name="BPMInstance.processInstance.getById"></a>

#### processInstance.getById(instanceId) ⇒ [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
Get a process instance details.

**Kind**: static method of [<code>processInstance</code>](#BPMInstance.processInstance)  
**Returns**: [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError) - a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.  

| Param | Type | Description |
| --- | --- | --- |
| instanceId | <code>string</code> | Instance ID |

<a name="BPMInstance.processInstance.suspend"></a>

#### processInstance.suspend(instanceId) ⇒ [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
Suspend a process instance.

**Kind**: static method of [<code>processInstance</code>](#BPMInstance.processInstance)  
**Returns**: [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError) - a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.  

| Param | Type | Description |
| --- | --- | --- |
| instanceId | <code>string</code> | Instance ID |

<a name="BPMInstance.processInstance.resume"></a>

#### processInstance.resume(instanceId) ⇒ [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
Resume a process instance.

**Kind**: static method of [<code>processInstance</code>](#BPMInstance.processInstance)  
**Returns**: [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError) - a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.  

| Param | Type | Description |
| --- | --- | --- |
| instanceId | <code>string</code> | Instance ID |

<a name="BPMInstance.processInstance.terminate"></a>

#### processInstance.terminate(instanceId) ⇒ [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
Terminate a process instance.

**Kind**: static method of [<code>processInstance</code>](#BPMInstance.processInstance)  
**Returns**: [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError) - a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.  

| Param | Type | Description |
| --- | --- | --- |
| instanceId | <code>string</code> | Instance ID |

<a name="BPMInstance.processInstance.retry"></a>

#### processInstance.retry(instanceId) ⇒ [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
Retry a process instance.

**Kind**: static method of [<code>processInstance</code>](#BPMInstance.processInstance)  
**Returns**: [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError) - a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.  

| Param | Type | Description |
| --- | --- | --- |
| instanceId | <code>string</code> | Instance ID |

<a name="BPMInstance.processInstance.delete"></a>

#### processInstance.delete(instanceId) ⇒ [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
Delete a process instance.

**Kind**: static method of [<code>processInstance</code>](#BPMInstance.processInstance)  
**Returns**: [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError) - a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.  

| Param | Type | Description |
| --- | --- | --- |
| instanceId | <code>string</code> | Instance ID |

<a name="BPMInstance.processInstance.fireTimer"></a>

#### processInstance.fireTimer(instanceId) ⇒ [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
Fire a process instance timer.

**Kind**: static method of [<code>processInstance</code>](#BPMInstance.processInstance)  
**Returns**: [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError) - a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.  

| Param | Type | Description |
| --- | --- | --- |
| instanceId | <code>string</code> | Instance ID |

<a name="BPMInstance.processInstance.deleteToken"></a>

#### processInstance.deleteToken(instanceId) ⇒ [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
Delete a process instance token.

**Kind**: static method of [<code>processInstance</code>](#BPMInstance.processInstance)  
**Returns**: [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError) - a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.  

| Param | Type | Description |
| --- | --- | --- |
| instanceId | <code>string</code> | Instance ID |

<a name="BPMInstance.processInstance.moveToken"></a>

#### processInstance.moveToken(instanceId) ⇒ [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
Move a process instance token.

**Kind**: static method of [<code>processInstance</code>](#BPMInstance.processInstance)  
**Returns**: [<code>Promise.&lt;ProcessInstanceAPIResponse&gt;</code>](#ProcessInstanceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError) - a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.  

| Param | Type | Description |
| --- | --- | --- |
| instanceId | <code>string</code> | Instance ID |

<a name="BPMInstance.processInstance.getRuntimeErrors"></a>

#### processInstance.getRuntimeErrors(instanceIds) ⇒ [<code>Promise.&lt;RuntimeErrorResponse&gt;</code>](#RuntimeErrorResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
Get a list of runtime errors.

**Kind**: static method of [<code>processInstance</code>](#BPMInstance.processInstance)  
**Returns**: [<code>Promise.&lt;RuntimeErrorResponse&gt;</code>](#RuntimeErrorResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError) - a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.  

| Param | Type | Description |
| --- | --- | --- |
| instanceIds | <code>Array.&lt;string&gt;</code> | List of IDs to get errors for |

<a name="BPMInstance.processInstance.sendMessage"></a>

#### processInstance.sendMessage(message, parameters) ⇒ [<code>Promise.&lt;ProcessInstanceSendMessageAPIResponse&gt;</code>](#ProcessInstanceSendMessageAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
Send a message to IBM BPM (for UCA triggering).

**Kind**: static method of [<code>processInstance</code>](#BPMInstance.processInstance)  
**Returns**: [<code>Promise.&lt;ProcessInstanceSendMessageAPIResponse&gt;</code>](#ProcessInstanceSendMessageAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError) - a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.  

| Param | Type | Description |
| --- | --- | --- |
| message | [<code>MessageRequest</code>](#MessageRequest) | Message to send |
| parameters | [<code>Array.&lt;MessageParameter&gt;</code>](#MessageParameter) | List of parameters to send with the message |

<a name="APIError"></a>

## APIError
Class that represents an error response

**Kind**: global class  
<a name="new_APIError_new"></a>

### new APIError(message, status, data)
Class constructor


| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | message that is a text representation of the status property |
| status | <code>number</code> | HTTP status code for the response (will be at least 400) |
| data | [<code>APIErrorDetails</code>](#APIErrorDetails) | data concerning the error itself |

<a name="APIResponse"></a>

## APIResponse
Class that represents a success response

**Kind**: global class  
<a name="new_APIResponse_new"></a>

### new APIResponse(message, status, data)
Class constructor


| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | message that is a text representation of the status property |
| status | <code>number</code> | HTTP status code for the response (will be between 200 and 399) |
| data | <code>\*</code> | data concerning the response itself |

<a name="ibpm-js"></a>

## ibpm-js : <code>object</code>
Entry point for the library

**Kind**: global namespace  
<a name="ibpm-js.createInstance"></a>

### ibpm-js.createInstance(config) ⇒ [<code>BPMInstance</code>](#BPMInstance)
Method to get or create a workspace

**Kind**: static method of [<code>ibpm-js</code>](#ibpm-js)  
**Returns**: [<code>BPMInstance</code>](#BPMInstance) - Object that represents the BPM Instance, and that will have all the available methods  

| Param | Type | Description |
| --- | --- | --- |
| config | [<code>BPMInstanceConfig</code>](#BPMInstanceConfig) | BPM Instance configuration object. This will set the properties needed to establish a connection to the IBM BPM server |

<a name="GroupDetails"></a>

## GroupDetails : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| groupID | <code>number</code> | Group internal ID |
| groupName | <code>string</code> | Group name |
| displayName | <code>string</code> | Group display name |
| description | <code>string</code> | Group description |
| members | <code>Array.&lt;String&gt;</code> | List of members of the group |
| managerGroupName | <code>string</code> | Name of the group that is the manager of this group |

<a name="GroupsGetByFilterAPIResponse"></a>

## GroupsGetByFilterAPIResponse : <code>object</code>
Inherits `status` and `message` from [APIResponse](#APIResponse) and overrides the `data` property

**Kind**: global typedef  
**Extends**: [<code>APIResponse</code>](#APIResponse)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| data | [<code>Array.&lt;GroupDetails&gt;</code>](#GroupDetails) | list of groups |

<a name="GroupsAPIResponse"></a>

## GroupsAPIResponse : <code>object</code>
Inherits `status` and `message` from [APIResponse](#APIResponse) and overrides the `data` property

**Kind**: global typedef  
**Extends**: [<code>APIResponse</code>](#APIResponse)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| data | [<code>GroupDetails</code>](#GroupDetails) | group details |

<a name="InstanceDocument"></a>

## InstanceDocument : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| ID | <code>string</code> | Document internal ID |
| ecmID | <code>string</code> | Document ECM identifier |
| type | <code>string</code> | Document type |
| name | <code>string</code> | Document name |
| date | <code>date</code> | Document creation date |
| length | <code>number</code> | Document size |
| url | <code>string</code> | Document URL |
| version | <code>number</code> | Document version |

<a name="TaskDetails"></a>

## TaskDetails : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| tkiid | <code>string</code> | Task internal ID |
| activationTime | <code>date</code> | Date the task instance is set into the ready state |
| atRiskTime | <code>date</code> | Date the task instance is at risk |
| completionTime | <code>date</code> | Date when the task instance reached an end state |
| dueTime | <code>date</code> | Date when the task is due |
| lastModificationTime | <code>date</code> | The latest date at which the task was created, started or completed |
| startTime | <code>date</code> | Date when the task was claimed or when an invocation task enters the running state |
| assignedToID | <code>number</code> | Task owner ID |
| assignedTo | <code>string</code> | Task owner |
| assignedToDisplayName | <code>string</code> | Task owner display name |
| assignedToType | <code>string</code> | Identifies if the task is assigned to a user or group |
| teamID | <code>number</code> | The ID of the assigned team. When `assignedToType` is `group`, it is the same as `assignedToID` |
| teamName | <code>string</code> | The name of the assigned team. When `assignedToType` is `group`, it is the same as `assignedTo` |
| teamDisplayName | <code>string</code> | The display name of the assigned team. When `assignedToType` is `group`, it is the same as `assignedToDisplayName` |
| managerTeamID | <code>number</code> | The ID of the manager team |
| managerTeamName | <code>string</code> | The name of the manager team |
| managerTeamDisplayName | <code>string</code> | The display name of the manager team |
| data | <code>object</code> | Task instance data |
| processData | <code>object</code> | Data of the process instance containing the task |
| description | <code>string</code> | Task description |
| displayName | <code>string</code> | Task display name |
| externalActivityID | <code>string</code> | ID of the external activity |
| externalActivitySnapshotID | <code>string</code> | Snapshot ID of the external implementation |
| kind | <code>string</code> | Task kind |
| name | <code>string</code> | Task name |
| originator | <code>string</code> | ID of the user that created the task instance or on whose behalf the task instance was created |
| owner | <code>string</code> | Task owner |
| priority | <code>number</code> | Task priority level |
| priorityName | <code>string</code> | Task priority description |
| state | <code>string</code> | Task state |
| status | <code>string</code> | Task status |
| serviceID | <code>string</code> | If the task is a service, this field contains the service's ID |
| serviceSnapshotID | <code>string</code> | Snapshot ID of the external implementation |
| flowObjectID | <code>string</code> | ID of flow object |
| nextTaskId | <code>number</code> | Next task ID |
| actions | <code>Array.&lt;string&gt;</code> | List of available actions for the task instance |

<a name="InstanceDetails"></a>

## InstanceDetails : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| piid | <code>string</code> | Instance internal ID |
| name | <code>string</code> | Instance name |
| description | <code>string</code> | Instance description |
| starterId | <code>string</code> | User ID that created this instance |
| creationTime | <code>date</code> | Instance creation date |
| lastModificationTime | <code>date</code> | Instance last modification date |
| dueDate | <code>date</code> | Instance due date |
| executionState | <code>string</code> | Instance execution state description |
| state | <code>string</code> | Instance execution state code |
| processAppID | <code>string</code> | Process Application ID that this instance belongs to |
| processAppAcronym | <code>string</code> | Process Application Acronym that this instance belongs to |
| processAppName | <code>string</code> | Process Application Name that this instance belongs to |
| snapshotID | <code>string</code> | Snapshot ID that this instance belongs to |
| snapshotName | <code>string</code> | Snapshot name that this instance belongs to |
| snapshotTip | <code>boolean</code> | `true` if the instance snapshot is the tip snapshot and `false` otherwise |
| branchID | <code>string</code> | Branch ID that this instance belongs to |
| branchName | <code>string</code> | Branch Name that this instance belongs to |
| processTemplateID | <code>string</code> | Process Template ID that originated this instance |
| processTemplateName | <code>string</code> | Process Template Name that originated this instance |
| data | <code>string</code> | Instance data in a string representation |
| businessData | <code>Array.&lt;Object&gt;</code> | Business data defined for the instance, including name, alias, type and value |
| variables | <code>object</code> | Variable values in a json object |
| actions | <code>Array.&lt;string&gt;</code> | List of available actions for the process instance |
| executionTree | <code>object</code> | Execution tree associated with the process |
| diagram | <code>object</code> | BPD diagram of this instance, including existing tokens and associated task for the instance |
| documents | [<code>Array.&lt;InstanceDocument&gt;</code>](#InstanceDocument) | List of instance documents |
| tasks | [<code>Array.&lt;TaskDetails&gt;</code>](#TaskDetails) | List of instance tasks |

<a name="MessageRequest"></a>

## MessageRequest : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| processApp | <code>string</code> | Process Application acronym |
| eventName | <code>string</code> | Event identifier |
| [ucaName] | <code>string</code> | UCA Name |
| [snapshot] | <code>string</code> | Snapshot name. If you do not include the snapshot name in the message, the Event Manager uses the default snapshot on the target Process Server for start message events. For intermediate message events, if you do not include the snapshot name in the message, all active snapshots receive events. |
| [queue] | <code>string</code> | The name of the queue for the event to run in |

<a name="MessageParameter"></a>

## MessageParameter : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | parameter key |
| value | <code>string</code> | parameter value |

<a name="MessageResponse"></a>

## MessageResponse : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| messageSent | <code>boolean</code> | `true` if the message was sent successfully and `false` otherwise |

<a name="RuntimeErrorFailedOperation"></a>

## RuntimeErrorFailedOperation : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| instanceId | <code>string</code> | Instance internal ID |
| errorMessage | <code>string</code> | Error message |

<a name="RuntimeError"></a>

## RuntimeError : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| instanceId | <code>string</code> | Instance internal ID |
| taskId | <code>string</code> | Task internal ID |
| errorMessage | <code>string</code> | Error message |
| errorCode | <code>string</code> | Error code |
| javaTrace | <code>string</code> | Java trace |
| jsTrace | <code>string</code> | JS trace |
| twTrace | <code>string</code> | TW trace |
| timestamp | <code>date</code> | Error date |
| branchId | <code>string</code> | Branch internal ID |
| snapshotId | <code>string</code> | Snapshot internal ID |

<a name="RuntimeErrorResponse"></a>

## RuntimeErrorResponse : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| failedOperations | [<code>Array.&lt;RuntimeErrorFailedOperation&gt;</code>](#RuntimeErrorFailedOperation) | List of failed operations |
| runtimeErrors | [<code>Array.&lt;RuntimeError&gt;</code>](#RuntimeError) | List of runtime errors |

<a name="ProcessInstanceAPIResponse"></a>

## ProcessInstanceAPIResponse : <code>object</code>
Inherits `status` and `message` from [APIResponse](#APIResponse) and overrides the `data` property

**Kind**: global typedef  
**Extends**: [<code>APIResponse</code>](#APIResponse)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| data | [<code>InstanceDetails</code>](#InstanceDetails) | instance details |

<a name="ProcessInstanceSendMessageAPIResponse"></a>

## ProcessInstanceSendMessageAPIResponse : <code>object</code>
Inherits `status` and `message` from [APIResponse](#APIResponse) and overrides the `data` property

**Kind**: global typedef  
**Extends**: [<code>APIResponse</code>](#APIResponse)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| data | [<code>MessageResponse</code>](#MessageResponse) | message status |

<a name="UserDetails"></a>

## UserDetails : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| userID | <code>number</code> | User internal ID |
| userName | <code>string</code> | User name |
| fullName | <code>string</code> | User full name |
| emailAddress | <code>string</code> | User email address |
| userPreferences | <code>object</code> | User attributes. Each key represents the attribute's name, and the corresponding value represents the attribute's value |
| memberships | <code>Array.&lt;string&gt;</code> | List of groups that this user belongs to |

<a name="UsersGetByFilterAPIResponse"></a>

## UsersGetByFilterAPIResponse : <code>object</code>
Inherits `status` and `message` from [APIResponse](#APIResponse) and overrides the `data` property

**Kind**: global typedef  
**Extends**: [<code>APIResponse</code>](#APIResponse)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| data | [<code>Array.&lt;UserDetails&gt;</code>](#UserDetails) | list of users |

<a name="UsersGetByNameOrIdAPIResponse"></a>

## UsersGetByNameOrIdAPIResponse : <code>object</code>
Inherits `status` and `message` from [APIResponse](#APIResponse) and overrides the `data` property

**Kind**: global typedef  
**Extends**: [<code>APIResponse</code>](#APIResponse)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| data | [<code>UserDetails</code>](#UserDetails) | user details |

<a name="UsersUpdatePreferenceAPIResponse"></a>

## UsersUpdatePreferenceAPIResponse : <code>object</code>
Inherits `status` and `message` from [APIResponse](#APIResponse) and overrides the `data` property

**Kind**: global typedef  
**Extends**: [<code>APIResponse</code>](#APIResponse)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| data | [<code>UserDetails</code>](#UserDetails) | user details updated with the new attribute values |

<a name="BPMInstanceConfig"></a>

## BPMInstanceConfig : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| protocol | <code>string</code> | <code>&quot;https&quot;</code> | Protocol (HTTP/HTTPS) |
| hostname | <code>string</code> |  | Hostname of the IBM BPM server |
| port | <code>string</code> | <code>9443</code> | Port Number |
| context | <code>string</code> |  | Additional URL content |
| username | <code>string</code> | <code>&quot;bpmadmin&quot;</code> | Username |
| password | <code>string</code> | <code>&quot;bpmadmin&quot;</code> | Password |

<a name="APIErrorDetails"></a>

## APIErrorDetails : <code>object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| errorNumber | <code>string</code> | IBM BPM error code |
| errorMessage | <code>string</code> | IBM BPM error description |

