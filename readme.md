# can-connect-signalr

[![Build Status](https://travis-ci.org/canjs/can-connect-signalr.png?branch=master)](https://travis-ci.org/canjs/can-connect-signalr)

`can-connect-signalr` is a set of behaviors for integrating [can-connect](http://canjs.com/doc/can-connect.html) with Microsoft's [SignalR](http://signalr.net/).

## Table of Contents

- [Usage](#usage)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [Making a Build](#making-a-build)
- [Running the Tests](#running-the-tests)

## Install

```
npm install can-connect-signalr --save
```

## Usage

`can-connect-signalr` simplifies the process of connecting to a SignalR Hub, when that Hub conforms to a specific 
CRUD interface. 

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

| DataInterface method | SignalR Hub Default Method Name| HTTP method  | Example Path |
|----------------------|--------------------------------|--------------|--------------|
| .getListData()       | [prefix]GetList()                 | GET          | /todos       |
| .createData()        | [prefix]Create()                  | POST         | /todos       |
| .updateData()        | [prefix]Update()                  | PUT          | /todos/{id}  |
| .destroyData()       | [prefix]Destroy()                 | DELETE       | /todos/{id}  | 



NOTE: `can-connect-signalr` requires that the method names you define on your `SignalR` hub accept an object as their
only parameter. For example, if you were to define a method _on your hub_ for creating instances of an object,
the method signature 

Similarly, `can-connect-signalr` provides default proxy event handler names, for the methods defined to listen for replies
from a `SignalR` server. `can-connect-signalr` has a limited set of event handlers you can use. The set is limited to
the CUD operations it supports. As with the proxy methods, the listener names default to a combination of the hub name
and the event name:

 - createdData
 - updatedData
 - destroyedData
 
For example, if the name of the hub were "message", the default name for a listener associated with a create event 
would be `messageCreated`. These, too, can be overwritten. For example, set the `createdName` property of the `SignalR`
options object to overwrite the default listener name.

Finally, `can-connect-signalr` requires that an `id` field exist on any object returned from a Hub. 

To see how this is done, follow the code sample below.

```js
var DefineMap = require('can-define/map/');
var DefineList = require('can-define/list/');
var dataParse = require('can-connect/data/parse/');
var constructor = require('can-connect/constructor/');
var constructorStore = require('can-connect/constructor/store/');
var canMap = require('can-connect/can/map/');
var dataCallbacks = require('can-connect/data/callbacks/');
var realTime = require('can-connect/real-time/');
var constructorCallbacksOnce = require('can-connect/constructor/callbacks-once/');
var signalr = require('./signalr'); // Import the signalr instance.

var Message = DefineMap.extend({
	text: {
		type: 'string'
	},
	id: {
		type: 'number'
	}
});

Message.List = DefineList.extend({
	Map: Message
}, {});

var behaviors = [
		dataParse,
		constructor,
		constructorStore,
		canMap,
		dataCallbacks,
		realTime,
		constructorCallbacksOnce,
		signalR
	];

	Message.connection = connect(behaviors, {
		Map: Message,
		List: Message.List,
		signalR: {
			url: 'http://test.com',
			name: 'Message',
			createName: 'postMessage', // Example of overwriting a default method name.
			createdName: "messagePosted" // Example of overwriting a default listener name. 
		}
	});
```

Your `Message` model is ready to go with all `SignalR` features in place.

## Configuration
When instantiating a `SignalR` instance, you can pass a configuration object to the constructor.  
For most applications, the only options that will need to be specified will be the `url` and the `idProp`.

 - `signalr.url` - The URL of the `SignalR` hub.
 - `signalr.name` - The name of the `SignalR` hub you are connecting to.
 - `signalr.createName` - Overwrites the default method name provided by `can-connect-signalr`
 - `signalr.updateName` - Overwrites the default method name provided by `can-connect-signalr`
 - `signalr.destroyName` - Overwrites the default method name provided by `can-connect-signalr`
 - `signalr.getListName` - Overwrites the default method name provided by `can-connect-signalr`
 - `signalr.createdName` - Overwrites the default method name provided by `can-connect-signalr`
 - `signalr.updatedName` - Overwrites the default method name provided by `can-connect-signalr`
 - `signalr.destroyedName` - Overwrites the default method name provided by `can-connect-signalr`
 - `signalr.idProp` - This value defaults to `_id`. If the name of the id field being returned by your hub is different,
 then indicate that name here. 


```js
var SignalR = require('can-connect-signalr');

var signalr = new SignalR([...behaviors], {
  // The current server is assumed to be the Hub.
  url: '',
  // The name fo the id field.
  idProp: 'id',
  // The name of the SignalR hub.
  name: 'message'
});

module.exports = signalr;
```

## Contributing

### Making a Build

To make a build of the distributables into `dist/` in the cloned repository run

```
npm install
node build
```

### Running the tests

Automated tests from the command line can be run with `npm test`.

## Changelog