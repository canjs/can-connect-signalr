@function can-connect-signalr/getListData getListData
@parent can-connect-signalr/data-interface

@description Gets an list of data from the server. This is called on a constructor function by calling [getListData].

@signature `getListData(queryParams)`

Invokes the method specified by [can-connect-signalr.signalR].getListData or
[can-connect-signalr.signalR].name+"GetListData" and expects the server to respond
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
    getListData: 'getMessages'
  },
  Map: Message,
  ...
});

```

The following call to `.getListData()` calls a `getListOfMessages` method on the `MessageHub` hub with the provided parameters:

```js
Message.getListData({
  name: 'Johnson'
});
// calls MesageHub.getListOfMessages({
//   name: 'Johnson'
// })
```

It's expected that the server responds with the message list:

```js
[
 {
   "id": 1,
   "name": "Johnson",
   "message": "Hello World"
 },
 {
   "id": 2,
   "name": "Johnson",
   "message": "Hello again World"
 }
]
```

The following `signalR` connection configurations call their corresponding Hubs and methods:

```
signalR: { name: 'MessageHub' } //-> MessageHub.messageHubGetListData(messageData)
signalR: {
    name: 'MessageHub',
    getListData: "getThem"
} //-> MessageHub.getThem(messageData)
signalR: {
    getListData: "getThem"
} //-> THROWS ERROR
```

@param {Object} queryParameters.
@return {Promise<Object>} A promise that resolves to a list.


@body

## Setup

If your `SignalR` hub conforms to the required interface (see [can-connect-signalr]), there is nothing you need to
do to configure this method on the client. If the method name of the `getList` end point on your `SignalR` hub deviates from
the standard expected by `can-connect-signalr`, you can override `can-connect-signalr`'s default naming by providing
this property with the name expected by your `SignalR` hub.

```js
    signalR: {
        url: 'http://test.com', // URL of the SignalR server
        name: 'MessageHub' // Name of the SignalR hub,
        getListData: 'nameOfMethod'
    }
```

You can call this method directly off of a connection:

```js
connection.getListData(queryParams);
```

## CanJS Usage

If your connection is mixed in to a `DefineMap` (see [can-connect-signalr]), `getListData` can be called off of the
`DefineMap` constructor function. Note that `can-connect-signalr` requires the method signatures
defined on your hub to accept only one parameter. You can pass in multiple values by sending the method
an object:

```js
Message.getListData(queryParams);
```
