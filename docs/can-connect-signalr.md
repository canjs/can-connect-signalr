@module {function} can-connect-signalr
@parent can-ecosystem
@package ../package.json
@group can-connect-signalr/data-interface data interface
@group can-connect-signalr/options options

@description Connect to a
[Hub](https://docs.microsoft.com/en-us/aspnet/signalr/overview/guide-to-the-api/hubs-api-guide-server) on a
[SignalR](https://docs.microsoft.com/en-us/aspnet/signalr/) server.

@signature `connectSignalR( baseBehavior )`

Encapsulates connecting to a `SignalR` hub, by:

- implementing the: [can-connect-signalr/createData],  [can-connect-signalr/updateData], [can-connect-signalr/getData], [can-connect-signalr/getListData], and [can-connect-signalr/destroyData] [can-connect/DataInterface] methods to make RPC calls to the server.
- listening for the following messages pushed from the server to the browser:
  - [can-connect-signalr.signalR]`.createdName`,
  - [can-connect-signalr.signalR]`.updatedName`,
  - [can-connect-signalr.signalR]`.destroyedName`,
  - [can-connect-signalr.signalR]`.listDataName`,
  - [can-connect-signalr.signalR]`.dataName`

  and calling: [can-connect/real-time/real-time.createInstance], [can-connect/real-time/real-time.updateInstance], or [can-connect/real-time/real-time.destroyInstance].

@body

## Use

`can-connect-signalr` is a [can-connect] behavior that makes a connection that can communicate with a
[Hub](https://docs.microsoft.com/en-us/aspnet/signalr/overview/guide-to-the-api/hubs-api-guide-server) on a
[SignalR](https://docs.microsoft.com/en-us/aspnet/signalr/) server.

The following walks through an example setup that allows a `Message`
type to be created, retrieved, updated and deleted by the client AND
to be notified of when messages are created, updated, or deleted by the
server.

Specifically, we will detail the:

 - `can-connect` Client setup
 - Hub Interface Requirements

### `can-connect` Client setup

A basic setup of `can-connect-signalr` requires adding the `signalR` behavior to a `can-connection`:

```js
var connect = require("can-connect");
var signalRConnection = connect([
  	require("can-connect/constructor/constructor"),
  	require('can-connect/constructor/callbacks-once/callbacks-once'),
  	require('can-connect/real-time/real-time'),
    require('can-connect-signalr') // Add SignalR Behavior
],{
    signalR: {
        url: 'http://test.com', // URL of the SignalR server
        name: 'MessageHub' // Name of the SignalR hub
    }
});
```

With this configuration, the `signalRConnection` can make RPC calls to a `SignalR` hub named `MessageHub`
located at `http://test.com`. If the `SignalR` hub is configured correctly, the connection will also 
receive broadcast messages from the `SignalR` hub.

The connection can be assigned to the `connection` property of a DefineMap:

```js
var Message = DefineMap.extend({
  message: 'string'
});

Message.List = DefineList.extend({
	'#': Message
}, {});

Message.connection = signalRConnection;
```

After assigning the `connection`, the `save` and `delete` methods on the `DefineMap` will call the `create`, `update`, 
and `destroy` methods on the `connection`. The `DefineMap`'s static `get` and `getList` methods will call the `connection`'s 
`getData` and `getListData` methods:

```js
// Get a list of data
Message.getList();

// Create a Message
new Message({
  message: 'Hello'
}).save();

// Update a message
message.save();

// Destroy a message
message.destroy();

```

Below is a complete example of creating a `connection` and mixing it into a `DefineMap`:

```js
var DefineMap = require('can-define/map/map');
var DefineList = require('can-define/list/list');

var Message = DefineMap.extend({
	text: 'string',
	id: 'number'
});

Message.List = DefineList.extend({
	'#': Message
}, {});

var behaviors = [
		require('can-connect/constructor/constructor'),
		require('can-connect/constructor/store/store'),
		require('can-connect/can/map/map'),
		require('can-connect/data/callbacks/callbacks'),
		require('can-connect/real-time/real-time'),
		require('can-connect/constructor/callbacks-once/callbacks-once'),
		require('can-connect-signalr') // Import the signalR Behavior
	];

	Message.connection = connect(behaviors, {
		Map: Message,
		List: Message.List,
		signalR: {
			url: 'http://test.com',
			name: 'MessageHub',
			createName: 'postMessage', // Example of overwriting a default method name.
			createdName: "messagePosted" // Example of overwriting a default listener name.
		}
	});
```


### Hub Interface Requirements

Any `SignalR` hub you will connect to with `can-connect-signalr` must conform to the following interface:

```c-sharp
public class MessageHub : Hub
    {

        public MessageHub(MyRepository repository)
        {
        }

		// Method should take whatever data is required to create an instance
        public MessageModel MessageCreate( MessageModel message )
        {
            PERSIST_TO_DATABASE( message );

            message.id // type must have a unique id property

            // Any RPC calls to the client related to creation go here
            Clients.All.messageHubCreated(message);
            return message;
        }

		// Method should take whatever data is required to update an instance
        public MessageModel messageUpdate( MessageModel message )
        {
            UPDATE_DATABASE( message );

            // Any RPC calls to the client related to update go here
            Clients.All.messageHubUpdated(message);
            return message;
        }

		// Method should take whatever data is required to destroy an instance (usually an id)
        public MessageModel MessageDestroy( int id )
        {
            DELETE_FROM_DATABASE( id );
            
            // Any RPC calls to the client related to destroy go here
            Clients.All.itemDestroyed(id);
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

## Client Configuration

`can-connect-signalr` provides the following CRUD methods that define an interface to a predefined set of
`SignalR` proxy methods:

 - createData
 - updateData
 - destroyData
 - getListData
 - getData

`can-connect-signalr` has a default naming convention for each of the proxy methods. 

```
hubName + Action
```
For example, a hub called "MessageHub" would have the following `createData` method:
```
messageHubCreate
```

You can overwrite the names of any CRUD method, by setting its corresponding method name property. For example,
to overwrite the name of the `createData` method:

```js
    signalR: {
        url: 'http://test.com',
        name: 'MessageHub',
        createName: 'nameOfMethod'
    }
```

`can-connect-signalr` provides default proxy RPC handler method names, for the methods defined to listen for calls
from a `SignalR` server. `can-connect-signalr` has a limited set of RPC handlers you can use. As with the proxy methods, 
the listener names default to a combination of the hub name and the RPC name. For example, using `MessageHub` as the Hub name:

 - messageHubCreatedData
 - messageHubUpdatedData
 - messageHubDestroyedData
 - messageHubGetListData
 - messageHubGetData

Proxy handler method name can be overwritten. The following overwrites the name of the `createdData` proxy handler method:

```js
    signalR: {
        url: 'http://test.com',
        name: 'MessageHub',
        createdName: 'makeMessage'
    }
```
