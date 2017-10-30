@module {function} can-connect-signalr
@parent can-data-modeling
@collection can-ecosystem
@package ../package.json
@group can-connect-signalr/data-interface data interface
@group can-connect-signalr/options options
@group can-connect-signalr/methods methods

@description Connect to a
[Hub](https://docs.microsoft.com/en-us/aspnet/signalr/overview/guide-to-the-api/hubs-api-guide-server) on a
[SignalR](https://docs.microsoft.com/en-us/aspnet/signalr/) server.

@signature `connectSignalR( baseBehavior )`

Encapsulates connecting to a `SignalR` hub, by:

- implementing the: [can-connect-signalr/createData],  [can-connect-signalr/updateData], [can-connect-signalr/getData], [can-connect-signalr/getListData], and [can-connect-signalr/destroyData] [can-connect/DataInterface] methods to make RPC calls to the server.
- listening for the following messages pushed from the server to the browser:
  - [can-connect-signalr.signalR]`.createdName`,
  - [can-connect-signalr.signalR]`.updatedName`,
  - [can-connect-signalr.signalR]`.destroyedName`

  and calling: [can-connect/real-time/real-time.createInstance], [can-connect/real-time/real-time.updateInstance], or [can-connect/real-time/real-time.destroyInstance].

@body

## Use

`can-connect-signalr` is a [can-connect] behavior that makes a connection that can communicate with a
[Hub](https://docs.microsoft.com/en-us/aspnet/signalr/overview/guide-to-the-api/hubs-api-guide-server) on a
[SignalR](https://docs.microsoft.com/en-us/aspnet/signalr/) server.

The following walks through an example setup that allows a `Message`
type to be created, retrieved, updated and deleted by the client AND
to be notified when messages are created, updated, or deleted by the
server.

Specifically, we will detail the:

 - `can-connect` Client setup
 - Hub Interface Requirements

### `can-connect` Client setup

Below is a complete example of connecting a `DefineMap` model type to
a SignalR hub:

```js
var DefineMap = require('can-define/map/map');
var DefineList = require('can-define/list/list');
var connect = require("can-connect");

// Defines the Type that will be used on the client.
var Message = DefineMap.extend({
	body: 'string',
	id: 'number'
});

// Defines a List type that contains instances of the
// Type.
Message.List = DefineList.extend({
    '#': Message
});

// The minimal behaviors used to create the connection
var behaviors = [
	require('can-connect/constructor/constructor'),
	require('can-connect/constructor/store/store'),
	require('can-connect/can/map/map'),
	require('can-connect/data/callbacks/callbacks'),
	require('can-connect/real-time/real-time'),
	require('can-connect/constructor/callbacks-once/callbacks-once'),
	require('can-connect-signalr') // Import the signalR Behavior
];

// Connects the types to the SignalR server
Message.connection = connect(behaviors, {
	Map: Message,
	List: Message.List,
	signalR: {
		url: 'http://test.com',
		name: 'MessageHub'
	}
});
```

This example creates a `Message` [can-define/map/map] type and
`Message.List` [can-define/list/list] type and connects them
to `MessageHub` at `http://test.com`.

This sets up `Message` so it can retrieve, create, update and delete `Message`s as follows:

<style>
.table {
 width: 100%;
 border: 1px solid #ccc;
}
.table td, .table th {
 border: 1px solid #ccc;
 padding: 5px;
}
.table td:nth-child(1), .table th:nth-child(1) {
 max-width: 350px;
}
.table td:nth-child(2), .table th:nth-child(2) {
 max-width: 350px;
 min-width: 220px;
}
.table td pre {
 border: 0;
}
</style>

<table class="table">
   <thead>
      <tr>
         <th>Method</th>
         <th>
            Description
            </th>
         <th>
            Details
         </th>
      </tr>
   </thead>
   <tbody>
	<tr>
	 <td>
	    <pre><code>Message.getList({due: "today"});</code></pre>
	 </td>
	 <td>
	    retrieves a list of messages
	 </td>
	 <td>
	    This calls <code>MessageHub</code>'s <code>public List<MessageModel> messageHubGetListData(MessageQueryParams queryParams)</code> method which is expected to return a list of matched messages.
	 </td>
	</tr>
	<tr>
	   <td>
	      <pre><code>Message.get({id: 5});</code></pre>
	   </td>
	   <td>
	      gets a single message
	   </td>
	   <td>
	      This calls <code>MessageHub</code>'s <code>public MessageModel messageHubGetData( int id )</code> method which is expected to return a single message.
	   </td>
	</tr>
	<tr>
	   <td>
	      <pre><code>var message = new Message({
  body: "Hello World!"
}).save();</code></pre>
	   </td>
	   <td>
	      creates messages
	   </td>
	   <td>
	      This calls <code>MessageHub</code>'s <code>public MessageModel messageHubCreate( MessageModel message )</code> method with the [can-define.types.serialize serialized] properties of the client message.  <code>MessageHubCreate</code> is expected to persist the message, add a unique
            [can-connect/base/base.id] property and value, and return the <code>Message</code>'s new data. It should also notify clients that a message was created.
	   </td>
	</tr>
	<tr>
	   <td>
	      <pre><code>message.body = "Hi there."; 
message.save();</code></pre>
	   </td>
	   <td>
	      updates a message
	   </td>
	   <td>
	      This calls <code>MessageHub</code>'s <code>public MessageModel messageHubUpdate( MessageModel message )</code> method which is expected to update the persisted representation of the message
            and return the <code>Message</code>'s new data. It should also notify clients that a
            message was updated.
	   </td>
	</tr>	
	<tr>
	   <td>
	      <pre><code>message.destroy();</code></pre>
	   </td>
	   <td>
	      deletes a message
	   </td>
	   <td>
	      This calls <code>MessageHub</code>'s <code>public MessageModel messageHubDestroy( MessageModel message )</code> method which is expected to delete the persisted representation of the message
            and return the <code>Message</code>'s updated data. It should also notify clients that a
            message was destroyed.
	   </td>
	</tr>		
   </tbody>
</table>

### Hub Server Setup

The following code outlines a `MessageHub` that would work with with
the above client setup:

```c-sharp
public class MessageHub : Hub
    {

        public MessageHub(MyRepository repository)
        {
        }

		// Method should take whatever data is required to create an instance
        public MessageModel MessageHubCreate( MessageModel message )
        {
            PERSIST_TO_DATABASE( message );

            message.id // type must have a unique id property

            // Any RPC calls to the client related to creation go here
            Clients.All.messageHubCreated(message);
            return message;
        }

		// Method should take whatever data is required to update an instance
        public MessageModel MessageHubUpdate( MessageModel message )
        {
            UPDATE_DATABASE( message );

            // Any RPC calls to the client related to update go here
            Clients.All.messageHubUpdated(message);
            return message;
        }

		// Method should take whatever data is required to destroy an instance (usually an id)
        public MessageModel MessageDestroy( MessageModel model )
        {
            DELETE_FROM_DATABASE( model );

            // Any RPC calls to the client related to destroy go here
            Clients.All.messageDestroyed(model);
        }

		// Method should take whatever data is required to obtain a list (if any)
        public List<MessageModel> MessageGetList( MessageQueryParams queryParams )
        {
            List<MessageModel> messages = GET_DATA_FROM_DATABASE( queryParams );
            return messages;
        }

        // Method should take whatever data is required to obtain a specific item
        public MessageModel MessageGet( int id )
        {
            MessageModel message = GET_RECORD_FROM_DATABASE( id );

            return message;
        }

        ...
    }
```


## Configuration

The name of the Hub is specified by [can-connect-signalr.signalR]`.name`.
This is used to create default method and event names.

For example, if the [can-connect-signalr.signalR]`.name` is `"TaskHub"`, it
will make RPC calls for the following methods ([can-connect-signalr.signalR] configuration name in parenthesis):

- `taskHubGetData` (`signalR.getListName`)
- `taskHubGetListData` (`signalR.getListName`)
- `taskHubCreateData` (`signalR.createName`)
- `taskHubUpdateData` (`signalR.updateName`)
- `taskHubDestroyData` (`signalR.destroyName`)

It will listen to the following events ([can-connect-signalr.signalR] configuration name in parenthesis):

- `taskHubCreatedData` (`signalR.createdData`)
- `taskHubUpdatedData` (`signalR.updatedData`)
- `taskHubDestroyedData` (`signalR.destroyedData`)


For example, you can overwrite these defaults like:

```
connect(behaviors,{
    Map: Task,
    signalR: {
        url: "/hubs",
        name: "TaskHub",

        // Calls TaskHub.getList() instead of TaskHub.taskHubGetListData().
        getListName: "getList",
    }
});
```
