# Atomic Class

Atomic class is the core of AtomicReact. It render an Atom and bundle the files.

## Constructor

```
constructor(Config [,HotReload])
```

Param | Description | Type |
------------ | ------------- | -------------
Config | Configuration object. [Chekout this link](getStarted?id=configuration-atomicreact_configjs) to know more about | `object`
HotReload | Used for enable HotReload feature  | [`HotReload class`](HotReloadClass) |

## API Reference

### Overview
* [`addChildren()`](AtomicClass?id=addchildren)
* [`getAtom()`]()
* [`getChild()`]()
* [`getChildren()`]()
* [`printAtoms()`](AtomicClass?id=printatoms)
* [`renderElement()`]()

### Reference

#### addChildren()
``` js
Atomic.addChildren(element, AtomoKey, props, where)
```
* **Description:**
Add an Atom inside another Atom.
* **Param:**

Param | Description | Type | Default value
------------ | ------------- | -------------
element | Atom where will be added an Atom | `DOM Element` |
AtomoKey | *Atom Key* will be added | `string` |
props | Atom's [`Prop`](AtomicClass?id=prop) array | `Prop Array` | [ ]
where | Representing the position relative to the element's children tag. Must be: `beforebegin`, `afterbegin`, `beforeend` or `afterend`. [Checkout this](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML#Parameters) to know more. | `string` | *beforeend*

##### Prop:
A key pair object containing the prop's key and value. Example:
``` js
{
  key: "myTitle",
  value: "This is my title"
}
```

* **Return:** void

---

#### printAtoms()
``` js
Atomic.printAtoms()
```
* **Description:**
Print on console all Atoms loaded
* **Param:** void
* **Return:** void
---
