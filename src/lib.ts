export interface IClientVariables {
    Atomic: string,//("Atomic"+Atomic.global.name),
    Props: string,
    Id: string, //id = id dado para um atomo
    Key: string, //key = nome do atomo
    Nucleus: string,
    Sub: string,
    SubOf: string //usado para
}

export interface IAtomicVariables {
    Nucleus: string,
    Sub: string
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

    static ClientVariables: IClientVariables = {
        Atomic: "Atomic",//("Atomic"+Atomic.global.name),
        Props: "props",
        Id: "data-atomic-id", //id = id dado para um atomo
        Key: "data-atomic-key", //key = nome do atomo
        Nucleus: "data-atomic-nucleus",
        Sub: "data-atomic-sub",
        SubOf: "data-atomic-subof" //usado para
    }

    static AtomicVariables: IAtomicVariables = {
        Nucleus: "nucleus",
        Sub: "sub"
    }

    constructor() {

    }

    static getAtom(atomKey: IAtom["key"]): any {

    }

    // static get atoms(): Array<IAtom> {
    //     return []
    // }

    static renderPageOnLoad(atomicClass: AtomicClass) {
        window.addEventListener("load", function (event) {
            AtomicReact.renderElement(atomicClass, document.getElementsByTagName('html')[0]);
        });
    }

