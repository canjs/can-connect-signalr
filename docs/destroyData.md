@function can-connect-signalr/destroyData destroyData
@parent can-connect-signalr/data-interface

@signature `destroyData(id)`

Invokes the method specified by [can-connect-signalr.signalR].destroyName or
[can-connect-signalr.signalR].name+"Destroy".

## Setup 
If your `SignalR` hub conforms to the required interface (see [can-connect-signalr]), there is nothing you need to 
do to configure this method on the client. If the method name of the `destroy` end point on your `SignalR` hub deviates from
the standard expected by `can-connect-signalr`, you can override `can-connect-signalr`'s default naming by providing
this property with the name expected by your `SignalR` hub.

```js
    signalR: {
        url: 'http://test.com', // URL of the SignalR server
        name: 'Message' // Name of the SignalR hub,
        destroyName: 'nameOfMethod'
    }
```

You can call the method directly off of a connection:

```js
connection.destroyData(id);
```

## CanJS Usage
If your connection is mixed in to a `DefineMap` (see [can-connect-signalr]), `destroyData` can be called off of the 
`DefineMap` constructor function. Note that `can-connect-signalr` requires the method signatures
defined on your hub to accept only one parameter. You can pass in multiple values by sending the method
an object:

```js
// returns a promise that will be resolved once data is returned from the Hub.
myMessageInstance.destroy();

// OR

myMessageInstance.destroy()
  .then(function(saveResponse){
		
  });
```

@param {Set} set.
@return {Promise<Object>} A promise that resolves to nothing.



    
