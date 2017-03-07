@function can-connect-signalr/destroyData destroyData
@parent can-connect-signalr/data-interface

@description Destroys an instance on the server.  This is invoked on an instance by calling [destroy].

@signature `destroyData(instanceData)`

Invokes the method specified by [can-connect-signalr.signalR].destroyName or
[can-connect-signalr.signalR].name+"Destroy".

```js
connect([
  ...
  require("can-connect-signalr"),
  ...
], {
  signalR: {
    url: 'http://test.com', // URL of the SignalR server
    name: 'MessageHub', // Name of the SignalR hub,
    destroyName: 'destroyTheMessage'
  },
  Map: Message,
  ...
});

```

The following call to `.destroy()` invokes a `destroyTheMessage` method on the `MessageHub` hub with the message model:

```js
message.destroy();
// calls MesageHub.destroyTheMessage(message)
```

The following `signalR` connection configurations call their corresponding Hubs and methods:

```
signalR: { name: 'MessageHub' } //-> MessageHub.messageHubDestroy(message)
signalR: {
    name: 'MessageHub',
    destroyName: "destroyIt"
} //-> MessageHub.destroyIt(message)
signalR: {
    destroyName: "destroyIt"
} //-> THROWS AN ERROR
```

@param {Object} instanceData The model to delete.
@return nothing.


@body

## Setup

If your `SignalR` hub conforms to the required interface (see [can-connect-signalr]), there is nothing you need to
do to configure this method on the client. If the method name of the `destroy` end point on your `SignalR` hub deviates from
the standard expected by `can-connect-signalr`, you can override `can-connect-signalr`'s default naming by providing
this property with the name expected by your `SignalR` hub.

```js
signalR: {
  url: 'http://test.com', // URL of the SignalR server
  name: 'MessageHub' // Name of the SignalR hub,
  destroyName: 'nameOfMethod'
}
```

You can call this method directly off of a connection:

```js
connection.destroyData(message);
```

## CanJS Usage

If your connection is mixed in to a `DefineMap` (see [can-connect-signalr]), `destroyData` can be called off of the
`DefineMap` constructor function. Note that `can-connect-signalr` requires the method signatures
defined on your hub to accept only one parameter. You can pass in multiple values by sending the method
an object:

```js
message.destroy();
```

The `messageDestroyed` method takes care of updating model instances or lists on connected clients.
