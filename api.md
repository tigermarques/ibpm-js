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
<dt><a href="#Group">Group</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#GroupsGetByFilterAPIResponse">GroupsGetByFilterAPIResponse</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#BPMInstanceConfig">BPMInstanceConfig</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="BPMInstance"></a>

## BPMInstance
Class that represents a BPM Instance

**Kind**: global class  

* [BPMInstance](#BPMInstance)
    * [.groups](#BPMInstance.groups) : <code>object</code>
        * [.getByFilter(filter)](#BPMInstance.groups.getByFilter) ⇒ <code>Promise.&lt;(GroupsGetByFilterAPIResponse\|APIError)&gt;</code>

<a name="BPMInstance.groups"></a>

### BPMInstance.groups : <code>object</code>
Prop namespace

**Kind**: static namespace of [<code>BPMInstance</code>](#BPMInstance)  
<a name="BPMInstance.groups.getByFilter"></a>

#### groups.getByFilter(filter) ⇒ <code>Promise.&lt;(GroupsGetByFilterAPIResponse\|APIError)&gt;</code>
Get a list of users by providing a search filter.

**Kind**: static method of [<code>groups</code>](#BPMInstance.groups)  
**Returns**: <code>Promise.&lt;(GroupsGetByFilterAPIResponse\|APIError)&gt;</code> - a `Promise` that will be resolved if the request is successful, or rejected if any error occurs.  

| Param | Type | Description |
| --- | --- | --- |
| filter | <code>string</code> | A simple regular expression to be used to filter the list of users returned. Example: tw_* returns all users whose names begin with tw_ |

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
| data | <code>\*</code> | data concerning the error itself |

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

<a name="Group"></a>

## Group : <code>Object</code>
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

## GroupsGetByFilterAPIResponse : <code>Object</code>
**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | message that is a text representation of the status property |
| status | <code>number</code> | HTTP status code for the response (will be between 200 and 399) |

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| data | [<code>Array.&lt;Group&gt;</code>](#Group) | list of groups returned by IBM BPM |

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

