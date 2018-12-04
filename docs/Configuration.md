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

`atomicDir` : the path where Atoms will be. **Note:** in this documentation, we call `AtomicDir` to refer this path

`bundleDir` : the path where all Atoms will be bundled, normally a public dir. **Note:** in this documentation, we call `BundleDir` to refer this path

`debug` : whether mensages in console like infos and warns will be showed
