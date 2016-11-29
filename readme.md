# can-connect-signalr

Welcome to the CanJS/SignalR application! This application works with
a simple, existing SignalR application (based on ChatR) hosted on Azure.

## Getting started

To install all dependencies, (e.g. after cloning it from a Git repository) run

``
npm install can steal steal-tools ms-signalr-client jquery bootstrap  -S
```

## Running tests

Tests can be run with

```
donejs test
``

## Development mode

Development mode can be started with

```
donejs develop
```

## Build and production mode

To build the application into a production bundle run

```
donejs build
```

In Unix environment the production application can be started like this:

```
NODE_ENV=production npm start
```
