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

**To set** the Atom's `nucleus`, just type `atomic.nucleus` inside Atom's struture.

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

You can also add an Atom programatically with [`add()`](Atom?id=add) function.

#### Exemple:

In `MyFirstAtom.html`:
```html
<div>
  <h1>This is MyFirstAtom</h1>
  <ul atomic.nucleus></ul> <!-- Set this ul as nucleus -->
</div>
```

In `index.html`:
```html
<MyFirstAtom>
    <li>Foo</li>
    <li>Bar</li>
    <li>The life is good</li>
</MyFirstAtom>
```
You can see this example on [Playground](https://playground-atomicreact.herokuapp.com/1ve7ZgLSM8rsN8ZPDgKM-25F-YQn8nbQ7)

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
You can see this example on [Playground](https://playground-atomicreact.herokuapp.com/1K16qhgvUc-IVJVMDiWisjO9tBPf7Lxyw)

### Sub

An Atom can have *important elements* which we could like handle them, they are **`sub`  particles**. The `atomic.sub` is used for set any element inside an Atom as its *sub part* and easily to get it with [`getSub()`](Atom?id=getsub) function. An Atom can have none, one or more `sub`.

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
  onRender() {
    var btnShowAlert = this.getSub('btnShowAlert'); //get button element DOM

    btnShowAlert.onclick = function(e){ //button's onclick event
      alert("the button was clicked"); // alert a message
    }
  }
}
module.exports.main = MyMain;
```

In `index.html`:
```html
<MyFirstAtom></MyFirstAtom>
```

You can see this example on [Playground](https://playground-atomicreact.herokuapp.com/1oijsksTIpt0CjajAgpXPJA2FfV89OFqT)

## Logic (JS)

``` text
└── AtomicDir
    ├── html
    ├── js     <<<---
    └── css
```

Inside `AtomicDir/js` will be all Atom's logic. Each Atom has your own logic, so if you create an Atom called by `MyFirstAtom.html` on `AtomicDir/html`, its logic will be in `AtomicDir/js/MyFirstAtom.js`.

### Main Class

All Atom's logic code will be **inside the main class** and exports it with `module.exports.main` like:

```js
class MyMain {
  /* [...] */
}
module.exports.main = MyMain; //export MyMain Class as main
```

So we can use reserved functions, create custom functions inside the main class, like this:

```js
class MyMain {
  onRender() {
    /* Does something when this atom is rendered */
    console.log('atom: ', this.getElement());
    console.log("atom's nucleus", this.getNucleus(atom));
    this.myFunction();
  }
  onAdded(atomAdded) {
    /* Does something when other atom is added inside this atom's nucleus */
    console.log('atomAdded: ', atomAdded);
    console.log('atom: ', this.getElement());
  }
  myFunction() {
    /* myFunction is a custom function */
    alert('Hey! this is myFunction !');
  }
}
module.exports.main = MyMain; //export MyMain Class as main
```

You can see this example on [Playground](https://playground-atomicreact.herokuapp.com/1trq_CV833nF3vT6tjX1INshjhR4uPWHn)

**Note**:
* use `module.exports.main = <anyClass>` to export the main class (see last line in example above)
* four reserved functions were used in example above:[`getElement()`](Atom?id=getelement), [`getNucleus()`](Atom?id=getnucleus), [`onAdded`](Atom?id=onadded), [`onRender`](Atom?id=onrender).

The main class is exported to two places: [`Global Atomic Class`](AtomicClass) and to **Atomic object inside atom element**. See [Accessing Main Class](Atom?id=accessing-main-class) to know more.

#### Accessing Main Class

Sometimes may we want to access the main class from another Atom. We can do this accesing the `Atomic.main` class in an Atom element.

For example, let's supose we have two Atoms (*myFirstAtom* and *mySecondAtom*) and the *myFirstAtom*'s logic is:

`myFirstAtom.js`
```js
class MyFirstAtomMain {
  onRender() {}
  myFunction() {
    alert('Hey! this is myFunction !');
  }
}
module.exports.main = MyFirstAtomMain;
```

And we want to call **myFunction()** in *myFirstAtom*'s main class from *mySecondAtom*. So the *mySecondAtom*'s logic will be:

`mySecondAtom.js`
```js
class MySecondAtomMain {
  onRender() {
    var myFirstAtom = this.getSub('myFirstAtomSub'); //see the note¹
    myFirstAtom.Atomic.main.myFunction();

    // You can also access myFunction using Global Atomic Class:
    Atomic.getAtom('myFirstAtom').main.myFunction(); //see note²
  }
}
module.exports.main = MySecondAtomMain;
```

You can see this example on [Playground](https://playground-atomicreact.herokuapp.com/1hFkTzjJt82ZU9oAu12Ikzhxgxa4-AFT9)

**Note**:
* [1] - In example above *myFirstAtom* is a [sub part](Atom?id=sub) of *mySecondAtom*:

`mySecondAtom.html`
```html
<div>
  <myFirstAtom atomic.sub="myFirstAtomSub"></myFirstAtom>
</div>
```
* [2] - Checkout [`Atomic.getAtom()`](AtomicClass?id=getatom)

---

The main class **exported to Atom element** has some reserved functions. See below:

### Overview
* [`add()`](Atom?id=add)
* [`getElement()`](Atom?id=getelement)
* [`getNucleus()`](Atom?id=getnucleus)
* [`getSub()`](Atom?id=getsub)
* [`onAdded`](Atom?id=onadded)
* [`onRender`](Atom?id=onrender)

### add()
``` js
add(AtomKey, props, where)
```
* **Description:**
Add an Atom inside an Atom's [**Nucleus**](Atom?id=nucleus).
* **Param:**

Param | Description | Type | Default value
------------ | ------------- | ------------- | -------------
AtomKey | key of Atom will be added | `string` |
props | Atom's [`Prop`](AtomicClass?id=prop) array | `Prop Array` | [ ]
where | Representing the position relative to the element's nucleus tag. Must be: `beforebegin`, `afterbegin`, `beforeend` or `afterend`. [Checkout this](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML#Parameters) to know more. | `string` | *beforeend*

##### Prop:
A key pair object containing the prop's key declarated in [Atom's Structure](Atom?id=props) and its value. Example:
``` js
{
  key: "myTitle",
  value: "This is my title"
}
```

Where:

`key`'s value is a `string`

`value`'s value is a `string`

* **Return:** atom element added as `DOM Element`

---

### getElement()
``` js
getElement()
```
* **Description:**
Get the Atom's [*element*](https://www.w3schools.com/jsref/dom_obj_all.asp)
* **Param:** void

* **Return:** the element as `DOM Element`

---

### getSub()
``` js
getSub(subName)
```
* **Description:**
Get an Atom's [*sub element*](Atom?id=sub) by its name.
* **Param:**

Param | Description | Type
------------ | ------------- | -------------
subName | Sub's name declarated in [Atom Structure - Sub](Atom?id=sub) | `string`

* **Return:** the sub element as `DOM Element`

---

### getNucleus()
``` js
getNucleus()
```
* **Description:**
Get the Atom's [*Nucleus element*](Atom?id=nucleus)
* **Param:** void

* **Return:** the nucleus element as `DOM Element`

---

### onAdded()

``` js
onAdded(atomAdded)
```

* **Description:**
this function is fired when other Atom was added inside the Atom.

* **Param:**

Param | Description | Type
------------ | ------------- | -------------
atomAdded | Atom which was added | `DOM Element`

---

### onRender()

``` js
onRender()
```

* **Description:**
this function is fired when an Atom was rendered.

* **Param:** void

---

## Style (CSS)

``` text
└── AtomicDir
    ├── html
    ├── js
    └── css    <<<---
```

Inside `AtomicDir/css` will be all Atom's style. Is recommended each Atom's style stay be in a file. When AtomicReact bundle the styles, it just joins all css files into one.

To style an Atom we just **code a normal CSS with selectors** using `data-atomic-key`, `data-atomic-nucleus` and `data-atomic-sub` attributes. See the example below:

**To consider the examples below, suppose the following `MyFirstAtom` Atom's Structure:**

```html
<div>
  <h2 atomic.sub="myTitle">The Order List</h2>
  <div atomic.nucleus></div>
</div>
```

### Styling the Atom
Let's suppose we want to style `MyFirstAtom` Atom with `border: 1px solid #F00`:

```css
[data-atomic-key="MyFirstAtom"] {
  border: 1px solid #F00;
}
```

### Styling the Atom's Nucleus
Let's suppose we want to style the Atom's nucleus with `background-color: #00F`:

```css
[data-atomic-key="MyFirstAtom"] > [data-atomic-nucleus]{
  background-color: #00F;
}
```

### Styling the Atom's Sub
Let's suppose we want to style the `myTitle` Atom's sub with `color: #0F0`:

```css
[data-atomic-key="MyFirstAtom"] > [data-atomic-sub="myTitle"]{
  color: #0F0;
}
```
