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
<dt><a href="#GroupsGetByNameOrIdAPIResponse">GroupsGetByNameOrIdAPIResponse</a> : <code>object</code></dt>
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
        * [.getByNameOrId(nameOrId)](#BPMInstance.groups.getByNameOrId) ⇒ [<code>Promise.&lt;GroupsGetByNameOrIdAPIResponse&gt;</code>](#GroupsGetByNameOrIdAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
    * [.users](#BPMInstance.users) : <code>object</code>
        * [.getByFilter(filter)](#BPMInstance.users.getByFilter) ⇒ [<code>Promise.&lt;UsersGetByFilterAPIResponse&gt;</code>](#UsersGetByFilterAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
        * [.getByNameOrId(usernameOrId)](#BPMInstance.users.getByNameOrId) ⇒ [<code>Promise.&lt;UsersGetByNameOrIdAPIResponse&gt;</code>](#UsersGetByNameOrIdAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
        * [.updatePreference(usernameOrId, key, value)](#BPMInstance.users.updatePreference) ⇒ [<code>Promise.&lt;UsersUpdatePreferenceAPIResponse&gt;</code>](#UsersUpdatePreferenceAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)

<a name="BPMInstance.groups"></a>

### BPMInstance.groups : <code>object</code>
Prop namespace

**Kind**: static namespace of [<code>BPMInstance</code>](#BPMInstance)  

* [.groups](#BPMInstance.groups) : <code>object</code>
    * [.getByFilter(filter)](#BPMInstance.groups.getByFilter) ⇒ [<code>Promise.&lt;GroupsGetByFilterAPIResponse&gt;</code>](#GroupsGetByFilterAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
    * [.getByNameOrId(nameOrId)](#BPMInstance.groups.getByNameOrId) ⇒ [<code>Promise.&lt;GroupsGetByNameOrIdAPIResponse&gt;</code>](#GroupsGetByNameOrIdAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)

<a name="BPMInstance.groups.getByFilter"></a>

#### groups.getByFilter(filter) ⇒ [<code>Promise.&lt;GroupsGetByFilterAPIResponse&gt;</code>](#GroupsGetByFilterAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
Get a list of groups by providing a search filter.

**Kind**: static method of [<code>groups</code>](#BPMInstance.groups)  
**Returns**: [<code>Promise.&lt;GroupsGetByFilterAPIResponse&gt;</code>](#GroupsGetByFilterAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError) - a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.  

| Param | Type | Description |
| --- | --- | --- |
| filter | <code>string</code> | A simple regular expression to be used to filter the list of groups returned. Example: `tw_*` returns all groupa whose names begin with `tw_` |

<a name="BPMInstance.groups.getByNameOrId"></a>

#### groups.getByNameOrId(nameOrId) ⇒ [<code>Promise.&lt;GroupsGetByNameOrIdAPIResponse&gt;</code>](#GroupsGetByNameOrIdAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError)
Get a group details.

**Kind**: static method of [<code>groups</code>](#BPMInstance.groups)  
**Returns**: [<code>Promise.&lt;GroupsGetByNameOrIdAPIResponse&gt;</code>](#GroupsGetByNameOrIdAPIResponse) \| [<code>Promise.&lt;APIError&gt;</code>](#APIError) - a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.  

| Param | Type | Description |
| --- | --- | --- |
| nameOrId | <code>string</code> | Group name or ID |

<a name="BPMInstance.users"></a>

### BPMInstance.users : <code>object</code>
Prop namespace

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

<a name="GroupsGetByNameOrIdAPIResponse"></a>

## GroupsGetByNameOrIdAPIResponse : <code>object</code>
Inherits `status` and `message` from [APIResponse](#APIResponse) and overrides the `data` property

**Kind**: global typedef  
**Extends**: [<code>APIResponse</code>](#APIResponse)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| data | [<code>GroupDetails</code>](#GroupDetails) | group details |

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

