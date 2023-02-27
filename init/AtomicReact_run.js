import { Atomic, HotReload, IConfig } from "atomicreact"

const config: IConfig = {
    atomicDir: "src/dashboard/atomicreact",
    bundleDir: "frontend/atomicreact",
    debug: false
}

export function run() {
    console.log(process.env.ENV)

    /* initialize HotReload */
    const myHotReload = (process.env.ENV == "development") ? new HotReload(1337, 'localhost') : null; //initialize HotReload on localhost:1337

    /* Listen all changes in custom files */
    // myHotReload.addToWatch(require('path').join(__dirname, 'index.html'));

    /* initialize Atomic */
    const atomic = new Atomic(config, myHotReload); //initialize Atomic using HotReload
    return atomic
}

