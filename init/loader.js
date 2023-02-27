// @ts-nocheck

if (this["PACKAGE_NAME"] == undefined) {
    Object.defineProperty(this, "PACKAGE_NAME", { value: "default", configurable: true });
}

const ATOMIC_REACT = "atomicreact"
const DEFINES = "defines"
const ATOMS = "atoms"

if (this[ATOMIC_REACT] == undefined) {
    Object.defineProperty(this, ATOMIC_REACT, { value: {} })
}
if (this[ATOMIC_REACT][DEFINES] == undefined) {
    Object.defineProperty(this[ATOMIC_REACT], DEFINES, { value: {} });
}
if (this[ATOMIC_REACT][ATOMS] == undefined) {
    Object.defineProperty(this[ATOMIC_REACT], ATOMS, { value: {} });
}


if (gotoEndOfPath == undefined) {
    function gotoEndOfPath(context, next, paths, contextPath = "") {

        if (context[next] == undefined) {
            Object.defineProperty(context, next, { value: {}, configurable: true })
        }

        if (paths.length == 1) {
            return { context: context[next], path: paths[0], contextPath }
        }

        context = context[next]
        next = paths[0]
        paths.shift()
        contextPath += `${contextPath == "" ? "" : "/"}${next}`
        return gotoEndOfPath(context, next, paths, contextPath)
    }
}

if (getValueOfPath == undefined) {
    function getValueOfPath(context, paths) {
        if (paths.length == 1) {
            return context[paths[0]] || null
        }
        const next = paths[0]
        if (context[next] == undefined) {
            return null
        }
        paths.shift()
        return getValueOfPath(context[next], paths)
    }
}

if (resolveModuleName == undefined) {
    function resolveModuleName(moduleName) {
        return moduleName.replaceAll("../", "").replaceAll("./", "").replaceAll(".ts", "").replaceAll(".js", "")
    }
}

if (isLocalModule == undefined) {
    function isLocalModule(moduleName) {
        return (moduleName.indexOf("./") == 0 && moduleName.indexOf("../") == -1)
    }
}

if (sumPath == undefined) {
    function sumPath(absolutePath, relativePath) {
        let absolute = absolutePath.split("/")
        const backTimes = relativePath.split("../").length - 1
        if (absolute.length <= backTimes) return resolveModuleName(relativePath)
        absolute.splice(absolute.length - backTimes)
        return resolveModuleName(`${absolute.join("/")}${absolutePath == "" ? "" : "/"}${relativePath}`)
    }
}

if (require == undefined) {
    function require(moduleName, contextPath = "") {

        if (moduleName === ATOMIC_REACT) {
            return (this[ATOMIC_REACT]["lib"] || this[ATOMIC_REACT])
        }

        if (moduleName.indexOf("./") >= 0) {

            const path = sumPath(contextPath, moduleName)
            const paths = path.split("/")

            return getValueOfPath(this[ATOMIC_REACT][ATOMS][PACKAGE_NAME], paths)
        }

        return (this[ATOMIC_REACT][ATOMS][resolveModuleName(moduleName)] || this[ATOMIC_REACT])
    }
}

if (define == undefined) {
    function define(moduleName, inputs, func, forceDefine = false) {
        let _exports = { "__esModule": true }

        if (moduleName === ATOMIC_REACT && !ATOMIC_REACT[moduleName]) {
            func(require, _exports, ...inputs.slice(2).map(i => require(i)))

            if (this[ATOMIC_REACT].lib == undefined) {
                Object.defineProperty(this[ATOMIC_REACT], "lib", { value: _exports })
            }
            if (this.AtomicReact == undefined) {
                Object.defineProperty(this, "AtomicReact", { value: this[ATOMIC_REACT].lib.AtomicReact })
            }

            return
        }

        const paths = moduleName.split("/")

        let { context, path, contextPath } = gotoEndOfPath(this[ATOMIC_REACT][ATOMS], PACKAGE_NAME, paths)

        console.log("==>>> ", moduleName, contextPath)

        const imports = [require, _exports, ...inputs.slice(2).map(i => require(i, contextPath))]

        let canDefine = true
        for (let i = 0; i < imports.length; i++) {
            if (imports[i] !== null) continue

            /* let's schedule to define this module when the import was defined */
            let moduleNameFuture = sumPath(contextPath, inputs[i])
            console.log("\t moduleNameFuture => ", moduleNameFuture)
            // let moduleNameFuture = resolveModuleName()

            let endOfPath = gotoEndOfPath(this[ATOMIC_REACT][ATOMS], PACKAGE_NAME, moduleNameFuture.split("/"))

            console.log("\t\t", moduleName, "[NO]", inputs[i], endOfPath)


            if (this[ATOMIC_REACT][DEFINES][moduleNameFuture] == undefined) {
                Object.defineProperty(this[ATOMIC_REACT][DEFINES], moduleNameFuture, { value: {}, configurable: true })
            }

            Object.defineProperty(this[ATOMIC_REACT][DEFINES][moduleNameFuture], moduleName, {
                value: () => {
                    define(moduleName, inputs, func, true)
                }, configurable: true
            })
        }


        func(...imports)
        Object.defineProperty(context, path, { value: _exports, configurable: true })

        Object.getOwnPropertyNames(_exports).forEach(_exportKey => {

            if (_exports[_exportKey].__proto__.name && _exports[_exportKey].__proto__.name == "AtomicClass") {
                const atomKey = _exports[_exportKey].name

                console.log(`Found atom class: ${_exports[_exportKey].name}`)
                const atom = AtomicReact.atoms.find(atom => atom.key === atomKey)
                if (atom) {
                    atom.mainClass = _exports[_exportKey]
                }
            }

        })


        if (this[ATOMIC_REACT][DEFINES][moduleName] != undefined) {
            console.log(`${moduleName} dependents:`, this[ATOMIC_REACT][DEFINES][moduleName])
            for (let dependent of Object.getOwnPropertyNames(this[ATOMIC_REACT][DEFINES][moduleName])) {
                this[ATOMIC_REACT][DEFINES][moduleName][dependent]()
            }
            delete this[ATOMIC_REACT][DEFINES][moduleName]
        }

    }
}

if (addAtomStruct == undefined) {
    function addAtomStruct(packageName, atomKey, struct) {
        if (this[ATOMIC_REACT][ATOMS][PACKAGE_NAME][atomKey] == undefined) {
            Object.defineProperty(this[ATOMIC_REACT][ATOMS][PACKAGE_NAME], atomKey, { value: {} })
        }
        this[ATOMIC_REACT][ATOMS][PACKAGE_NAME][atomKey].__proto__.struct = struct
    }
}