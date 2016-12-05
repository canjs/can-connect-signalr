@function can-connect-signalr/destroyData destroyData
@parent can-connect-signalr/data-interface

@signature `destroyData(id)`

Invokes the method specified by [can-connect-signalr.signalR].destroyName or
[can-connect-signalr.signalR].name+"Destroy".

You can call this method directly off of a connection,

```js
connection.destroyData(id);
```

Or, it can be called off of the `DefineMap` constructor function you have associated the `connection` with:

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



    