    static enableHotReloadOnClient(addrs: string, port: number) {
        // console.log('ligaHotReloadNoClient disparado');
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

    static replaceExpressao(expressao, expressaoParaSerReplaced, source, expressaoIsAFlag = false) : string {
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

    static getGeoCursorTag(source, TagKey, caseSensitivy = true) {
        caseSensitivy = (caseSensitivy == null || caseSensitivy == undefined) ? true : caseSensitivy;
        if ((!caseSensitivy)) {
            source = source.toLowerCase();
            TagKey = TagKey.toLowerCase();
        }
        /*
          |startOpenAtomo|<Tag>|startCloseAtomo|...nucleus...|endOpenAtomo|</Tag>|endCloseAtomo|
        */
        let geoCursor = {
            open: {
                start: -1,
                end: -1
            },
            close: {
                start: -1,
                end: -1
            }
        };
        let regexOpenOuClose = new RegExp(`</?((` + TagKey + `)|((` + TagKey + `).*((=("|').*("|')))([^>]*))|(` + TagKey + `\\s[^>]*))>`, "g");
        let regexOpen = new RegExp(`<((` + TagKey + `)|(` + TagKey + `\\s[^>]*)|)>`, "g");
        let match;
        let contadorTagsAbertas = 0;
        let encontrou = false;
        while ((match = regexOpenOuClose.exec(source)) && encontrou == false) {
            if (match[0].search(regexOpen) > -1) {
                // console.log('========Open=========');
                if (contadorTagsAbertas == 0) {
                    // console.log('Este é o primeiro open');
                    geoCursor.open.start = regexOpenOuClose.lastIndex - match[0].length;
                    geoCursor.open.end = regexOpenOuClose.lastIndex;
                }
                contadorTagsAbertas += 1;
            } else {
                // console.log('=======Close=========');
                contadorTagsAbertas -= 1;
                if (contadorTagsAbertas == 0) {
                    // console.log('Este é ultimo close');
                    geoCursor.close.start = regexOpenOuClose.lastIndex - match[0].length;
                    geoCursor.close.end = regexOpenOuClose.lastIndex;

                    encontrou = true;
                }
            }

        }

        return geoCursor;
    }

    static renderAtomo(source: string, atom: IAtom, atomList: Array<IAtomList>) {
        let geoCursorAtomo = AtomicReact.getGeoCursorTag(source, atom.key);
        if (geoCursorAtomo.open.start == -1) { return { source: source, end: true }; }

        let atomStruct = atom.struct;

        //AtomicKey
        let atomicKey = " " + AtomicReact.ClientVariables.Key + "='" + atom.key + "'";
        //AtomicId
        let atomicId = atom.key + "_" + AtomicReact.makeID(10);

        //Update atomic.nucleus para data-atomic-nucleus=atomicId
        atomStruct = AtomicReact.replaceExpressao(AtomicReact.AtomicVariables.Nucleus, AtomicReact.ClientVariables.Nucleus + "=" + atomicId, atomStruct, true);
        //Update atomic.sub para data-atomic-sub e Add SubOf (qual atomo uma particula pertence)
        atomStruct = AtomicReact.replaceExpressao(AtomicReact.AtomicVariables.Sub, AtomicReact.ClientVariables.SubOf + "=" + atomicId + " " + AtomicReact.ClientVariables.Sub, atomStruct);

        //atributos
        let atributos = source.slice(geoCursorAtomo.open.start, geoCursorAtomo.open.end);
        let customAtributos = atributos.slice(0, atributos.length);

        //props
        let regexPropAttr = new RegExp(AtomicReact.ClientVariables.Props + '(\\.\\w*\\s*=\\s*(\\")\\s*([^\\"]*))', 'g');
        let match;
        let campo;
        let valor = null;
        while (match = regexPropAttr.exec(atributos)) { //para cada prop que está em atributos
            customAtributos = customAtributos.replace(match[0] + '"', ''); //Apaga esse props dos atributos para que eu possa ter um customAtributos limpo
            campo = match[0].slice(0, match[0].indexOf('=')).trim(); //ex: props.nome
            valor = match[0].slice(match[0].indexOf('"') + 1, match[0].length); //ex: fulano
            atomStruct = atomStruct.replace(new RegExp('{((\\s)*)' + campo + '((\\s)*)}', 'gi'), valor); //substitui {props.nome} pelo seu valor fornecido
        }
        //limpa as props não configuradas acima: Issue#11
        atomStruct = atomStruct.replace(new RegExp('{((\\s)*)' + AtomicReact.ClientVariables.Props + '(\\.\\w*\\s*)}', 'gi'), ""); //substitui {props.nome} pelo seu valor fornecido

        //custom atributos:  (id, class, ....) devem ser add na tag do AtomoData
        customAtributos = customAtributos.slice(customAtributos.indexOf(" "), customAtributos.length - 1);

        //nucleus
        let nucleus = source.slice(geoCursorAtomo.open.end, geoCursorAtomo.close.start);
        let regExpNucleusTag = new RegExp('<(.)*' + AtomicReact.ClientVariables.Nucleus + '[^>]*', 'gi');
        let openEndNucleusTag = -1;
        while (match = regExpNucleusTag.exec(atomStruct)) {
            openEndNucleusTag = regExpNucleusTag.lastIndex + 1;
        }
        //insere o nucleo dentro da tag do nucleo
        atomStruct = atomStruct.slice(0, openEndNucleusTag) + nucleus + atomStruct.slice(openEndNucleusTag, atomStruct.length);

        atomList.push({ key: atom.key, id: atomicId });
        atomicId = " " + AtomicReact.ClientVariables.Id + "='" + atomicId + "'";

        //sub que está em atributos 
        let atomicSub = '';
        let regexSubAttr = new RegExp(AtomicReact.ClientVariables.Sub + '(\\s*=\\s*(\\")\\s*([^\\"]*))', 'g');
        while (match = regexSubAttr.exec(atributos)) {
            atomicSub = " " + atomicSub + match[0] + '"';
        }

        let openEndFirstTagOnAtomoData = AtomicReact.getGeoCursorTag(atomStruct, '[^>]*').open.end - 1;
        atomStruct = atomStruct.slice(0, openEndFirstTagOnAtomoData) + customAtributos + atomicKey + atomicId + atomicSub + atomStruct.slice(openEndFirstTagOnAtomoData, atomStruct.length);

        atomStruct = AtomicReact.render(atomStruct, atomList);

        source = source.slice(0, geoCursorAtomo.open.start) + atomStruct + source.slice(geoCursorAtomo.close.end, source.length);

        return { source: source, end: false };
    }

    static loopRender(source: string, atom: IAtom, atomList: Array<IAtomList>) {
        let RetornoRenderAtomo = AtomicReact.renderAtomo(source, atom, atomList);
        if (RetornoRenderAtomo.end) {
            return RetornoRenderAtomo.source
        } else {
            return AtomicReact.loopRender(RetornoRenderAtomo.source, atom, atomList);
        }
    }

    static render(source: string, atomList: Array<IAtomList> = []) {
        AtomicReact.atoms.forEach(((atom) => {
            source = AtomicReact.loopRender(source, atom, atomList);
        }));
        return source
    }

    // static renderElement(domElement: Element) {
    //     let atomList = [];
    //     domElement.innerHTML = AtomicReact.render(domElement.innerHTML, atomList);

    //     AtomicReact.createAtomClass(atomList);
    // }
    static renderElement(atomicClass: AtomicClass, domElement: Element) {
        domElement.innerHTML = atomicClass.render();

        // AtomicReact.createAtomClass(atomList);
    }

    static createAtomClass(atomList: IAtomList[]) {
        atomList.forEach((renderedAtom) => {
            let atom = AtomicReact.getElement(renderedAtom.id);
            if (atom == null) { return; }
            for (let index = 0; index < AtomicReact.atoms.length; index++) {
                if ((renderedAtom.key != AtomicReact.atoms[index].key) || (AtomicReact.atoms[index].mainClass == null)) continue;

                atom.Atomic = {
                    id: renderedAtom.id,
                    main: (new (AtomicReact.atoms[index].mainClass)(renderedAtom.id))
                    // main: Object.create((new (Atomic.atoms[index].mainClass)(renderedAtom.id)))
                };
                break;
            }
        });
        AtomicReact.notifyAtomOnRender(atomList);
    }
    static notifyAtomOnRender(atomList: IAtomList[]) {
        atomList.forEach((AtomoRendered) => {
            let atom = AtomicReact.getElement(AtomoRendered.id);
            if (atom == null) { return; }

            if ((atom.Atomic != undefined) && typeof atom.Atomic.main.onRender == 'function') {
                atom.Atomic.main.onRender();
            }
        });
    }
    static getSub<T>(atomElement: IAtomicElement, subName: string): T {
        return atomElement.querySelector('[' + AtomicReact.ClientVariables.SubOf + '=' + atomElement.getAttribute('data-atomic-id') + '][' + AtomicReact.ClientVariables.Sub + '="' + subName + '"]') as unknown as T;
    }
    static getNucleus(atomElement: IAtomicElement) {
        return document.querySelector('[' + AtomicReact.ClientVariables.Nucleus + '=' + atomElement.getAttribute('data-atomic-id') + ']');
    }
    static getElement(atomId: string): IAtomicElement {
        return document.querySelector('[' + AtomicReact.ClientVariables.Id + '="' + atomId + '"]') as IAtomicElement;
    }
    static add(atomElement: IAtomicElement, atomKey: IAtom["key"], props: IProp[], where: InsertPosition) {
        props = props || [];
        where = where || "beforeend";

        let elementoToBeCreate = document.createElement(atomKey);

        //add props
        props.forEach((prop) => {
            elementoToBeCreate.setAttribute(AtomicReact.ClientVariables.Props + "." + prop.key, prop.value);
        });

        let atomList: Array<IAtomList> = [];
        let renderedElement = AtomicReact.render(elementoToBeCreate.outerHTML, atomList);

        let nucleusElement = AtomicReact.getNucleus(atomElement);
        nucleusElement!.insertAdjacentHTML(where, renderedElement);

        AtomicReact.createAtomClass(atomList);

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

    public struct: ()=>string = null

    constructor(public id?: string) {
        if(!this.id) this.id = AtomicReact.makeID()
    }

    render() : string {
        if(!this.struct) return ""
        let rendered = this.struct()

        const tag = rendered.trim()
        if (tag.startsWith("<") && tag.endsWith(">")) {
            const posToSplit = (tag.at(tag.length - 2) == "/") ? tag.length - 2 : tag.indexOf(">")
            rendered = `${tag.slice(0, posToSplit)} ${AtomicReact.ClientVariables.Key}="${this["__proto__"]["constructor"]["name"]}" ${AtomicReact.ClientVariables.Id}="${this.id}"${tag.slice(posToSplit, tag.length)}`
        }
        /* Add rendered to element */

        /* Find all atomic keys and id and create atom in them */

        /* Fire onRender events */

        return rendered
    }

    getElement(): IAtomicElement {
        return AtomicReact.getElement(this.id);
    }

    add(atomKey: IAtom["key"], props, where): IAtomicElement {
        return AtomicReact.add(this.getElement(), atomKey, props, where);
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
    createElement(name: string, props: { [id: string]: string }, ...content: string[]) {
        props = props || {};
        const propsAsString = Object.keys(props)
            .map(key => {
                const value = props[key];
                return `${key}="${value}"`;
                // if (key === "className") return `class=${value}`;
                // else return `${key}=${value}`;
            })
            .join(" ");
        const tag = name.trim()
        if (tag.startsWith("<") && tag.endsWith(">")) {
            const posToSplit = (tag.at(tag.length - 2) == "/") ? tag.length - 2 : tag.indexOf(">")
            return `${tag.slice(0, posToSplit)} ${propsAsString}${tag.slice(posToSplit, tag.length)}`
        }
        return `<${name} ${propsAsString}> ${content.join("")}</${name}>`;
    },
    ["jsx-runtime"]: {
        jsxs(name: string | Function, props: { [id: string]: any }) {

            let atomKey = null
            if (typeof name == "function") {
                atomKey = name.name
                name = (name as Function).call(this, props) as string
            }

            props = props || {}
            if (!props["children"] || typeof props["children"] == "string") props["children"] = [props["children"]]
            let attributes = Object.keys(props)
                .map(key => {
                    if (key == "children") return null
                    const value = props[key]
                    return `${key}="${value}"`
                })
                .filter(i => i != null)

            if (atomKey) {
                const atomId = AtomicReact.makeID()
                attributes.push(...[`${AtomicReact.ClientVariables.Key}="${atomKey}"`, `${AtomicReact.ClientVariables.Id}="${atomId}"`])
                name = AtomicReact.replaceExpressao(`${AtomicReact.AtomicVariables.Nucleus}="true"`, `${AtomicReact.ClientVariables.Nucleus}="${atomId}"`, name, true)

                if (props["children"].length>0) {
                    let regExpNucleusTag = new RegExp('<(.)*' + AtomicReact.ClientVariables.Nucleus + '[^>]*', 'gi');
                    let openEndNucleusTag = -1;
                    while (regExpNucleusTag.exec(name)) {
                        openEndNucleusTag = regExpNucleusTag.lastIndex + 1;
                    } 
                    name = `${name.slice(0, openEndNucleusTag)}${props["children"].join("")}${name.slice(openEndNucleusTag, name.length)}` 
                }
                
            }
            const attributesAsString = attributes.join(" ")

            const tag = name.trim()
            if (tag.startsWith("<") && tag.endsWith(">")) {
                const posToSplit = (tag.at(tag.length - 2) == "/") ? tag.length - 2 : tag.indexOf(">")
                return `${tag.slice(0, posToSplit)} ${attributesAsString}${tag.slice(posToSplit, tag.length)}`
            }
            return `<${name} ${attributesAsString}> ${(props["children"]).join("")}</${name}>`;
        },
        jsx(name: string, props: { [id: string]: any }) {
            return JSX["jsx-runtime"].jsxs(name, props)
            // props = props || {}
            // if (!props["children"] || typeof props["children"] == "string") props["children"] = [props["children"]]
            // const propsAsString = Object.keys(props)
            //     .map(key => {
            //         if (key == "children") return null
            //         const value = props[key]
            //         return `${key}="${value}"`
            //     })
            //     .filter(i => i != null)
            //     .join(" ")

            // const tag = name.trim()
            // if (tag.startsWith("<") && tag.endsWith(">")) {
            //     const posToSplit = (tag.at(tag.length - 2) == "/") ? tag.length - 2 : tag.indexOf(">")
            //     return `${tag.slice(0, posToSplit)} ${propsAsString}${tag.slice(posToSplit, tag.length)}`
            // }
            // return `<${name} ${propsAsString}> ${(props["children"]).join("")}</${name}>`;
        },

    }
};