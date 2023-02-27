Object.defineProperty(this, "PACKAGE_NAME", { value: "{{PACKAGE_NAME}}", configurable: true })

if (this[ATOMIC_REACT][ATOMS][PACKAGE_NAME] == undefined) {
    Object.defineProperty(this[ATOMIC_REACT][ATOMS], `${PACKAGE_NAME}`, { value: {} });
}
