export interface IClientVariables {
    Id: string,
    Key: string,
    Nucleus: string,
    Sub: string,
    SubOf: string
}

export interface IAtomicVariables {
    Nucleus: string,
    Sub: string
}

export enum EAtomicEvent {
    LOGIC_LOADED = "<ATOMIC.LOGIC_LOADED>"
}
export type IAtomicEvents = {
    [key in (keyof typeof EAtomicEvent)]: EAtomicEvent
}
export interface IAtomicElement extends Element {
    Atomic: {
        id: string,
        main: AtomicClass
    }
}

export interface IProp {
    key: string,
    value: string
}

export interface IAtom {
    key: string,
    struct?: string
    main?: AtomicClass,
    mainClass?: typeof AtomicClass,
}

export interface IAtomList {
    key: string,
    id: string
}

export interface IGlobal {
    name: string,
    version: string,
    isClientSide: boolean,
    atomosRendered: {
        count: number,
        id: []
    },
}

interface IHotReload {
    addrs: string,
    port: number
}

export class AtomicReact {
    static atoms: Array<IAtom> = [];

    static hotReload: IHotReload

    static onLoad: () => void = null

    static ClientVariables: IClientVariables = {
        Id: "data-atomic-id",
        Key: "data-atomic-key",
        Nucleus: "data-atomic-nucleus",
        Sub: "data-atomic-sub",
        SubOf: "data-atomic-subof"
    }

    static AtomicVariables: IAtomicVariables = {
        Nucleus: "nucleus",
        Sub: "sub"
    }

    static AtomicEvents: IAtomicEvents = {
        LOGIC_LOADED: EAtomicEvent.LOGIC_LOADED
    }

    static enableHotReloadOnClient(addrs: string, port: number) {
        if (this["WebSocketClient"] != null && this["WebSocketClient"] != undefined) { return; }
        this["WebSocketClient"] = new WebSocket("ws://" + addrs + ":" + port);
        this["WebSocketClient"].onmessage = function (e) {
            console.log(e.data);
            if (e.data == "<atomicreact.hotreload.RELOAD>") {
                location.reload();
            }
        }
    }

    static makeID(length = 8) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }

    static replaceExpressao(expressao, expressaoParaSerReplaced, source, expressaoIsAFlag = false): string {
        expressaoIsAFlag = expressaoIsAFlag || false;
        let regexTag = new RegExp('<(.)*\\s+' + expressao + '(\\s*=([^>]*))', 'gi');

        if (expressaoIsAFlag == true) {
            regexTag = new RegExp('<(.)*\\s+' + expressao + '([^>]*)', 'gi');
        }

        expressao = expressao.replace('.', '\\.');

        let regexToReplace = new RegExp(expressao, 'gi');
        let match;
        let valor;
        while (match = regexTag.exec(source)) {
            valor = match[0].replace(regexToReplace, expressaoParaSerReplaced);
            source = source.slice(0, regexTag.lastIndex - match[0].length) + valor + source.slice(regexTag.lastIndex, source.length);
        }
        return source;
    }

    static renderElement(atomicClass: AtomicClass, domElement: Element): IAtomicElement {

        
        domElement.innerHTML = atomicClass.render();

        const rootAtom = document.querySelector(`[${AtomicReact.ClientVariables.Id}="${atomicClass.id}"]`) as IAtomicElement
        rootAtom.Atomic = {
            id: atomicClass.id,
            main: atomicClass
        }
  
        JSX["jsx-runtime"].queue.reverse().forEach((item) => {
            let atom = document.querySelector(`[${AtomicReact.ClientVariables.Id}="${item.id}"]`) as IAtomicElement
            atom.Atomic = {
                id: item.id,
                main: new (item.atomicClass)(item.id)
            }
            atom.Atomic.main.id = item.id
            
            /* Fire onRender events */
            if (atom.Atomic.main.onRender) atom.Atomic.main.onRender()
        })
        JSX["jsx-runtime"].queue = []

        rootAtom.Atomic.main.onRender()

        
        return rootAtom
    }


    static getSub<T>(atomElement: IAtomicElement, subName: string): T {
        return atomElement.querySelector(`[${AtomicReact.ClientVariables.SubOf}="${atomElement.getAttribute(AtomicReact.ClientVariables.Id)}"][${AtomicReact.ClientVariables.Sub}="${subName}"]`) as unknown as T;
    }
    static getNucleus(atomElement: IAtomicElement) {
        return document.querySelector(`[${AtomicReact.ClientVariables.Nucleus}="${atomElement.getAttribute(AtomicReact.ClientVariables.Id) }"]`);
    }
    static getElement(atomId: string): IAtomicElement {
        return document.querySelector(`[${AtomicReact.ClientVariables.Id}="${atomId}"]`) as IAtomicElement;
    }
    static add(atomElement: IAtomicElement, atomicClass: AtomicClass, props: IProp[], where: InsertPosition) {
        props = props || [];
        where = where || "beforeend";

        let elementoToBeCreate = atomicClass.render()// document.createElement(atomKey);

        //add props
        props.forEach((prop) => {
            /* elementoToBeCreate.setAttribute(AtomicReact.ClientVariables.Props + "." + prop.key, prop.value); */
        });

        let atomList: Array<IAtomList> = [];
        let renderedElement /* = AtomicReact.render(elementoToBeCreate.outerHTML, atomList); */

        let nucleusElement = AtomicReact.getNucleus(atomElement);
        nucleusElement!.insertAdjacentHTML(where, renderedElement);

        /* AtomicReact.createAtomClass(atomList); */

        let key = atomElement.getAttributeNode(AtomicReact.ClientVariables.Key).value;
        let atomAdded = AtomicReact.getElement(atomList[0].id);

        //notifyAtom onAdded
        if (atomElement.Atomic.main && atomElement.Atomic.main.onAdded) {
            atomElement.Atomic.main.onAdded(atomAdded);
        }
        // AtomicReact.atoms.forEach((atom: IAtom, index) => {
        //     if ((key == atom.key) && (AtomicReact.atoms[index].main != null) && (AtomicReact.atoms[index].main.onAdded != null)) {
        //     }
        // });

        return atomAdded;
    }
}



