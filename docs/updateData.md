@function can-connect-signalr/updateData updateData
@parent can-connect-signalr/data-interface

@signature `updateData(instanceData)`

Invokes the method specified by [can-connect-signalr.signalR].updateName or
[can-connect-signalr.signalR].name+"Update".

You can call this method directly off of a connection,

```js
connection.updateData(instanceData);
```

Or, it can be called off of the `DefineMap` constructor function
you have associated the `connection` with. Note that `can-connect-signalr` requires the method signatures
defined on your hub to accept only one parameter. You can pass in multiple values by sending the method
an object:

```js
// returns a promise that will be resolved once data is returned from the Hub.
myMessageInstance.text = "'Sup!";
myMessageInstance.save();

// OR

myMessageInstance.text = "'Sup!";
myMessageInstance.save()
  .then(function(saveResponse){
		
  });
```

While `updateData` returns a `Promise`, that promise does not contain an instance of the updated object. That 
will be made available in the associated event listener, `updatedData`.

@param {Set} set.
@return {Promise<Object>} A promise that resolves to nothing.


