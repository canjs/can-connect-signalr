@module {function} can-connect-signalr
@parent can-ecosystem
@package ../package.json
@group can-connect-signalr/data-interface data interface

@description Connect to a hub on a SignalR server.

@signature `connectSignalR( baseBehavior )`

Implements the [can-connect/DataInterface] methods to
invoke CRUD methods on a `SignalR` hub.  It also
listens to create, update, and destroy server-side events on a `SignalR` hub and calls the corresponding
[can-connect/real-time/real-time.createInstance]
[can-connect/real-time/real-time.updateInstance] and
[can-connect/real-time/real-time.destroyInstance] methods.

The [can-connect-signalr.signalR] option is used to configure
how the connection connects to the `SignalR` hub.

@body

## Use

The `can-connect-signalr` behavior is used to make a connection that can
create, retrieve, update, and destroy (CRUD) record of a typed data on a
SignalR hub.  It also receives SignalR broadcasts and
integrates with [can-connect/real-time/real-time], updating lists when records
are created, updated or destroyed.

The following creates a connection that connects the `Message`
type to a SignalR `Message` hub hosted at `http://test.com`:

```js
var DefineMap = require('can-define/map/map');
var DefineList = require('can-define/list/list');

var Message = DefineMap.extend({
	text: 'string',
	id: 'number'
});

Message.List = DefineList.extend({
	"#": Message
});

var behaviors = [
	require('can-connect/constructor/constructor'),
	require('can-connect/constructor/store/store'),
	require('can-connect/can/map/map'),
	require('can-connect/data/callbacks/callbacks'),
	require('can-connect/real-time/real-time'),
	require('can-connect/constructor/callbacks-once/callbacks-once'),

    // Make sure to use the can-connect-signalr behavior!
	require('can-connect-signalr')
];

Message.connection = connect(behaviors, {
	Map: Message,
	List: Message.List,
	signalR: {
		url: 'http://test.com',
		name: 'Message'
	}
});
```

By default, the SignalR `Message` hub hosted at `http://test.com` would need the following methods:

- `messageGetList(set) -> ListData`
- `messageGet(params) -> InstanceProperties`
- `messageCreate(instanceProperties) -> InstanceProperties`
- `messageUpdate(instanceProperties) -> InstanceProperties`




A `can-connect` `connection` is mixed in to the behaviors of a DefineMap. Once mixed in, it provides the map with
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