export class AtomicClass {

    public struct: (props?: any, atom?: IAtomList) => string = null

    constructor(public id?: string) {
        if (!this.id) this.id = AtomicReact.makeID()
    }

    render(): string {
        if (!this.struct) return ""

        const beforeAtom = Object.assign({}, JSX["jsx-runtime"].atom)
        JSX["jsx-runtime"].atom = {
            id: this.id,
            key: this["__proto__"]["constructor"]["name"]
        }

        let rendered = this.struct()

        const tag = rendered.trim()
        if (tag.startsWith("<") && tag.endsWith(">")) {
            const posToSplit = (tag.at(tag.length - 2) == "/") ? tag.length - 2 : tag.indexOf(">")
            rendered = `${tag.slice(0, posToSplit)} ${AtomicReact.ClientVariables.Key}="${this["__proto__"]["constructor"]["name"]}" ${AtomicReact.ClientVariables.Id}="${this.id}"${tag.slice(posToSplit, tag.length)}`
        }

        JSX["jsx-runtime"].atom = Object.assign({}, beforeAtom)
        return rendered
    }

    getElement(): IAtomicElement {
        return AtomicReact.getElement(this.id);
    }

    add(atomicClass: AtomicClass, props, where): IAtomicElement {
        return AtomicReact.add(this.getElement(), atomicClass, props, where);
    }

    getNucleus() {
        return AtomicReact.getNucleus(this.getElement());
    }

    getSub<T>(subName: string): T {
        return AtomicReact.getSub<T>(this.getElement(), subName)
    }

    /* Event fired when this Atom is rendered. */
    onRender() { }
    /* Event fired when another Atom is added inside this Atom */
    onAdded(atomAdded: IAtomicElement) { }
}

export function resolveModuleName(moduleName) {
    return moduleName.replaceAll("\\", "/").replaceAll("../", "").replaceAll("./", "").replaceAll(".tsx", "").replaceAll(".jsx", "").replaceAll(".ts", "").replaceAll(".js", "")
}

export const JSX = {
    ["jsx-runtime"]: {
        atom: null as IAtomList,
        queue: [] as (Array<{ id: string, atomicClass: typeof AtomicClass }>),
        jsxs(source: string | Function, props: { [id: string]: any }) {

            props = props || {}

            let atom: IAtomList = null
            if (typeof source == "function") {
                atom = {
                    key: source.name,
                    id: AtomicReact.makeID()
                }

                if (source["__proto__"]["name"] && source["__proto__"]["name"] === "AtomicClass") {
                    let instance = new (source as typeof AtomicClass)(atom.id)
                    instance.id = atom.id
                    this.queue.push({
                        id: atom.id,
                        atomicClass: (source as typeof AtomicClass)
                    })
                    source = instance.struct ? instance.struct : () => ("")
                }

                let beforeAtom = Object.assign({}, JSX["jsx-runtime"].atom)
                JSX["jsx-runtime"].atom = Object.assign({}, atom)
                source = (source as Function).call(this, props, atom) as string
                JSX["jsx-runtime"].atom = Object.assign({}, beforeAtom)
            }

            if (!props["children"] || typeof props["children"] == "string") props["children"] = [props["children"]]
            let attributes = Object.keys(props)
                .map(key => {
                    if (key == "children") return null
                    const value = props[key]
                    return `${key}="${value}"`
                })
                .filter(i => i != null)

            if (atom) {
                attributes.push(...[`${AtomicReact.ClientVariables.Key}="${atom.key}"`, `${AtomicReact.ClientVariables.Id}="${atom.id}"`])

                /* Nucleus */
                if (props["children"].length > 0) {
                    let regExpNucleusTag = new RegExp('<(.)*' + AtomicReact.AtomicVariables.Nucleus + '[^>]*', 'gi');
                    let openEndNucleusTag = -1;
                    while (regExpNucleusTag.exec(source)) {
                        openEndNucleusTag = regExpNucleusTag.lastIndex + 1;
                    }
                    if (openEndNucleusTag != -1) {
                        source = `${source.slice(0, openEndNucleusTag)}${props["children"].join("")}${source.slice(openEndNucleusTag, source.length)}`
                        source = AtomicReact.replaceExpressao(`${AtomicReact.AtomicVariables.Nucleus}="true"`, `${AtomicReact.ClientVariables.Nucleus}="${atom.id}"`, source, true)
                    }
                }

            }
            const attributesAsString = attributes.join(" ")

            const tag = source.trim()
            if (tag.startsWith("<") && tag.endsWith(">")) {
                const posToSplit = (tag.at(tag.length - 2) == "/") ? tag.length - 2 : tag.indexOf(">")
                source = `${tag.slice(0, posToSplit)} ${attributesAsString}${tag.slice(posToSplit, tag.length)}`
            } else {
                source = `<${source} ${attributesAsString}> ${(props["children"]).join("")}</${source}>`
            }

            /* Sub */
            source = AtomicReact.replaceExpressao(`${AtomicReact.AtomicVariables.Sub}=`, `${AtomicReact.ClientVariables.SubOf}="${JSX["jsx-runtime"].atom.id}" ${AtomicReact.ClientVariables.Sub}=`, source, true)
            return source
        },
        jsx(name: string, props: { [id: string]: any }) {
            return JSX["jsx-runtime"].jsxs(name, props)
        },

    }
};