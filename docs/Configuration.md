# Configuration

All AtomicReact configuration is made on **`AtomicReact_config.js`**.

From initial `AtomicReact_config.js`:
``` js
module.exports = {
  atomicDir: 'myAtomicReactFolder',
  bundleDir: 'myPublicDir/AtomicReactBundle',
  debug: true
}
```
Where:

`atomicDir` : the path where Atoms stays. **Note that:** in this documentation, we call `AtomicDir` to refer to this path

`bundleDir` : the path where all Atoms are bundled, normally a public dir. **Note that:** in this documentation, we call `BundleDir` to refer to this path

`debug` : whether messages in console (infos or warns) are showed
