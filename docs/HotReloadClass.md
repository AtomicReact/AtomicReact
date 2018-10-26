# HotReload Class

HotReload helps on development time. It recompile Atomic all times when anyone change happens on `AtomicDir`. So the developer can see the changes on web without need refresh the page all times.

*Notes:*
  * HotReload uses [*chokidar module*](https://github.com/paulmillr/chokidar) to watch changes.
  * HotReload uses [*ws module*](https://github.com/websockets/ws) to communicate with web client via websocket.

## Constructor

```
constructor([port] [,address])
```

Param | Description | Type | Default value
------------ | ------------- | ------------- | -------------
port | port to communicate with web client via web socket | `number` | *1337*
address | address to communicate with web client via web socket | `string` | *127.0.0.1*


## Testing in diferent devices

Let's supose you want to test your web app in a smartphone connected in same network that device running Atomic is. To do this, just set `address` param on [constructor](HotReloadClass?id=constructor) to the  *address ip* of device running Atomic

*E.g:* If the *address ip* of device running Atomic  is *192.168.0.101*, the `AtomicReact_run.js` file will be:

``` js
[...]

/* initialize HotReload */
var myHotReload = new AtomicHotReload(1337, '192.168.0.101'); //initialize HotReload on 192.168.0.101:1337

[...]
```

## Watching custom files and dirs

By default *HotReload* watch changes on `AtomicDir`. To watch custom files or dirs use [`addToWatch()`](HotReloadClass?id=addtowatch) function.

*E.g:* To watch a *foobar.html* file and *foo/bar/* dir , the `AtomicReact_run.js` file will be:

``` js
[...]

/* Listen all changes in custom files */
myHotReload.addToWatch(require('path').join(__dirname, 'foobar.html')); //watch foobar.html file
myHotReload.addToWatch(require('path').join(__dirname, 'foo/bar')); //watch foo/bar folder

[...]
```

## API Reference

### Overview
* [`addToWatch()`](HotReloadClass?id=addtowatch)
* [`getEventEmitter()`](HotReloadClass?id=geteventemitter)
* [`reload()`](HotReloadClass?id=reload)
* [`Events`](HotReloadClass?id=events)
  * [`reload`](HotReloadClass?id=event-name-reload)

### Reference

#### addToWatch()
``` js
HotReload.addToWatch(path)
```
* **Description:**
Add a path to be watched
* **Param:**

Param | Description | Type
------------ | ------------- | -------------
path | dir or file path will be watched  | `string`

* **Return:** void
* **Note:**
  * Checkout [Watching custom files and dirs](HotReloadClass?id=watching-custom-files-and-dirs) section for learn more about

---

#### getEventEmitter()
``` js
HotReload.getEventEmitter()
```
* **Description:**
Get [EventEmitter Class](https://nodejs.org/api/events.html#events_class_eventemitter). The EventEmitter is used to communicate with all [Atomic Class](AtomicClass) using the HotReload
* **Param:** void
* **Return:** [EventEmitter Class](https://nodejs.org/api/events.html#events_class_eventemitter)
* **Note:**
  * Checkout [Events](HotReloadClass?id=events) section for know more about events emitted.

---

#### reload()
``` js
HotReload.reload(message)
```
* **Description:**
Send recompile all [Atomic Class](AtomicClass) using the HotReload and refresh all web clients
* **Param:**

Param | Description | Type
------------ | ------------- | -------------
message | message command to be send to web socket client  | `string`

* **Return:** void

---

### Events

Events fired by event emitter

``` js
HotReload.getEventEmitter().on('<eventName>', callback);
```

* #### Event name: `reload`
``` js
HotReload.getEventEmitter().on('reload', function(message){/*...*/});
```
  * **Description:**
  fired when [`reload()`](HotReloadClass?id=reload) function is called
  * **Callback function param:**

Param | Description | Type | Note
------------ | ------------- | ------------- | -------------
message | message command sent to web socket client  | `string` | When HotReload detect anyone changes on watching path it send `<atomicreact.hotreload.RELOAD>` message command.

---
