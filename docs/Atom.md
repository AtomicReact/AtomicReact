# Atom

The minimal particle is called by **Atom**. One Atom is formed by 3 parts:
* [**Structure (HTML)**](Atom?id=structure-html)
* [**Logic (JS)**](Atom?id=logic-js)
* [**Style (CSS)**](Atom?id=style-css)

Necessarily, an Atom **need to have a structure but doesn't need a logic and style**.
After runs [`Atomic` command](AtomicCLI),  is created your `AtomicDir` where your Atoms will be.
In `AtomicDir` there are three dirs: *html, js, css*.
``` text
└── AtomicDir
    ├── html
    ├── js
    └── css
```

The `html`sub folder  is the **Atom's structure**.

The `js` sub folder is the **Atom's logic**.

The `css` sub folder is the **Atom's style**.

**To create an Atom** just create any *.html* file in `html` sub folder. **The file name is the Atom name or the Atom key**. Note if you let's the `debug` as *true* in `AtomicReact_config.js` file you should see the Atom loaded on console.

Let's suppose you created a file called by `MyFirstAtom.html` in `html` sub folder. So, the Atom Key is: *`MyFirstAtom`*.

## Structure (HTML)

``` text
└── AtomicDir
    ├── html   <<<---
    ├── js
    └── css
```

### Props

The `props` are the Atom's proprieties. Are used to set Atom's initial state.

**To use** a `props`, just type `props.anyPropKey` **between pairs of braces** any where in *Atom's Structure*, like this:

```html
{props.<anyPropKey>}
```

**To set** a `props` value, just type `props.anyPropKey="someValue"` inside Atom's tagging. See below:

```html
<MyFirstAtom props.anyPropKey="someValue"></MyFirstAtom>
```

#### Exemple:

In `MyFirstAtom.html`:
```html
<div style="border: 1px solid {props.borderColor};">
  <h2>{props.theTitle}</h2>
</div>
```

In `index.html`:
```html
<MyFirstAtom props.theTitle="This is my Title" props.borderColor="#FF0000"></MyFirstAtom>
```

### Sub

An Atom can have *important elements* which we could like handle them, they are **`sub`  parts**. The `atomic.sub` is used for set any element inside an Atom as its *sub part* and easily to get it with [`Atomic.getSub()`](AtomicClass?id=getsub) function. An Atom can have none, one or more `sub`.

**To set** any element as `sub`, just type `atomic.sub="anySubName"` inside element's tagging.
```html
<AnyTag atomic.sub="anySubName"></AnyTag>
<!-- Note: AnyTag maybe a Html Tag or a Atom Key also -->
```

#### Exemple:

In `MyFirstAtom.html`:
```html
<div>
  <button atomic.sub="btnShowAlert">Show Message!</button>
</div>
```

In `MyFirstAtom.js`:
```js
module.exports.onRender = function(thisAtom){

  var btnShowAlert = Atomic.getSub(thisAtom, 'btnShowAlert'); //get button element DOM

  btnShowAlert.onclick = function(e){ //button's onclick event
    alert("the button was clicked"); // alert a message
  }

}
```

## Logic (JS)

``` text
└── AtomicDir
    ├── html
    ├── js     <<<---
    └── css
```

## Style (CSS)

``` text
└── AtomicDir
    ├── html
    ├── js
    └── css    <<<---
```
