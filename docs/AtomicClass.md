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
* [`getAtom()`](AtomicClass?id=getatom)
* [`getChild()`](AtomicClass?id=getchild)
* [`getChildren()`](AtomicClass?id=getchildren)
* [`printAtoms()`](AtomicClass?id=printatoms)
* [`renderElement()`](AtomicClass?id=renderelement)

### Reference

#### addChildren()
``` js
Atomic.addChildren(element, AtomKey, props, where)
```
* **Description:**
Add an Atom inside an Atom's [**children tag**](Atom?id=structure-html).
* **Param:**

Param | Description | Type | Default value
------------ | ------------- | ------------- | -------------
element | Atom which will be added an Atom | `DOM Element` |
AtomKey | *Atom* key will be added | `string` |
props | Atom's [`Prop`](AtomicClass?id=prop) array | `Prop Array` | [ ]
where | Representing the position relative to the element's children tag. Must be: `beforebegin`, `afterbegin`, `beforeend` or `afterend`. [Checkout this](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML#Parameters) to know more. | `string` | *beforeend*

##### Prop:
A key pair object containing the prop's key declarated in [Atom Structure](Atom?id=structure-html) and value. Example:
``` js
{
  key: "myTitle",
  value: "This is my title"
}
```

* **Return:** void

---

#### getAtom()
``` js
Atomic.getAtom(AtomKey)
```
* **Description:**
Get an [`Atom`](Atom) by key
* **Param:**

Param | Description | Type
------------ | ------------- | -------------
AtomKey | Atom key | `string` |

* **Return:** [Atom](Atom)

---

#### getChild()
``` js
Atomic.getChild(element, child)
```
* **Description:**
Get an Atom's [*child element*](Atom?id=structure-html)
* **Param:**

Param | Description | Type
------------ | ------------- | -------------
element | Atom which child is in | `DOM Element`
child | Child name declarated in [Atom Structure](Atom?id=structure-html) | `string`

* **Return:** the child element as `DOM Element`

---

#### getChildren()
``` js
Atomic.getChildren(element)
```
* **Description:**
Get the Atom's [*children element*](Atom?id=structure-html)
* **Param:**

Param | Description | Type
------------ | ------------- | -------------
element | Atom which children is in | `DOM Element`

* **Return:** the children element as `DOM Element`

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

#### renderElement()
``` js
Atomic.renderElement(domElement)
```
* **Description:**
Render an DOM Element
* **Param:**

Param | Description | Type
------------ | ------------- | -------------
domElement | element to be rendered | `DOM Element`

* **Return:** void

---
