import { Atomic, HotReload, IConfig } from "atomicreact"
import { readFileSync } from "fs";
import { join, resolve } from "path";

const config: IConfig = {
    atomicDir: "src/atomicreact", /* Dir where your atoms is */
    bundleDir: "public_static/libs/atomicreact", /* Dir where bundles will be create */
    debug: true, /* Enable log */
    packageName: JSON.parse(readFileSync(resolve(process.cwd(), "package.json"), {encoding: "utf-8"})).name /* Use package.name as atomicreact module name. Set as you prefer */
}

export function run() {
    /* initialize HotReload */
    const myHotReload = (process.env.ENV == "development") ? new HotReload(1337, 'localhost') : null; /* Create HotReload on localhost:1337 only in development */

    /* Listen all changes in custom files */
    myHotReload.addToWatch(resolve(process.cwd(), "src", "views", "index.html")); /*  */

    /* Initialize Atomic */
    const atomic = new Atomic(config, myHotReload); /* initialize Atomic using HotReload */

    /* You can create others atomic */
    // const atomic2 = new Atomic(config2, myHotReload); /* initialize Atomic2 same HotReload */
}

