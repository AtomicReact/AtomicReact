# Get Started :rocket:

## Installation
1. Install Atomic package globally via *npm* (to use CLI commands)
```bash
  npm install atomicreact -g
```
2. Install Atomic package in your project via *npm*
```bash
  npm install atomicreact --save
```
3. **Initialize & Run Atomic** inside your project folder:
```bash
  Atomic
```

So, some files and dirs will be created and now you are already can to [**create your first Atom**](getStarted?id=creating-an-atom)

## Creating an Atom

There are 3 subs folders in `AtomicDir` (*myAtomicReactFolder* by default):
``` text
└── AtomicDir
    ├── html
    ├── js
    └── css
```

The `html`sub folder  is the Atom's structure.

The `js` sub folder is the Atom's logic.

The `css` sub folder is the Atom's style.

**To create an Atom** just create any *.html* file in `html` sub folder. **The file name is the Atom name or the Atom key**. Note if you let's the `debug` as *true* in `AtomicReact_config.js` file you should see the Atom name on console.

For while just put the follow html code inside your Atom.
``` html
<div>
  <h1>{props.myTitle}</h1>
  <h2>Hi! I'm a Atom</h2>
  <div atomic.nucleus></div>
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
    <h4>i'm in nucleus</h4>
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
    <h4>i'm in nucleus</h4>
  </MyAtom>
</body>
</HTML>
```

After AtomicReact render the page, your view will be:

``` html
<HTML>
<head>
	<title>Hello AtomicReact App</title>

	<script src="./AtomicReactBundle/atomicreact.core.js"></script>
	<script src="./AtomicReactBundle/atomicreact.bundle.js"></script>
	<link rel="stylesheet" href="./AtomicReactBundle/atomicreact.bundle.css">

</head>

<body>
  <div data-atomic-key="MyAtom" data-atomic-id="MyAtom_0">
    <h1>This's my title</h1>
    <h2>Hi! I'm a Atom</h2>
    <div data-atomic-nucleus>
      <h4>i'm in nucleus</h4>
    </div>
  </div>
</body>
</HTML>
```

That's all folks. You can see this on [Playground](https://playground-atomicreact.herokuapp.com/18QieJGnQoTn7wUVX6s82IENsPl4S0bjx)

**Next importants steps:**
  * Learn more about [`Atom`](Atom)
