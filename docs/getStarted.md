# Get Started :rocket:

## Installation

1. Create package.json via npm - [npm documentation](https://docs.npmjs.com/creating-a-package-json-file)

   ```bash
     npm init
   ```

2. Install Atomic package globally via _npm_ (to use CLI commands)

   ```bash
     npm install atomicreact -g
   ```

3. Install Atomic package in your project via _npm_

   ```bash
     npm install atomicreact --save
   ```

4. **Initialize & Run Atomic** inside your project folder:

   ```bash
     Atomic
   ```

Then some files and dirs will be created and now you are already able to [**create your first Atom**](getStarted?id=creating-an-atom)

## Creating an Atom

There are 3 subfolders in `AtomicDir` (_myAtomicReactFolder_ by default):

```text
└── AtomicDir
    ├── html
    ├── js
    └── css
```

The `html` subfolder is the Atom's structure.

The `js` subfolder is the Atom's logic.

The `css` subfolder is the Atom's style.

**To create an Atom** just create any _.html_ file in `html` subfolder. **The file name is the Atom name or the Atom key**. Note if you let's the `debug` as _true_ in `AtomicReact_config.js` file you should see the Atom name on console.

For while just put the follow html code inside your Atom.

```html
<div>
  <h1>{props.myTitle}</h1>
  <h2>Hi! I'm a Atom</h2>
  <div atomic.nucleus></div>
</div>
```

_Notes:_

- Checkout the [`Atom`](Atom) for know more about Atom structure, logic and style

## Using an Atom

Let's supose you already have a _http server_ serving an _html_ file. Maybe with _Http Server from NodeJS_ , _Wamp Server_, _Apache Server_, whatever.

**To use an Atom** you need just import the bundles files from `BundleDir` in your _html_ file. Like this:

```html
<script src="./AtomicReactBundle/atomicreact.core.js"></script>
<script src="./AtomicReactBundle/atomicreact.bundle.js"></script>
<link rel="stylesheet" href="./AtomicReactBundle/atomicreact.bundle.css" />
```

And **use it tagging Atom key**:

```html
<body>
  <MyAtom props.myTitle="This's my title"> <h4>i'm in nucleus</h4> </MyAtom>
</body>
```

The _html_ file will look like this:

```html
<html>
  <head>
    <title>Hello AtomicReact App</title>

    <script src="./AtomicReactBundle/atomicreact.core.js"></script>
    <script src="./AtomicReactBundle/atomicreact.bundle.js"></script>
    <link rel="stylesheet" href="./AtomicReactBundle/atomicreact.bundle.css" />
  </head>

  <body>
    <MyAtom props.myTitle="This's my title"> <h4>i'm in nucleus</h4> </MyAtom>
  </body>
</html>
```

After AtomicReact render the page, your view will be:

```html
<html>
  <head>
    <title>Hello AtomicReact App</title>

    <script src="./AtomicReactBundle/atomicreact.core.js"></script>
    <script src="./AtomicReactBundle/atomicreact.bundle.js"></script>
    <link rel="stylesheet" href="./AtomicReactBundle/atomicreact.bundle.css" />
  </head>

  <body>
    <div data-atomic-key="MyAtom" data-atomic-id="MyAtom_0">
      <h1>This's my title</h1>
      <h2>Hi! I'm a Atom</h2>
      <div data-atomic-nucleus><h4>i'm in nucleus</h4></div>
    </div>
  </body>
</html>
```

That's all folks. You can see this on [Playground](https://playground-atomicreact.herokuapp.com/18QieJGnQoTn7wUVX6s82IENsPl4S0bjx)

**Next importants steps:**

- Learn more about [`Atom`](Atom)
