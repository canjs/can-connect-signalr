@function can-connect-signalr/createData createData
@parent can-connect-signalr/data-interface

@description Creates an instance on the server.  This is invoked on a new instance by calling [save].

@signature `createData(instanceData)`

Invokes the method specified by [can-connect-signalr.signalR].createName or
[can-connect-signalr.signalR].name+"Create" and expects the server to respond
with the created data and a [can-connect.id] property.

```js
connect([
  ...
  require("can-connect-signalr"),
  ...
], {
  signalR: {
    url: 'http://test.com', // URL of the SignalR server
    name: 'MessageHub', // Name of the SignalR hub,
    createName: 'createTheMessage'
  },
  Map: Message,
  ...
});

```

The following call to `.save()` invokes a `createTheMessage` method on the `MessageHub` hub with the message's serialized data:

```js
new Message({
    name: "Justin",
    message: "Hello World"
}).save()
// calls MesageHub.createTheMessage({
//   name: "Justin",
//   message: "Hello World"
// })
```

The server should respond with the message data plus it's `id`:

```js
{
  "id": 1,
  "name": "Justin",
  "message": "Hello World"
}
```

The following `signalR` connection configurations call their corresponding Hubs and methods:

```
signalR: { name: 'MessageHub' } //-> MessageHub.createMessageHub(message)
signalR: {
    name: 'MessageHub',
    createName: "createIt"
} //-> MessageHub.createIt(message)
signalR: {
    createName: "createIt"
} //-> THROWS AN ERROR
```

@param {Object} instanceData The model to create.
@return {Promise<Object>} A promise that resolves to nothing.


@body

## Setup

If your `SignalR` hub conforms to the required interface (see [can-connect-signalr]), there is nothing you need to
do to configure this method on the client. If the method name of the `create` end point on your `SignalR` hub deviates from
the standard expected by `can-connect-signalr`, you can override `can-connect-signalr`'s default naming by providing
this property with the name expected by your `SignalR` hub.

```js
    signalR: {
        url: 'http://test.com', // URL of the SignalR server
        name: 'MessageHub' // Name of the SignalR hub,
        createName: 'nameOfMethod'
    }
```

You can call this method directly off of a connection:

```js
connection.createData(message);
```

## CanJS Usage

If your connection is mixed in to a `DefineMap` (see [can-connect-signalr]), `createData` can be called off of the
`DefineMap` constructor function. Note that `can-connect-signalr` requires the method signatures
defined on your hub to accept only one parameter. You can pass in multiple values by sending the method
an object:

```js
// returns a promise that will be resolved once data is received by the Hub.
// Note: Data returned from the Hub will be received in the proxy listener.
new Message({
	text: 'Hi there!'
}).save();
```

While `createData` returns a `Promise`, that promise does not contain an instance of the created object. That
will be made available through the associated RPC listener, `createdData`. This listener takes care of updating
model instances or lists.
