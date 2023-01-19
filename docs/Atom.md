# Atom

The smallest particle is called by **Atom**. One Atom is composed by 3 parts:
* [**Structure (HTML)**](Atom?id=structure-html)
* [**Logic (JS)**](Atom?id=logic-js)
* [**Style (CSS)**](Atom?id=style-css)

Fundamentally, an Atom **needs to have a structure but doesn't need a logic and style**.
After runnning [`Atomic` command](AtomicCLI?id=atomic),  your `AtomicDir` is created and that's where your Atoms will be .
In the `AtomicDir` there are three directories: *html, js, css*.
``` text
└── AtomicDir
    ├── html
    ├── js
    └── css
```

The `html`subfolder is the **Atom's structure**.

The `js` subfolder is the **Atom's logic**.

The `css` subfolder is the **Atom's style**.

**In order to generate an Atom** just create an *.html* file in the `html` subfolder. **The name of the file is the Atom name or the Atom key**. Note that if you change the `debug` to *true* in the `AtomicReact_config.js` file then you should see the Atom loaded on console.

Let's suppose you have created a file called `MyFirstAtom.html` in the `html` subfolder. Therefore the Atom Key is: *`MyFirstAtom`*.

## Structure (HTML)

``` text
└── AtomicDir
    ├── html   <<<---
    ├── js
    └── css
```

Inside `AtomicDir/html` will be the Atom's structure. Each Atom has its own file structure with an `.html` extension. **The name of the file is the Atom name or the Atom key**, so if you create a file called `MyFirstAtom.html` inside `AtomicDir/html` then your **Atom key** is `MyFirstAtom`.

The Atom's struture is any *html* struture, but it is recommended that each structure stays within a **single tag**. For exemple:

In `MyFirstAtom.html` file:

**Recommended:**
```html
<div>
  <!-- All Atom's structure will be here -->
</div>
```

**Not recommended (but possible):**
```html
<div>Foo</div>
<div>Bar</div>
```

### Overview
* [`nucleus`](Atom?id=nucleus)
* [`props`](Atom?id=props)
* [`sub`](Atom?id=sub)

### Nucleus

**`nucleus`** is the place where all Atom's children are located.

**In order to set** the Atom's `nucleus`, just type `atomic.nucleus` inside Atom's struture.

```html
<AnyTag atomic.nucleus></AnyTag>
<!-- Note: AnyTag maybe a Html Tag or a Atom Key also -->
```

**To add** something in *nucleus*, just insert it inside Atom's tagging. See below:
```html
  <MyFirstAtom>
    <!-- All here will be on Nucleus even this comment  -->
    <h2>Hey! I'll be inside Atom's Nucleus !</h2>
  </MyFirstAtom>
```

You can also add an Atom programmatically with [`add()`](Atom?id=add) function.

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
You can see this example on [Playground](https://playground-fre5.onrender.com/1ve7ZgLSM8rsN8ZPDgKM-25F-YQn8nbQ7)

### Props

`props` are the Atom's properties. They're used to set Atom's initial state.

**To use** `props`, just type `props.anyPropKey` **between pairs of braces** anywhere in the *Atom's Structure*, as follows:

```html
{props.<anyPropKey>}
```

**To assign**  `props` a value, just type `props.anyPropKey="someValue"` inside Atom's tagging, see below:

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
You can see this example on [Playground](https://playground-fre5.onrender.com/1K16qhgvUc-IVJVMDiWisjO9tBPf7Lxyw)

### Sub

An Atom may have *important elements* which can be handled, they're called **`sub`  particles**. The `atomic.sub` is used for setting any element inside an Atom as its *sub part* making it easier to get with the [`getSub()`](Atom?id=getsub) function. An Atom can have none, one or many `sub`.

**To set** any element as `sub`, just type `atomic.sub="anySubName"` inside the elements tagging.
```html
<AnyTag atomic.sub="anySubName"></AnyTag>
<!-- Note: AnyTag may be a Html Tag or a Atom Key also -->
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

You can see this example on [Playground](https://playground-fre5.onrender.com/1oijsksTIpt0CjajAgpXPJA2FfV89OFqT)

## Logic (JS)

``` text
└── AtomicDir
    ├── html
    ├── js     <<<---
    └── css
```

Inside `AtomicDir/js` is the Atom's whole logic. Each Atom has its own logic, so if you create an Atom called by `MyFirstAtom.html` on `AtomicDir/html`, its respective logic will be in `AtomicDir/js/MyFirstAtom.js`.

### Main Class

All Atom's logic code will be **inside the main class** and you can export it with `module.exports.main` like:

```js
class MyMain {
  /* [...] */
}
module.exports.main = MyMain; //export MyMain Class as main
```

So we can use reserved functions or create custom functions inside the main class, like this:

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

You can see this example on [Playground](https://playground-fre5.onrender.com/1trq_CV833nF3vT6tjX1INshjhR4uPWHn)

**Note**:
* use `module.exports.main = <anyClass>` to export the main class (see last line in example above)
* four reserved functions were used in example above:[`getElement()`](Atom?id=getelement), [`getNucleus()`](Atom?id=getnucleus), [`onAdded`](Atom?id=onadded), [`onRender`](Atom?id=onrender).

The main class is exported to two places: [`Global Atomic Class`](AtomicClass) and to **Atomic object inside atom element**. See [Accessing Main Class](Atom?id=accessing-main-class) to know more.

#### Accessing Main Class

Sometimes we may want to access the main class from another Atom. We can do this accesing the `Atomic.main` class in an Atom element.

For example, let's suppose we have two Atoms (*myFirstAtom* and *mySecondAtom*) and the *myFirstAtom*'s logic is:

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

And then we want to call **myFunction()** in *myFirstAtom*'s main class from *mySecondAtom*. So the *mySecondAtom*'s logic will be:

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

You can see this example on [Playground](https://playground-fre5.onrender.com/1hFkTzjJt82ZU9oAu12Ikzhxgxa4-AFT9)

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
A key pair object containing the prop's key declared in [Atom's Structure](Atom?id=props) and its value. As follows:
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
this function is fired when another Atom is added inside the Atom.

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
this function is called when an Atom is rendered.

* **Param:** void

---

## Style (CSS)

``` text
└── AtomicDir
    ├── html
    ├── js
    └── css    <<<---
```

Inside `AtomicDir/css` will be all of the Atom's style. It's recommended that each Atom's style stays within a single file. When AtomicReact bundles the styles, it just joins all css files into one.

In order to style an Atom we just **code a normal CSS with selectors** using `data-atomic-key`, `data-atomic-nucleus` and `data-atomic-sub` attributes. See the example below:

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
And suppose we want to style the Atom's nucleus with `background-color: #00F`:

```css
[data-atomic-key="MyFirstAtom"] > [data-atomic-nucleus]{
  background-color: #00F;
}
```

### Styling the Atom's Sub
And that we want to style the `myTitle` Atom's sub with `color: #0F0`:

```css
[data-atomic-key="MyFirstAtom"] > [data-atomic-sub="myTitle"]{
  color: #0F0;
}
```
