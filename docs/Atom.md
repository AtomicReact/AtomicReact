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

Inside `AtomicDir/html` will be Atom's structure. Each Atom has your own file structure with `.html` extension. **The file name is the Atom name or the Atom key**, so if you create a file called by `MyFirstAtom.html` inside `AtomicDir/html` your **Atom key** is `MyFirstAtom`.

Atom's struture is any *html* struture, but is recommended each structure be on a **single tag**. For exemple:

In `MyFirstAtom.html` file:

**Recommended:**
```html
<div>
  <!-- All Atom's structure will be here -->
</div>
```

**Not recommended (but you can):**
```html
<div>Foo</div>
<div>Bar</div>
```

### Overview
* [`nucleus`](Atom?id=nucleus)
* [`props`](Atom?id=props)
* [`sub`](Atom?id=sub)

### Nucleus

**`nucleus`** is the place where all Atom's children will be.

**To set** the Atom's `nucleus`, just type `atomic.nucleus` inside any Atom's element.

```html
<AnyTag atomic.nucleus></AnyTag>
<!-- Note: AnyTag maybe a Html Tag or a Atom Key also -->
```

**To add** something in *nucleus*, just insert inside Atom's tagging. See below:
```html
  <MyFirstAtom>
    <!-- All here will be on Nucleus even this comment  -->
    <h2>Hey! I'll be inside Atom's Nucleus !</h2>
  </MyFirstAtom>
```

You can also add an Atom programatically with [`Atomic.add()`](AtomicClass?id=add) function.

#### Exemple:

In `MyFirstAtom.html`:
```html
<div>
  <h1>I'm on atom's nucleus</h1>
  <div atomic.nucleus></div> <!-- Set this div as nucleus -->
  <h1>I'm under atom's nucleus</h1>
</div>
```

In `index.html`:
```html
<MyFirstAtom>
  <ul>
    <li>Foo</li>
    <li>Bar</li>
    <li>The life is good</li>
  </ul>
</MyFirstAtom>
```

### Props

`props` are the Atom's proprieties. Are used to set Atom's initial state.

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

An Atom can have *important elements* which we could like handle them, they are **`sub`  particles**. The `atomic.sub` is used for set any element inside an Atom as its *sub part* and easily to get it with [`Atomic.getSub()`](AtomicClass?id=getsub) function. An Atom can have none, one or more `sub`.

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
class MyMain {
  onRender(atom) {
    var btnShowAlert = Atomic.getSub(atom, 'btnShowAlert'); //get button element DOM

    btnShowAlert.onclick = function(e){ //button's onclick event
      alert("the button was clicked"); // alert a message
    }
  }
}
module.exports.main = MyMain;
```

## Logic (JS)

``` text
└── AtomicDir
    ├── html
    ├── js     <<<---
    └── css
```

Inside `AtomicDir/js` will be all Atom's logic. Each Atom has your own logic, so if you create an Atom called by `MyFirstAtom.html` on `AtomicDir/html`, its logic will be in `AtomicDir/js/MyFirstAtom.js`.

Your code will be **inside a class** and exports it with `module.exports.main` like:

```js
class MyMain {
  onRender(atom) {
    /* Does something when this atom is rendered */
    console.log('atom: ', atom);
    console.log("atom's nucleus", Atomic.getNucleus(atom));
    this.myFunction();
  }
  onAdded(atomAdded, atom) {
    /* Does something when other atom is added inside this atom  */
    console.log('atomAdded: ', atomAdded);
    console.log('atom: ', atom);
  }
  myFunction() {
    alert('Hey! this is myFunction !');
  }
}
module.exports.main = MyMain; //export MyMain Class as main
```

**Note**:
* use `module.exports.main = <someClass>` to export your main class (see last line in example above)
* two reserved functions was used in example above: [`onRender`](Atom?id=onrender) and [`onAdded`](Atom?id=onadded).

### Overview
* [`onRender`](Atom?id=onrender)
* [`onAdded`](Atom?id=onadded)

### onRender

``` js
onRender(atom)
```

* **Description:**
this function is fired when an Atom was rendered.

* **Param:**

Param | Description | Type
------------ | ------------- | -------------
atom | Atom which was rendered  | `DOM Element`

### onAdded

``` js
onAdded(atomAdded, atom)
```

* **Description:**
this function is fired when other Atom was added inside the Atom.

* **Param:**

Param | Description | Type
------------ | ------------- | -------------
atomAdded | Atom which was added | `DOM Element`
atom | Atom where was added inside your [`nucleus`](Atom?id=nucleus)  | `DOM Element`

## Style (CSS)

``` text
└── AtomicDir
    ├── html
    ├── js
    └── css    <<<---
```
