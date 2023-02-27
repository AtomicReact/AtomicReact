/// <reference types="node" resolution-mode="require"/>
import { ParsedPath } from "path";
import { HotReload } from "./modules/hot_reload.js";
import { TranspileOptions } from "typescript";
import { IAtom, IGlobal } from "./lib.js";
export { HotReload } from "./modules/hot_reload.js";
export * from "./lib.js";
export interface IConfig {
    atomicDir: string;
    bundleDir: string;
    debug: boolean;
    packageName: string;
}
export declare class Atomic {
    global: IGlobal;
    config: IConfig;
    static hotReload: HotReload;
    atoms: Array<IAtom>;
    constructor(config: IConfig, hotReload: any);
    static readAtomsDir(dirPath: string, callback: (atomKey: string, filePath: string, parsedPath: ParsedPath) => void, extensions?: string[], atomKey?: string): void;
    init(): void;
    addAtomo(atom: IAtom): void;
    printAtoms(): void;
    static exportFunction(funcao: Function): string;
    static getTranspileOptions(moduleName: string): TranspileOptions;
    bundle(): Promise<void>;
}
