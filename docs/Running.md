# Running

To runs AtomicReact we call the command `Atomic run` that uses **`AtomicReact_run.js`** file to run.

From initial `AtomicReact_run.js`:
``` js
var Atomic = require('atomicreact').Atomic; //import Atomic from module
var AtomicHotReload = require('atomicreact').HotReload; //import HotReload from module

/* initialize HotReload */
var myHotReload = new AtomicHotReload(1337, 'localhost'); //initialize HotReload on localhost:1337

/* initialize Atomic */
var myAtomic = new Atomic(require('./AtomicReact_config.js'), myHotReload); //initialize Atomic using HotReload

/* Listen all changes in custom files */
myHotReload.addToWatch(require('path').join(__dirname, 'index.html'));
```

By default, HotReload watch all changes on `AtomicDir` and so refresh all pages using the AtomicReact.
You can watch other files even folders using [`HotReload.addToWatch() function`](HotReloadClass?id=watching-custom-files-and-dirs).

*Notes:*
  * Checkout the [`HotReload class`](HotReloadClass)
  * Checkout the [`Atomic class`](AtomicClass)
