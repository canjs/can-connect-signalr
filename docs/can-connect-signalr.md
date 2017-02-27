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

`can-connect-signalr` is a `can-connect` behavior that makes a connection that can communicate with a
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

A basic setup of `can-connect-signalr` requires adding the `signalR` behavior to a `can-connection`, as follows:

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

With this configuration, the `signalRConnection` can make RPC calls to a `SignalR` hub named `Message`
located at `http://test.com`.

  - Calling any of the `get` methods will return data from the server.
  - Calling any of the Create/Update/Delete methods will affect data on the server.
  - If the `SignalR` hub is configured correctly (see below), the connection will receive broadcast messages from the `SignalR` hub.

### Hub Interface Requirements

Any `SignalR` hub you will connect to with `can-connect-signalr` must conform to the following interface, where the
terms `Item` && `item` should be replaced by your method name prefix:


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
        public MessageViewModel ItemDestroy()
        {
            // Any RPC calls to the client related to destroy go here
            Clients.All.itemDestroyed(...);
        }

		// Method should take whatever data is required to obtain a list (if any)
        public List<T> ItemGetList(...)
        {
            return ...
        }

        // Method should take whatever data is required to obtain a specific item
        public Item ItemGet(...)
        {
            return ...
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
 - getList

`can-connect-signalr` has a default naming convention for each of the proxy methods. It prepends the name of the hub,
in lower case, to its associated action. For example, if the name of the `SignalR` hub were: "message", the default
name for the `createData` method would be: `messageCreate`.

You can overwrite the names of any of the CRUD methods, by setting its corresponding name property. For example,
to overwrite the method name of the `createData` method, set the `createName` property of the `SignalR` options
object.

```js
    signalR: {
        url: 'http://test.com',
        name: 'Message'
        createName: 'nameOfMethod'
    }
```

Similarly, `can-connect-signalr` provides default proxy RPC handler names, for the methods defined to listen for replies
from a `SignalR` server. `can-connect-signalr` has a limited set of RPC handlers you can use. The set is limited to
the CUD operations it supports. As with the proxy methods, the listener names default to a combination of the hub name
and the RPC name. For example, using `Message` as the Hub name:

 - messageCreatedData
 - messageUpdatedData
 - messageDestroyedData
 - messageListData

For example, if the name of the hub were "message", the default name for a listener associated with a create event
would be `messageCreated`. These, too, can be overwritten. For example, set the `createdName` property of the `SignalR`
options object to overwrite the default listener name.

```js
    signalR: {
        url: 'http://test.com',
        name: 'Message'
        createdName: 'nameOfMethod'
    }
```

## Use with CanJS

Any `can-connect` connection can be mixed in to a [`DefineMap`](DefineMap). When using `can-connect-signalr`
with `DefineMap`, note that an `id` field must exist on any object returned from a Hub.

To see how this is done, follow the code sample below:

```js
var DefineMap = require('can-define/map/map');
var DefineList = require('can-define/list/list');

var Message = DefineMap.extend({
	text: {
		type: 'string'
	},
	id: {
		type: 'number'
	}
});

Message.List = DefineList.extend({
	Map: Message
}, {});

var behaviors = [
		require('can-connect/constructor/constructor'),
		require('can-connect/constructor/store/store'),
		require('can-connect/can/map/map'),
		require('can-connect/data/callbacks/callbacks'),
		require('can-connect/real-time/real-time'),
		require('can-connect/constructor/callbacks-once/callbacks-once'),
		require('./signalr') // Import the signalR Behavior
	];

	Message.connection = connect(behaviors, {
		Map: Message,
		List: Message.List,
		signalR: {
			url: 'http://test.com',
			name: 'Message',
			createName: 'postMessage', // Example of overwriting a default method name.
			createdName: "messagePosted" // Example of overwriting a default listener name.
		}
	});
```
