@module {function} can-connect-signalr
@parent can-ecosystem
@package ../package.json
@group can-connect-signalr/data-interface data interface

@description Connect to a SignalR server.

@signature `connectSignalR( baseBehavior )`

Describe what the code does on a high level. How it works.


@body

## Use


Say you have a signalR methods that look like:

messageCreate() ->


if that's the case then just do:

```js
connect({
    require("can-connect-signalr")
],{
    signalR: {}
});
```
