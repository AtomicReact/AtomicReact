# Atomic CLI

AtomicReact CLI is used to help the developer and to automate commands.

## Overview
* [`Atomic init`](AtomicCLI?id=atomic-init)
* [`Atomic run`](AtomicCLI?id=atomic-run)
* [`Atomic`](AtomicCLI?id=atomic)
* [`Atomic install`](AtomicCLI?id=atomic-install)
* [`Atomic uninstall`](AtomicCLI?id=atomic-uninstall)

## Commands

### Atomic init

```bash
Atomic init
```

* **Description:**
`Atomic init` command creates the initial files ([`AtomicReact_config.js`](Configuration) and [`AtomicReact_run.js`](Running)).

### Atomic run

```bash
Atomic run
```

* **Description:**
`Atomic run` command runs AtomicReact using [`AtomicReact_run.js`](Running) file.

### Atomic

```bash
Atomic
```

* **Description:**
`Atomic` is an alias for **[`Atomic init`](AtomicCLI?id=atomic-init) + [`Atomic run`](AtomicCLI?id=atomic-run)** commands.

### Atomic install

```bash
Atomic install <packageName>
```

* **Description:**
`Atomic install` command installs a AtomicReact package published on [NPM](https://www.npmjs.com/).

* **Param:**

Param | Description
------------ | -------------
packageName | Package name to install

* **Note:**
  * This command alters your `package.json`

### Atomic uninstall

```bash
Atomic uninstall <packageName>
```

* **Description:**
`Atomic uninstall` command uninstalls a AtomicReact package installed.

* **Param:**

Param | Description
------------ | -------------
packageName | Package name to uninstall

* **Note:**
  * This command alters your `package.json`
