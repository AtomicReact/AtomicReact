export interface IClientVariables {
    Atomic: string;
    Props: string;
    Id: string;
    Key: string;
    Nucleus: string;
    Sub: string;
    SubOf: string;
}
export declare const ClientVariables: IClientVariables;
export interface IAtomicVariables {
    Nucleus: string;
    Sub: string;
}
export declare const AtomicVariables: IAtomicVariables;
export interface IAtomicElement extends Element {
    Atomic: {
        id: string;
        main: AtomicClass;
    };
}
export interface IProp {
    key: string;
    value: string;
}
export interface IAtom {
    key: string;
    struct?: string;
    main?: AtomicClass;
    mainClass?: typeof AtomicClass;
}
export interface IAtomList {
    key: string;
    id: string;
}
export interface IGlobal {
    name: string;
    version: string;
    isClientSide: boolean;
    atomosRendered: {
        count: number;
        id: [];
    };
}
interface IHotReload {
    addrs: string;
    port: number;
}
export declare class AtomicReact {
    static atoms: Array<IAtom>;
    static hotReload: IHotReload;
    constructor();
    static getAtom(atomKey: IAtom["key"]): any;
    static renderPageOnLoad(): void;
    static enableHotReloadOnClient(addrs: string, port: number): void;
    static makeID(length: any): string;
    static replaceExpressao(expressao: any, expressaoParaSerReplaced: any, source: any, expressaoIsAFlag?: boolean): any;
    static getGeoCursorTag(source: any, TagKey: any, caseSensitivy?: boolean): {
        open: {
            start: number;
            end: number;
        };
        close: {
            start: number;
            end: number;
        };
    };
    static renderAtomo(source: string, atom: IAtom, atomList: Array<IAtomList>): {
        source: string;
        end: boolean;
    };
    static loopRender(source: string, atom: IAtom, atomList: Array<IAtomList>): any;
    static render(source: string, atomList?: Array<IAtomList>): string;
    static renderElement(domElement: Element): void;
    static createAtomClass(atomList: IAtomList[]): void;
    static notifyAtomOnRender(atomList: IAtomList[]): void;
    static getSub<T>(atomElement: IAtomicElement, subName: string): T;
    static getNucleus(atomElement: IAtomicElement): Element;
    static getElement(atomId: string): IAtomicElement;
    static add(atomElement: IAtomicElement, atomKey: IAtom["key"], props: IProp[], where: InsertPosition): IAtomicElement;
}
export declare class AtomicClass {
    id: string;
    constructor(id: string);
    getElement(): IAtomicElement;
    add(atomKey: IAtom["key"], props: any, where: any): IAtomicElement;
    getNucleus(): Element;
    getSub<T>(subName: string): T;
    onRender(): void;
    onAdded(atomAdded: IAtomicElement): void;
}
export {};
