# Atomic Class

Atomic class is the core of AtomicReact. It renders an Atom and bundles the files.

## Constructor

```
constructor(Config [,HotReload])
```

Param | Description | Type |
------------ | ------------- | -------------
Config | Configuration object. [Chekout this link](getStarted?id=configuration-atomicreact_configjs) to know more about | `object`
HotReload | Used to enable the HotReload feature  | [`HotReload class`](HotReloadClass) |

## API Reference

### Overview
* [`add()`](AtomicClass?id=add)
* [`getAtom()`](AtomicClass?id=getatom)
* [`getNucleus()`](AtomicClass?id=getnucleus)
* [`getSub()`](AtomicClass?id=getsub)
* [`isRunning()`](AtomicClass?id=isrunning)
* [`printAtoms()`](AtomicClass?id=printatoms)
* [`renderElement()`](AtomicClass?id=renderelement)

### Reference

#### add()
``` js
Atomic.add(atomElement, AtomKey, props, where)
```
* **Description:**
Add an Atom inside an Atom's [**Nucleus**](Atom?id=nucleus).
* **Param:**

Param | Description | Type | Default value
------------ | ------------- | ------------- | -------------
atomElement | Atom which will be added an Atom | `DOM Element` |
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

#### getAtom()
``` js
Atomic.getAtom(AtomKey)
```
* **Description:**
Get an [`Atom`](Atom) by its key
* **Param:**

Param | Description | Type
------------ | ------------- | -------------
AtomKey | Atom key | `string` |

* **Return:** [Atom](Atom)

---

#### getNucleus()
``` js
Atomic.getNucleus(atomElement)
```
* **Description:**
Get the Atom's [*Nucleus element*](Atom?id=nucleus)
* **Param:**

Param | Description | Type
------------ | ------------- | -------------
atomElement | Atom which will be get the nucleus | `DOM Element`

* **Return:** the nucleus element as `DOM Element`

---

#### getSub()
``` js
Atomic.getSub(atomElement, subName)
```
* **Description:**
Get an Atom's [*sub element*](Atom?id=sub) by its name.
* **Param:**

Param | Description | Type
------------ | ------------- | -------------
atomElement | Atom which sub element is in | `DOM Element`
subName | Sub's name declarated in [Atom Structure - Sub](Atom?id=sub) | `string`

* **Return:** the sub element as `DOM Element`

---

#### isRunning()
``` js
Atomic.isRunning()
```
* **Description:**
Verify if AtomicReact is running
* **Param:** void

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
