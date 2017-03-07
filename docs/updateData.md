@function can-connect-signalr/updateData updateData
@parent can-connect-signalr/data-interface

@description Updates an instance on the server.  This is invoked on an existing instance by calling [save].

@signature `updateData(instanceData)`

Invokes the method specified by [can-connect-signalr.signalR].updateName or
[can-connect-signalr.signalR].name+"Update" and expects the server to respond
with the updated data.

```js
connect([
  ...
  require("can-connect-signalr"),
  ...
], {
  signalR: {
    url: 'http://test.com', // URL of the SignalR server
    name: 'MessageHub', // Name of the SignalR hub,
    updateName: 'updateTheMessage'
  },
  Map: Message,
  ...
});

```

The following call to `.save()` invokes an `updateTheMessage` method on the `MessageHub` hub with the message's serialized data:

```js
message.name = 'Brian';
message.save();
// calls MesageHub.updateTheMessage({
//   name: "Brian"
// })
```

It's expected the server responds with the message:

```js
{
  "id": 2,
  "name": "Brian",
  "message": "Hello World"
}
```

The following `signalR` connection configurations call their corresponding Hubs and methods:

```
signalR: { name: 'MessageHub' } //-> MessageHub.updateMessageHub(message)
signalR: {
    name: 'MessageHub',
    updateName: "updateIt"
} //-> MessageHub.updateIt(message)
signalR: {
    updateName: "updateIt"
} //-> THROWS AN ERROR
```

@param {object} instanceData The model to update.
@return {Promise<Object>} A promise that resolves to nothing.


@body

## Setup

If your `SignalR` hub conforms to the required interface (see [can-connect-signalr]), there is nothing you need to
do to configure this method on the client. If the method name of the `update` end point on your `SignalR` hub deviates from
the standard expected by `can-connect-signalr`, you can override `can-connect-signalr`'s default naming by providing
this property with the name expected by your `SignalR` hub.

```js
signalR: {
  url: 'http://test.com', // URL of the SignalR server
  name: 'MessageHub' // Name of the SignalR hub,
  updateName: 'nameOfMethod'
}
```

You can call this method directly off of a connection:

```js
connection.updateData(message);
```

## CanJS Usage

If your connection is mixed in to a `DefineMap` (see [can-connect-signalr]), `updateData` can be called off of the
`DefineMap` constructor function. Note that `can-connect-signalr` requires the method signatures
defined on your hub to accept only one parameter. You can pass in multiple values by sending the method
an object:

```js
message.name = 'Brian';
message.save();
```

While `updateData` returns a `Promise`, that promise does not contain an instance of the updated object. That
will be made available through the associated RPC listener, `updatedData`. This listener takes care of updating
model instances or lists.
