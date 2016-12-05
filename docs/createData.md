@function can-connect-signalr/createData createData
@parent can-connect-signalr/data-interface

@signature `createData(instanceData)`

Invokes the method specified by [can-connect-signalr.signalR].createName or
[can-connect-signalr.signalR].name+"Create".

You can call this method directly off of a connection,

```js
connection.createData(instanceData);
```

Or, it can be called off of the `DefineMap` constructor function
you have associated the `connection` with. Note that `can-connect-signalr` requires the method signatures
defined on your hub to accept only one parameter. You can pass in multiple values by sending the method
an object:

```js
new Message({
// returns a promise that will be resolved once data is received by the Hub.
// Note: Data returned from the Hub will be received in the proxy listener.
		text: 'Hi there!'
	}).save();
```

While `createData` returns a `Promise`, that promise does not contain an instance of the created object. That 
will be made available in the associated event listener, `createdData`. 

@param {Set} set.
@return {Promise<Object>} A promise that resolves to nothing.

    
