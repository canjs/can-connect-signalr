@function can-connect-signalr/getData getData
@parent can-connect-signalr/data-interface

@description Gets an instance from the server. This is invoked on a constructor function by calling [getData].

@signature `getData(id)`

Invokes the method specified by [can-connect-signalr.signalR].getData or
[can-connect-signalr.signalR].name+"GetData" and expects the server to respond
with the data.

```js
connect([
  ...
  require("can-connect-signalr"),
  ...
], {
  signalR: {
    url: 'http://test.com', // URL of the SignalR server
    name: 'MessageHub', // Name of the SignalR hub,
    getData: 'getTheMessage'
  },
  Map: Message,
  ...
});

```

The following call to `.getData()` invokes a `getTheMessage` method on the `MessageHub` hub with the provided unique message id:

```js
Message.getData(1);
// calls MesageHub.getTheMessage(1)
```

It's expected that the server responds with the message:

```js
{
  "id": 1,
  "name": "Justin",
  "message": "Hello World"
}
```

The following `signalR` connection configurations call their corresponding Hubs and methods:

```
signalR: { name: 'MessageHub' } //-> MessageHub.messageHubGetData(id)
signalR: {
    name: 'MessageHub',
    getData: "getIt"
} //-> MessageHub.getIt(id)
signalR: {
    getData: "getIt"
} //-> BREAKS
```

@param {number} id A unique id.
@return {Promise<Object>} A promise that resolves to an instance.


@body

## Setup

If your `SignalR` hub conforms to the required interface (see [can-connect-signalr]), there is nothing you need to
do to configure this method on the client. If the method name of the `get` end point on your `SignalR` hub deviates from
the standard expected by `can-connect-signalr`, you can override `can-connect-signalr`'s default naming by providing
this property with the name expected by your `SignalR` hub.

```js
signalR: {
  url: 'http://test.com', // URL of the SignalR server
  name: 'MessageHub' // Name of the SignalR hub,
  getData: 'nameOfMethod'
}
```

You can call this method directly off of a connection:

```js
connection.getData(1);
```

## CanJS Usage

If your connection is mixed in to a `DefineMap` (see [can-connect-signalr]), `getData` can be called off of the
`DefineMap` constructor function. Note that `can-connect-signalr` requires the method signatures
defined on your hub to accept only one parameter. You can pass in multiple values by sending the method
an object:

```js
Message.getData(1);
```
