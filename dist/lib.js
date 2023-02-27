export const ClientVariables = {
    Atomic: "Atomic",
    Props: "props",
    Id: "data-atomic-id",
    Key: "data-atomic-key",
    Nucleus: "data-atomic-nucleus",
    Sub: "data-atomic-sub",
    SubOf: "data-atomic-subof" //usado para
};
export const AtomicVariables = {
    Nucleus: "atomic.nucleus",
    Sub: "atomic.sub"
};
export class AtomicReact {
    constructor() {
    }
    static getAtom(atomKey) {
    }
    // static get atoms(): Array<IAtom> {
    //     return []
    // }
    static renderPageOnLoad() {
        window.addEventListener("load", function (event) {
            AtomicReact.renderElement(document.getElementsByTagName('html')[0]);
        });
    }
    static enableHotReloadOnClient(addrs, port) {
        // console.log('ligaHotReloadNoClient disparado');
        if (this["WebSocketClient"] != null && this["WebSocketClient"] != undefined) {
            return;
        }
        this["WebSocketClient"] = new WebSocket("ws://" + addrs + ":" + port);
        this["WebSocketClient"].onmessage = function (e) {
            console.log(e.data);
            if (e.data == "<atomicreact.hotreload.RELOAD>") {
                location.reload();
            }
        };
    }
    static makeID(length) {
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
    static replaceExpressao(expressao, expressaoParaSerReplaced, source, expressaoIsAFlag = false) {
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
            }
            else {
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
    static renderAtomo(source, atom, atomList) {
        let geoCursorAtomo = AtomicReact.getGeoCursorTag(source, atom.key);
        if (geoCursorAtomo.open.start == -1) {
            return { source: source, end: true };
        }
        let atomStruct = atom.struct;
        //AtomicKey
        let atomicKey = " " + ClientVariables.Key + "='" + atom.key + "'";
        //AtomicId
        let atomicId = atom.key + "_" + AtomicReact.makeID(10);
        //Update atomic.nucleus para data-atomic-nucleus=atomicId
        atomStruct = AtomicReact.replaceExpressao(AtomicVariables.Nucleus, ClientVariables.Nucleus + "=" + atomicId, atomStruct, true);
        //Update atomic.sub para data-atomic-sub e Add SubOf (qual atomo uma particula pertence)
        atomStruct = AtomicReact.replaceExpressao(AtomicVariables.Sub, ClientVariables.SubOf + "=" + atomicId + " " + ClientVariables.Sub, atomStruct);
        //atributos
        let atributos = source.slice(geoCursorAtomo.open.start, geoCursorAtomo.open.end);
        let customAtributos = atributos.slice(0, atributos.length);
        //props
        let regexPropAttr = new RegExp(ClientVariables.Props + '(\\.\\w*\\s*=\\s*(\\")\\s*([^\\"]*))', 'g');
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
        atomStruct = atomStruct.replace(new RegExp('{((\\s)*)' + ClientVariables.Props + '(\\.\\w*\\s*)}', 'gi'), ""); //substitui {props.nome} pelo seu valor fornecido
        //custom atributos:  (id, class, ....) devem ser add na tag do AtomoData
        customAtributos = customAtributos.slice(customAtributos.indexOf(" "), customAtributos.length - 1);
        //nucleus
        let nucleus = source.slice(geoCursorAtomo.open.end, geoCursorAtomo.close.start);
        let regExpNucleusTag = new RegExp('<(.)*' + ClientVariables.Nucleus + '[^>]*', 'gi');
        let openEndNucleusTag = -1;
        while (match = regExpNucleusTag.exec(atomStruct)) {
            openEndNucleusTag = regExpNucleusTag.lastIndex + 1;
        }
        //insere o nucleo dentro da tag do nucleo
        atomStruct = atomStruct.slice(0, openEndNucleusTag) + nucleus + atomStruct.slice(openEndNucleusTag, atomStruct.length);
        atomList.push({ key: atom.key, id: atomicId });
        atomicId = " " + ClientVariables.Id + "='" + atomicId + "'";
        //sub que está em atributos 
        let atomicSub = '';
        let regexSubAttr = new RegExp(ClientVariables.Sub + '(\\s*=\\s*(\\")\\s*([^\\"]*))', 'g');
        while (match = regexSubAttr.exec(atributos)) {
            atomicSub = " " + atomicSub + match[0] + '"';
        }
        let openEndFirstTagOnAtomoData = AtomicReact.getGeoCursorTag(atomStruct, '[^>]*').open.end - 1;
        atomStruct = atomStruct.slice(0, openEndFirstTagOnAtomoData) + customAtributos + atomicKey + atomicId + atomicSub + atomStruct.slice(openEndFirstTagOnAtomoData, atomStruct.length);
        atomStruct = AtomicReact.render(atomStruct, atomList);
        source = source.slice(0, geoCursorAtomo.open.start) + atomStruct + source.slice(geoCursorAtomo.close.end, source.length);
        return { source: source, end: false };
    }
    static loopRender(source, atom, atomList) {
        let RetornoRenderAtomo = AtomicReact.renderAtomo(source, atom, atomList);
        if (RetornoRenderAtomo.end) {
            return RetornoRenderAtomo.source;
        }
        else {
            return AtomicReact.loopRender(RetornoRenderAtomo.source, atom, atomList);
        }
    }
    static render(source, atomList = []) {
        AtomicReact.atoms.forEach(((atom) => {
            source = AtomicReact.loopRender(source, atom, atomList);
        }));
        return source;
    }
    static renderElement(domElement) {
        let atomList = [];
        domElement.innerHTML = AtomicReact.render(domElement.innerHTML, atomList);
        AtomicReact.createAtomClass(atomList);
    }
    static createAtomClass(atomList) {
        atomList.forEach((renderedAtom) => {
            let atom = AtomicReact.getElement(renderedAtom.id);
            if (atom == null) {
                return;
            }
            for (let index = 0; index < AtomicReact.atoms.length; index++) {
                if ((renderedAtom.key != AtomicReact.atoms[index].key) || (AtomicReact.atoms[index].mainClass == null))
                    continue;
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
    static notifyAtomOnRender(atomList) {
        atomList.forEach((AtomoRendered) => {
            let atom = AtomicReact.getElement(AtomoRendered.id);
            if (atom == null) {
                return;
            }
            if ((atom.Atomic != undefined) && typeof atom.Atomic.main.onRender == 'function') {
                atom.Atomic.main.onRender();
            }
        });
    }
    static getSub(atomElement, subName) {
        return atomElement.querySelector('[' + ClientVariables.SubOf + '=' + atomElement.getAttribute('data-atomic-id') + '][' + ClientVariables.Sub + '="' + subName + '"]');
    }
    static getNucleus(atomElement) {
        return document.querySelector('[' + ClientVariables.Nucleus + '=' + atomElement.getAttribute('data-atomic-id') + ']');
    }
    static getElement(atomId) {
        return document.querySelector('[' + ClientVariables.Id + '="' + atomId + '"]');
    }
    static add(atomElement, atomKey, props, where) {
        props = props || [];
        where = where || "beforeend";
        let elementoToBeCreate = document.createElement(atomKey);
        //add props
        props.forEach((prop) => {
            elementoToBeCreate.setAttribute(ClientVariables.Props + "." + prop.key, prop.value);
        });
        let atomList = [];
        let renderedElement = AtomicReact.render(elementoToBeCreate.outerHTML, atomList);
        let nucleusElement = AtomicReact.getNucleus(atomElement);
        nucleusElement.insertAdjacentHTML(where, renderedElement);
        AtomicReact.createAtomClass(atomList);
        let key = atomElement.getAttributeNode(ClientVariables.Key).value;
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
AtomicReact.atoms = [];
export class AtomicClass {
    constructor(id) {
        this.id = id;
    }
    getElement() {
        return AtomicReact.getElement(this.id);
    }
    add(atomKey, props, where) {
        return AtomicReact.add(this.getElement(), atomKey, props, where);
    }
    getNucleus() {
        return AtomicReact.getNucleus(this.getElement());
    }
    getSub(subName) {
        return AtomicReact.getSub(this.getElement(), subName);
    }
    /* Event fired when this Atom is rendered. */
    onRender() { }
    /* Event fired when another Atom is added inside this Atom */
    onAdded(atomAdded) { }
}
//# sourceMappingURL=lib.js.map