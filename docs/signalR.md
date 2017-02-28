@property {Object} can-connect-signalr.signalR signalR
@parent can-connect-signalr/options

@description The options object passed to the `can-connect` factory function that generates the 
`can-connect-signalr` connection.


@type {Object}

Below is an example of a fully configured signalR options object:
    
    signalR: {
        url: 'http://test.com',
        name: 'MessageHub',
        createName: 'postMessage', 
        createdName: 'messagePosted',
        updateName: 'updateThis',
        updatedName: 'thingUpdated',
        destroyName: 'obliterateIt',
        destroyedName: 'itIsGone',
        getListName: 'gimmeGimme',
        listDataName: 'gotEmAll',
        getName: 'wannaWanna',
        dataName: 'gotIt'
    }

    @option {String} url
    The url of your `SignalR` hub.

    @option {String} name
    The name of your `SignalR` hub.
    
    @option {String} createName
    The name of the method on your `SignalR` hub you will use to create object instances. `can-connect-signalr`
    provides a default name for this method (hub name + "Create"). Use this property to overwrite that name.
    
    @option {String} createdName
    The name of the RPC listener your `SignalR` proxy you will use to listen for objects created on your hub. 
    `can-connect-signalr` provides a default name for this method (hub name + "Created"). Use this property 
    to overwrite that name.
        
    @option {String} updateName
    The name of the method on your `SignalR` hub you will use to update object instances. `can-connect-signalr`
    provides a default name for this method (hub name + "Update"). Use this property to overwrite that name.
     
    @option {String} updatedName
    The name of the RPC listener your `SignalR` proxy you will use to listen for objects updated on your hub. 
    `can-connect-signalr` provides a default name for this method (hub name + "Updated"). Use this property 
    to overwrite that name.
    
    @option {String} destroyName
    The name of the method on your `SignalR` hub you will use to destroy object instances. `can-connect-signalr`
    provides a default name for this method (hub name + "Destroy"). Use this property to overwrite that name.
    
    @option {String} destroyedName
    The name of the RPC listener your `SignalR` proxy you will use to listen for objects deleted from your hub. 
    `can-connect-signalr` provides a default name for this method (hub name + "Destroyed"). Use this property 
    to overwrite that name.    
    
    @option {String} getListName
    The name of the method on your `SignalR` hub you will use to get a list of object instances. `can-connect-signalr`
    provides a default name for this method (hub name + "GetList"). Use this property to overwrite that name.
            
    @option {String} listDataName
    The name of the RPC listener your `SignalR` proxy you will use to listen for object lists retrieved from your hub. 
    `can-connect-signalr` provides a default name for this method (hub name + "ListData"). Use this property 
    to overwrite that name.    
        
    @option {String} getName
    The name of the method on your `SignalR` hub you will use to get object instances. `can-connect-signalr`
    provides a default name for this method (hub name + "Get"). Use this property to overwrite that name.
            
    @option {String} dataName
    The name of the RPC listener your `SignalR` proxy you will use to listen for objects retrieved from your hub. 
    `can-connect-signalr` provides a default name for this method (hub name + "Data"). Use this property 
    to overwrite that name.          