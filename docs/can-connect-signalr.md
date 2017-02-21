@module {function} can-connect-signalr
@parent can-ecosystem
@package ../package.json
@group can-connect-signalr/data-interface data interface
@group can-connect-signalr/options options

@description Connect to a [Hub]() on a [SignalR]() server.

@signature `connectSignalR( baseBehavior )`

Encapsulates connecting to a `SignalR` hub, by:
 - implementing the [can-connect-signalr/createData], [], [] [can-connect/DataInterface] methods to 
   make RPC calls to the server.
 - listening for [can-connect-signalr.signalR]`.createdName`, ... messages and calling 
   [can-connect/real-time/real-time.createInstance], ....

@body

## Use

`can-connect-signalr` is a `can-connect` behavior that makes a [connection] connect to a 
[Hub]() on a [SignalR]() server. This is done by adding the behavior to the connection 
and configurating as follows:

```js
var Message = DefineMap.extend({ .. })

connect([],{
  signalR: {
    
  }
})
```

This makes it so:

`Message.getList({})` makes an RPC call to `SOMETHIGN` and that needs to send back.
// TODO: Most basic setup, and what the user needs to do around that. Clearly identify the I/O of the service, and
what should be expected. Main CRUD methods, and push out the other methods. If we have messages data
on our server, this is how we'd setup the connection, this is what hte server would have to look like, &c.

// TODO: Put the `signalR` page into an options section (options header)



// TODO: Update with `can-connect` use.


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
var dataParse = require('can-connect/data/parse/parse');
var constructor = require('can-connect/constructor/constructor');
var constructorStore = require('can-connect/constructor/store/store');
var canMap = require('can-connect/can/map/map');
var dataCallbacks = require('can-connect/data/callbacks/callbacks');
var realTime = require('can-connect/real-time/real-time');
var constructorCallbacksOnce = require('can-connect/constructor/callbacks-once/callbacks-once');
var signalr = require('./signalr'); // Import the signalr instance.

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

// TODO: Require the Bx inline

var behaviors = [
		constructor,
		constructorStore,
		canMap,
		dataCallbacks,
		realTime,
		constructorCallbacksOnce,
		signalR
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
