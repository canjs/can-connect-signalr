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
 - implementing the:
   - [can-connect-signalr/createData], 
   - [can-connect-signalr/updateData], 
   - [can-connect-signalr/getData],
   - [can-connect-signalr/getListData],
   - [can-connect-signalr/destroyData]
   [can-connect/DataInterface] methods to make RPC calls to the server.
 - listening for:
   - [can-connect-signalr.signalR]`.createdName`, 
   - [can-connect-signalr.signalR]`.updatedName`,
   - [can-connect-signalr.signalR]`.destroyedName`,
   - [can-connect-signalr.signalR]`.listDataName`,
   - [can-connect-signalr.signalR]`.dataName`
   messages and calling 
   - [can-connect/real-time/real-time.createInstance],
   - [can-connect/real-time/real-time.updateInstance],
   - [can-connect/real-time/real-time.destroyInstance]

@body

## Use

`can-connect-signalr` is a `can-connect` behavior that makes a [connection] that can communicate with a 
[Hub](https://docs.microsoft.com/en-us/aspnet/signalr/overview/guide-to-the-api/hubs-api-guide-server) on a 
[SignalR](https://docs.microsoft.com/en-us/aspnet/signalr/) server. This is done by adding the `signalR` 
behavior to the connection and configuring as follows:

```js
var connect = require("can-connect");
var signalRConnection = connect([
  	require("can-connect/constructor/constructor"), 
  	require('can-connect/constructor/callbacks-once/callbacks-once'),
  	require('can-connect/real-time/real-time'),
    require('./signalr') // Add SignalR Behavior
],{
    signalR: {
        url: 'http://test.com', // URL of the SignalR server
        name: 'Message' // Name of the SignalR hub
    }
});
```

This makes it so:

`Message.getList({})` makes an RPC call to `SOMETHIGN` and that needs to send back.
// TODO: Most basic setup, and what the user needs to do around that. Clearly identify the I/O of the service, and
what should be expected. Main CRUD methods, and push out the other methods. If we have messages data
on our server, this is how we'd setup the connection, this is what the server would have to look like, &c.


A `can-connect` `connection` is to the behaviors of a DefineMap. Once mixed in, it provides the map with 
extra functionality. To use the `connection`, do the following:

 - First, declare a `DefineMap` constructor function. 
 - Extend the `DefineMap` by adding a `DefineList` as its `List` property (case sensitive). 
 - Then, create a `connection`, ensuring that the `DefineMap` you declared, and the `DefineMap`'s `List` 
 property are assigned as the `Map` and `List` properties of the `connection`, respectively.
 - NOTE: all the `behaviors` added to the `behaviors` array are required to use `can-connect-signalr`. 
 - Finally, assign the `connection` to the `DefineMap`'s `connection` property.

`can-connect-signalr` provides the following CRUD methods to encapsulate `SignalR` proxy methods:

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

Similarly, `can-connect-signalr` provides default proxy event handler names, for the methods defined to listen for replies
from a `SignalR` server. `can-connect-signalr` has a limited set of event handlers you can use. The set is limited to
the CUD operations it supports. As with the proxy methods, the listener names default to a combination of the hub name
and the event name. For example, using `Message` as the Hub name:

 - messageCreatedData
 - messageUpdatedData
 - messageDestroyedData
 - messageListData
 
For example, if the name of the hub were "message", the default name for a listener associated with a create event 
would be `messageCreated`. These, too, can be overwritten. For example, set the `createdName` property of the `SignalR`
options object to overwrite the default listener name.

Finally, `can-connect-signalr` requires that an `id` field exist on any object returned from a Hub. 

To see how this is done, follow the code sample below.

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
