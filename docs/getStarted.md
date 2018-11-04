# Get Started :rocket:

## Installation
1. Install Atomic package globally via *npm* (to use CLI commands)
```
  npm install atomicreact -g
```
2. Install Atomic package in your project via *npm*
```
  npm install atomicreact --save
```
3. **Initialize Atomic** inside your project folder:
```
  Atomic init
```
4. **Run Atomic**:
```
  Atomic run
```

So, some files and dir will be created. Let's see more about them below:

## Configuration (**`AtomicReact_config.js`**)

All AtomicReact configuration is made on **`AtomicReact_config.js`**.

From initial `AtomicReact_config.js`:
``` js
module.exports = {
  atomicDir: 'myAtomicReactFolder',
  bundleDir: 'myPublicDir/AtomicReactBundle',
  debug: true
}
```
Where:

`atomicDir` : the path where Atoms will be. **Note:** in this documentation, we call `AtomicDir` to refer this path

`bundleDir` : the path where all Atoms will be bundled, normally a public dir. **Note:** in this documentation, we call `BundleDir` to refer this path

`debug` : whether mensages in console like infos and warns will be showed

## Running (**`AtomicReact_run.js`**)

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


## Creating an Atom

There are 3 subs folders in `AtomicDir`:
``` text
└── AtomicDir
    ├── html
    ├── js
    └── css
```

The `html`sub folder  is the Atom structure.

The `js` sub folder is the Atom logic.

The `css` sub folder is the Atom style.

**To create an Atom** just create a *.html* file on `html` sub folder. **The file name is the Atom name or the Atom key**. Note if you let's the `debug` as *true* in `AtomicReact_config.js` file you should see the Atom name on console.

For while just put the follow html code inside your Atom.
``` html
<div>
  <h1>{props.myTitle}</h1>
  <h2>Hi! I'm a Atom</h2>
  <div atomic.children></div>
</div>
```
*Notes:*
  * Checkout the [`Atom`](Atom) for know more about Atom structure, logic and style

## Using an Atom

Let's supose you already have a *http server* serving an *html* file. Maybe with *Http Server from NodeJS* , *Wamp Server*, *Apache Server*, whatever.

**To use an Atom** you need just import the bundles files from `BundleDir` in your *html* file. Like this:

``` html
<script src="./AtomicReactBundle/atomicreact.core.js"></script>
<script src="./AtomicReactBundle/atomicreact.bundle.js"></script>
<link rel="stylesheet" href="./AtomicReactBundle/atomicreact.bundle.css">
```

And **use it tagging Atom key**:

``` html
<body>
  <MyAtom props.myTitle="This's my title">
    <h4>i'm in children</h4>
  </MyAtom>
</body>
```

The *html* file will look like this:

``` html
<HTML>
<head>
	<title>Hello AtomicReact App</title>

	<script src="./AtomicReactBundle/atomicreact.core.js"></script>
	<script src="./AtomicReactBundle/atomicreact.bundle.js"></script>
	<link rel="stylesheet" href="./AtomicReactBundle/atomicreact.bundle.css">

</head>

<body>
  <MyAtom props.myTitle="This's my title">
    <h4>i'm in children</h4>
  </MyAtom>
</body>
</HTML>
```

That's all folks.

**Next importants steps:**
  * Learn more about [`Atom`](Atom)
