# Atom

The minimal particle is called by **Atom**. One Atom is formed by 3 parts:
* **Structure (HTML)**
* **Logic (JS)**
* **Style (CSS)**

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

### Props

The `Props` is the Atom's proprieties. Is used to set Atom's initial state.

**To use** a `prop`, just type `props.anyPropKey` **between pairs of braces** any where in *Atom's Structure*, like this:

```html
{props.<anyPropKey>}
```

**To set** a `prop`, just type `props.anyPropKey="someValue"` inside Atom's tagging.

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

## Logic (JS)

TODO

## Style (CSS)

TODO
