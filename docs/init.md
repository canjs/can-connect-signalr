@function can-connect-signalr.init init
@parent can-connect-signalr/methods

@description Establishes a connection to the `SignalR` hub, sets up proxy methods and RPC listeners.

@option {function}

The `init` method establishes a connection to the `SignalR` hub, and creates a hub proxy. For each CRUD method,
a corresponding RPC listener is registered on the proxy. For example, `can-connect-signalr` implements a `createData`
method. The listener corresponding to that method, by default called `createdData`, is registered on the proxy.

The `init` method is called automatically.