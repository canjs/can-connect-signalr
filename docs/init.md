@function can-connect-signalr.init init
@parent can-connect-signalr

@description Establishes a connection to the `SignalR` hub, sets up proxy methods and event listeners.

@option {function}

The `init` method establishes a connection to the `SignalR` hub, and creates a hub proxy. For each CRUD method,
a corresponding event listener is registered on the proxy. For example, `can-connect-signalr` exposes a `createData`
method. The listener corresponding to that method, by default called `createdData`, is registered on the proxy.

The `init` method is called automatically when you create an instance of `can-connect-signalr`. There is no need
to access it directly.