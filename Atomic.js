var fs = require('fs');
var path = require('path');
var consoleFlags = require('./ConsoleFlags.js');
var FileTool = require('./tools/File.js');

class Atomic {
  constructor(Config, HotReload) {
    this.Global = {
      name: JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"))).name,
      version: JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"))).version,
      isOnClientSide: false,
      atomosRendered: {
        count: 0,
        id: []
      },
    };

    this.ClientVariables = {
      Atomic: "Atomic",//("Atomic"+this.Global.name),
      Props: "props",
      Id: "data-atomic-id", //id = id dado para um atomo
      Key: "data-atomic-key", //key = nome do atomo
      Nucleus: "data-atomic-nucleus",
      Sub: "data-atomic-sub",
      SubOf: "data-atomic-subof" //usado para identificar de qual atomo uma sub particula pertence
    };

    this.AtomicVariables = {
      Nucleus: "atomic.nucleus",
      Sub: "atomic.sub"
    }

    this.Config = (Config != null) ? JSON.parse(JSON.stringify(Config)) : {
      atomicDir: "",
      bundleDir: "",
      debug: true
    };

    if (!this.Config.atomicDir) { return console.log(consoleFlags.erro, "You must set an atomicDir where all yours atoms will be"); }
    this.Config.atomicDir = path.join(process.cwd(), this.Config.atomicDir);
    this.Config.bundleDir = path.join(process.cwd(), this.Config.bundleDir || "");
    this.Config.debug = (this.Config.debug == undefined) ? true : this.Config.debug;

    this.Config.paths = {
      html: path.join(this.Config.atomicDir, "html"),
      js: path.join(this.Config.atomicDir, "js"),
      css: path.join(this.Config.atomicDir, "css")
    };
    //Create folder if not exist
    FileTool.createDirIfNotExist(process.cwd(), this.Config.bundleDir);
    FileTool.createDirIfNotExist(process.cwd(), this.Config.paths.html);
    FileTool.createDirIfNotExist(process.cwd(), this.Config.paths.js);
    FileTool.createDirIfNotExist(process.cwd(), this.Config.paths.css);

    /* HotReload */
    this.HotReload = HotReload || null;
    if (this.HotReload != null) {
      // console.log("this.HotReload.webSocketsClients.length: "+this.HotReload.webSocketsClients.length);
      this.HotReload.watchingFiles = []; //reseta arquivos que ja estavam sendo watcheds
      //inicial watchs (atomicDir)
      this.HotReload.addToWatch(this.Config.atomicDir);
      // this.HotReload.addToWatch(process.cwd());

      this.HotReload.getEventEmitter().on('reload', (function (msg) {
        // console.log("HotReload -> changes event emitted", msg);
        this.init();
      }).bind(this));
    }

    this.init();
  }
  init() {
    /* Carrega Data dos Atomos */
    this.Atomos = [];

    fs.readdirSync(this.Config.paths.html).forEach((function (file) {
      var fileAtomoHtml = path.join(this.Config.paths.html, file);
      var parsedFile = path.parse(fileAtomoHtml);
      if (parsedFile.ext.indexOf(".html") != -1) {
        // console.log(parsedFile.name);
        if (!fs.existsSync(fileAtomoHtml)) {
          return console.log(consoleFlags.erro, "File " + fileAtomoHtml + " not exist");
        }
        this.addAtomo({
          key: parsedFile.name,
          data: fs.readFileSync(fileAtomoHtml).toString()
        });
      }
    }).bind(this));

    this.bundle();
    if (this.Config.debug) { this.printAtoms(); }
  }
  isRunning() {
    if (this.Global.isOnClientSide) {
      console.log('AtomicReact is running on version: ' + this.Global.version);
    }
    else {
      console.log(consoleFlags.info, 'AtomicReact is running on version: ' + this.Global.version);
    }
  }
  addAtomo(Atomo) {
    this.Atomos.push(Atomo);
  }
  replaceExpressao(expressao, expressaoParaSerReplaced, source, expressaoIsAFlag) {
    expressaoIsAFlag = expressaoIsAFlag || false;
    var regexTag = new RegExp('<(.)*\\s+' + expressao + '(\\s*=([^>]*))', 'gi');

    if (expressaoIsAFlag == true) {
      regexTag = new RegExp('<(.)*\\s+' + expressao + '([^>]*)', 'gi');
    }

    expressao = expressao.replace('.', '\\.');

    var regexToReplace = new RegExp(expressao, 'gi');
    var match;
    var valor;
    while (match = regexTag.exec(source)) {
      console.log(match[0], regexToReplace)
      valor = match[0].replace(regexToReplace, expressaoParaSerReplaced);
      source = source.slice(0, regexTag.lastIndex - match[0].length) + valor + source.slice(regexTag.lastIndex, source.length);
    }
    return source;
  }
  printAtoms() {
    if (this.Global.isOnClientSide) { console.log('Atoms Loaded:'); }
    else { console.log(consoleFlags.info, 'Atoms loaded:'); }
    for (var i = 0; i < this.Atomos.length; i++) {
      if (this.Global.isOnClientSide) { console.log('   [' + (i + 1) + '] ' + this.Atomos[i].key); }
      else { console.log(consoleFlags.info, '   [' + (i + 1) + '] ' + this.Atomos[i].key); }
    }
  }
  getGeoCursorTag(source, TagKey, caseSensitivy) {
    caseSensitivy = (caseSensitivy == null || caseSensitivy == undefined) ? true : caseSensitivy;
    if (this.Global.isOnClientSide || (!caseSensitivy)) {
      source = source.toLowerCase();
      TagKey = TagKey.toLowerCase();
    }
    /*
      |startOpenAtomo|<Tag>|startCloseAtomo|...nucleus...|endOpenAtomo|</Tag>|endCloseAtomo|
    */
    var geoCursor = {
      open: {
        start: -1,
        end: -1
      },
      close: {
        start: -1,
        end: -1
      }
    };
    var regexOpenOuClose = new RegExp('</?((' + TagKey + ')|(' + TagKey + '\\s[^>]*))>', "g");
    var regexOpen = new RegExp('<((' + TagKey + ')|(' + TagKey + '\\s[^>]*))>', "g");
    var match;
    var contadorTagsAbertas = 0;
    var encontrou = false;
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
      // console.log('start index= ' +(regexOpenOuClose.lastIndex - match[0].length));
      // console.log('end index= ' + (regexOpenOuClose.lastIndex));
    }
    // console.log(geoCursor);
    return geoCursor;
  }
  renderAtomo(source, Atomo, lista) {
    var geoCursorAtomo = this.getGeoCursorTag(source, Atomo.key);
    if (geoCursorAtomo.open.start == -1) { return { Source: source, Acabou: true }; }

    var AtomoData = Atomo.data;

    //AtomicKey
    var atomicKey = " " + this.ClientVariables.Key + "='" + Atomo.key + "'";
    //AtomicId
    var atomicId = Atomo.key + "_" + this.Global.atomosRendered.count;

    //Update atomic.nucleus para data-atomic-nucleus=atomicId
    AtomoData = this.replaceExpressao(this.AtomicVariables.Nucleus, this.ClientVariables.Nucleus + "=" + atomicId, AtomoData, true);
    //Update atomic.sub para data-atomic-sub e Add SubOf (qual atomo uma particula pertence)
    AtomoData = this.replaceExpressao(this.AtomicVariables.Sub, this.ClientVariables.SubOf + "=" + atomicId + " " + this.ClientVariables.Sub, AtomoData);

    //atributos
    var atributos = source.slice(geoCursorAtomo.open.start, geoCursorAtomo.open.end);
    var customAtributos = atributos.slice(0, atributos.length);

    //props
    var regexPropAttr = new RegExp(this.ClientVariables.Props + '(\\.\\w*\\s*=\\s*(\\")\\s*([^\\"]*))', 'g');
    var match;
    var campo, valor;
    while (match = regexPropAttr.exec(atributos)) { //para cada prop que está em atributos
      customAtributos = customAtributos.replace(match[0] + '"', ''); //Apaga esse props dos atributos para que eu possa ter um customAtributos limpo
      campo = match[0].slice(0, match[0].indexOf('=')).trim(); //ex: props.nome
      valor = match[0].slice(match[0].indexOf('"') + 1, match[0].length); //ex: fulano
      AtomoData = AtomoData.replace(new RegExp('{((\\s)*)' + campo + '((\\s)*)}', 'gi'), valor); //substitui {props.nome} pelo seu valor fornecido
    }

    //custom atributos:  (id, class, ....) devem ser add na tag do AtomoData
    customAtributos = customAtributos.slice(customAtributos.indexOf(" "), customAtributos.length - 1);

    //nucleus
    var nucleus = source.slice(geoCursorAtomo.open.end, geoCursorAtomo.close.start);
    var regExpNucleusTag = new RegExp('<(.)*' + this.ClientVariables.Nucleus + '[^>]*', 'gi');
    var openEndNucleusTag = -1;
    while (match = regExpNucleusTag.exec(AtomoData)) {
      openEndNucleusTag = regExpNucleusTag.lastIndex + 1;
    }
    //insere o nucleo dentro da tag do nucleo
    AtomoData = AtomoData.slice(0, openEndNucleusTag) + nucleus + AtomoData.slice(openEndNucleusTag, AtomoData.length);

    if (this.Global.isOnClientSide == true) { lista.push({ key: Atomo.key, id: atomicId }); }
    atomicId = " " + this.ClientVariables.Id + "='" + atomicId + "'";

    //sub que está em atributos 
    var atomicSub = '';
    var regexSubAttr = new RegExp(this.ClientVariables.Sub + '(\\s*=\\s*(\\")\\s*([^\\"]*))', 'g');
    while (match = regexSubAttr.exec(atributos)) {
      atomicSub = " " + atomicSub + match[0] + '"';
    }

    var openEndFirstTagOnAtomoData = this.getGeoCursorTag(AtomoData, '[^>]*').open.end - 1;
    AtomoData = AtomoData.slice(0, openEndFirstTagOnAtomoData) + customAtributos + atomicKey + atomicId + atomicSub + AtomoData.slice(openEndFirstTagOnAtomoData, AtomoData.length);

    this.Global.atomosRendered.count = this.Global.atomosRendered.count + 1;

    AtomoData = this.render(AtomoData, lista);

    source = source.slice(0, geoCursorAtomo.open.start) + AtomoData + source.slice(geoCursorAtomo.close.end, source.length);

    return { Source: source, Acabou: false };
  }
  loopRender(source, Atomo, lista) {
    var RetornoRenderAtomo = this.renderAtomo(source, Atomo, lista);
    if (RetornoRenderAtomo.Acabou) {
      return RetornoRenderAtomo.Source
    } else {
      return this.loopRender(RetornoRenderAtomo.Source, Atomo, lista);
    }
  }
  render(source, lista = []) {
    this.Atomos.forEach((function (Atomo) {
      source = this.loopRender(source, Atomo, lista);
    }).bind(this));
    // console.log(source);
    return source
  }
  renderElement(domElement) {
    // this.Global.atomosRendered.list = []; //limpa a lista de atomos renderizados
    let lista = [];
    domElement.innerHTML = this.render(domElement.innerHTML, lista);

    this.createAtomClass(lista);
  }
  createAtomClass(lista) {
    lista.forEach(function (AtomoRendered) {
      // console.log("+++++++++++", AtomoRendered);
      var bAtomFound = false;
      var atom = document.querySelector('[' + this.ClientVariables.Id + '="' + AtomoRendered.id + '"]');
      if (atom == null) { return; }
      for (var index = 0; index < this.Atomos.length && bAtomFound == false; index++) {
        if ((AtomoRendered.key == this.Atomos[index].key) && (this.Atomos[index].mainClass != null)) {
          bAtomFound = true;

          atom.Atomic = {
            id: AtomoRendered.id,
            main: Object.create(new this.Atomos[index].mainClass)
          };

          /* insert newFunc in object if func is undefined */
          var insertNewFunc = function (func, name, newFunc) {
            if (func == undefined) {
              Object.defineProperty(Object.getPrototypeOf(atom.Atomic.main), name, {
                value: newFunc
              });
            }
          };
          // insertNewFunc(atom.Atomic.main.meuID, 'meuID', AtomoRendered.id);

          insertNewFunc(atom.Atomic.main.getElement, 'getElement', function () {
            return atom;
          });
          insertNewFunc(atom.Atomic.main.add, 'add', function (AtomKey, props, where) {
            return this.add(atom, AtomKey, props, where);
          });
          insertNewFunc(atom.Atomic.main.getNucleus, 'getNucleus', function () {
            return this.getNucleus(atom);
          });
          insertNewFunc(atom.Atomic.main.getSub, 'getSub', function (subName) {
            return this.getSub(atom, subName);
          });
        }
      }
      // console.log(atom.Atomic);
    });
    this.notifyAtomOnRender(lista);
  }
  notifyAtomOnRender(lista) {
    lista.forEach(function (AtomoRendered) {
      // console.log('--------'+AtomoRendered.id);
      var atom = document.querySelector('[' + this.ClientVariables.Id + '="' + AtomoRendered.id + '"]');
      if (atom == null) { return; }
      // console.log('--------------',atom.Atomic);
      if ((atom.Atomic != undefined) && typeof atom.Atomic.main.onRender == 'function') {
        atom.Atomic.main.onRender();
      }
    });
  }
  exportFunction(funcao) {
    return encodeURI(funcao.toString().replace(funcao.name, 'function').replace(/this/g, this.ClientVariables.Atomic)).replace(/'/g, '%27');
  }
  bundle() {
    if (this.Config.debug) { console.log(consoleFlags.info, "===Bundling==="); }
    /* Core JS */
    var jsCore = "";

    var objToExportToClient = {
      Global: JSON.parse(JSON.stringify(this.Global)), //gambi para clonar objeto
      Atomos: [],
      ClientVariables: this.ClientVariables,
      AtomicVariables: this.AtomicVariables
    };
    if (this.HotReload != null) {
      objToExportToClient.HotReload = {
        port: this.HotReload.port,
        addrs: this.HotReload.addrs
      };
    }

    objToExportToClient.Global.isOnClientSide = true;
    var objToExportToClientStringfied = encodeURI(JSON.stringify(objToExportToClient)).replace(/'/g, '%27'); //fix problemas das aspas com encodeURI - encodeURI do nodejs não encode o ', por isso fazemos isso manualmente
    jsCore = "const " + this.ClientVariables.Atomic + " = JSON.parse(decodeURI('" + objToExportToClientStringfied + "'));";

    //exporta aqui e importa funcoes no lado do client
    var functionsToExport = [this.addAtomo, this.printAtoms, this.isRunning, this.getGeoCursorTag, this.renderAtomo, this.replaceExpressao, this.loopRender, this.render, this.renderElement, this.createAtomClass, this.notifyAtomOnRender, this.getAtom, this.getSub, this.getNucleus, this.add, this.ligaHotReloadNoClient, this.renderPageNoClient];
    functionsToExport.forEach((function (functionToExport) {
      jsCore += 'eval(decodeURI(\'' + this.ClientVariables.Atomic + '.' + functionToExport.name + '=' + this.exportFunction(functionToExport) + '\'));';
    }).bind(this));

    //Liga HotReload
    if (this.HotReload != null) {
      jsCore += this.ClientVariables.Atomic + "." + this.ligaHotReloadNoClient.name + "();";
    }
    jsCore += "Atomic.renderPageNoClient();";

    /* Save core */
    var jsCorePath = path.join(this.Config.bundleDir, 'atomicreact.core.js');
    fs.writeFileSync(jsCorePath, jsCore);

    /* Bundle JS */
    var jsBundle = "";

    //export Atomos
    var objToExportToClient = {
      Atomos: this.Atomos
    };
    var objToExportToClientStringfied = encodeURI(JSON.stringify(objToExportToClient)).replace(/'/g, '%27'); //fix problemas das aspas com encodeURI - encodeURI do nodejs não encode o ', por isso fazemos isso manualmente
    jsBundle = "JSON.parse(decodeURI('" + objToExportToClientStringfied + "')).Atomos.forEach(function(Atomo){" + this.ClientVariables.Atomic + ".Atomos.push(Atomo);});";

    var jsAtomoFile;
    // console.log(this.Config.paths.js);
    this.Atomos.forEach((function (Atomo, index) {
      jsAtomoFile = path.join(this.Config.paths.js, Atomo.key + '.js');
      if (!fs.existsSync(jsAtomoFile)) {
        if (this.Config.debug) { console.log(consoleFlags.warn, "File " + jsAtomoFile + " not exist"); }
        return;
      }

      let AtomoImported;
      try {
        delete require.cache[path.resolve(jsAtomoFile)];
        AtomoImported = require(jsAtomoFile);
      } catch (e) {
        console.log(consoleFlags.erro, e.message);
        console.log(consoleFlags.erro, e.stack);
        // console.log( Object.getOwnPropertyNames(e));
        // console.log(e.stack);
        return;
      }

      // console.log(Object.getOwnPropertyNames(AtomoImported));
      var AtomoImportedObjName = Object.getOwnPropertyNames(AtomoImported);
      Object.values(AtomoImported).forEach((function (value, indexValues) {
        // console.log(typeof value);
        // console.log(AtomoImportedObjName[indexValues]);
        if (AtomoImportedObjName[indexValues] == "main") {
          jsBundle += 'eval(decodeURI(\'' + this.ClientVariables.Atomic + '.getAtom(\"' + Atomo.key + '\").mainClass = ' + encodeURI(value.toString()).replace(/'/g, '%27') + '\'));';
          jsBundle += 'eval(decodeURI(\'' + this.ClientVariables.Atomic + '.getAtom(\"' + Atomo.key + '\").' + AtomoImportedObjName[indexValues] + ' = new (' + this.ClientVariables.Atomic + '.getAtom(\"' + Atomo.key + '\")).mainClass();\'));';
        }
      }).bind(this));
      // console.log(Object.values(AtomoImported)[2].toString());
      // console.log(Object.values(AtomoImported));
      // console.log(AtomoImportedObjName);
      if (AtomoImported.main == undefined && this.Config.debug == true) {
        console.log(consoleFlags.warn, "[" + Atomo.key + "] don't have main class");
      }

    }).bind(this));

    /* Bundle CSS */
    var cssBundle = "";
    var cssAtomoFile;
    this.Atomos.forEach((function (Atomo, index) {
      cssAtomoFile = path.join(this.Config.paths.css, Atomo.key + '.css');
      if (!fs.existsSync(cssAtomoFile)) {
        if (this.Config.debug) console.log(consoleFlags.warn, "File " + cssAtomoFile + " not exist");
        return;
      }
      cssBundle += fs.readFileSync(cssAtomoFile).toString();
    }).bind(this));

    //Bundle dependencies
    var packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json")));
    var nodeModulesPath = path.join(process.cwd(), "node_modules");
    try {
      if (this.Config.debug && packageJson.atomicReact.dependencies.length > 0) { console.log(consoleFlags.info, "Dependencies Loaded"); }
      packageJson.atomicReact.dependencies.forEach((function (dp) { //dp = dependencie name
        var dpPath = path.join(nodeModulesPath, dp);

        var dpConfig = require(path.join(dpPath, "AtomicReact_config.js"));

        var dpBundleJsPath = path.join(dpPath, dpConfig.bundleDir);
        var dpBundleCssPath = path.join(dpBundleJsPath, "atomicreact.bundle.css");
        dpBundleJsPath = path.join(dpBundleJsPath, "atomicreact.bundle.js");

        if (fs.existsSync(dpBundleJsPath)) { jsBundle += fs.readFileSync(dpBundleJsPath).toString(); }
        if (fs.existsSync(dpBundleCssPath)) { cssBundle += fs.readFileSync(dpBundleCssPath).toString(); }
        if (this.Config.debug) { console.log(consoleFlags.info, "\t[+] " + dp); }
      }).bind(this));
    } catch (e) {/*console.log(e);*/ };

    //Save de bundle
    var jsBundlePath = path.join(this.Config.bundleDir, 'atomicreact.bundle.js');
    fs.writeFileSync(jsBundlePath, jsBundle);

    var cssBundlePath = path.join(this.Config.bundleDir, 'atomicreact.bundle.css');
    fs.writeFileSync(cssBundlePath, cssBundle);
  }
  getAtom(AtomKey) {
    var index = -1;
    for (var i = 0; i < this.Atomos.length; i++) {
      if (AtomKey == this.Atomos[i].key) {
        index = i;
      }
    }
    return this.Atomos[index];
  }
  getSub(atomElement, subName) {
    return atomElement.querySelector('[' + this.ClientVariables.SubOf + '=' + atomElement.getAttribute('data-atomic-id') + '][' + this.ClientVariables.Sub + '="' + subName + '"]');
  }
  getNucleus(atomElement) {
    return document.querySelector('[' + this.ClientVariables.Nucleus + '=' + atomElement.getAttribute('data-atomic-id') + ']');
  }
  add(atomElement, AtomKey, props, where) {
    props = props || [];
    where = where || "beforeend";

    var elementoToBeCreate = document.createElement(AtomKey);
    // console.log('Atomic', elementoToBeCreate)
    //add props
    props.forEach(function (prop) {
      elementoToBeCreate.setAttribute(this.ClientVariables.Props + "." + prop.key, prop.value);
    });

    // this.Global.atomosRendered.list = []; //limpa a lista de atomos renderizados
    let lista = [];
    var elementRenderizado = this.render(elementoToBeCreate.outerHTML, lista);

    var nucleusElement = this.getNucleus(atomElement);
    nucleusElement.insertAdjacentHTML(where, elementRenderizado);

    this.createAtomClass(lista);

    // console.log('Atomic id', lista[0].id)

    var key = atomElement.getAttributeNode(this.ClientVariables.Key).value;
    var atomAdded = document.querySelector('[' + this.ClientVariables.Id + '="' + lista[0].id + '"]');
    //notifyAtom onAdded
    this.Atomos.forEach(function (Atomo, index) {
      if ((key == Atomo.key) && (this.Atomos[index].main != null) && (this.Atomos[index].main.onAdded != null)) {
        atomElement.Atomic.main.onAdded(atomAdded);
      }
    });

    return atomAdded;
  }
  ligaHotReloadNoClient() {
    // console.log('ligaHotReloadNoClient disparado');
    if (this.WebSocketClient != null && this.WebSocketClient != undefined) { return; }
    this.WebSocketClient = new WebSocket("ws://" + this.HotReload.addrs + ":" + this.HotReload.port);
    this.WebSocketClient.onmessage = function (e) {
      console.log(e.data);
      if (e.data == "<atomicreact.hotreload.RELOAD>") {
        location.reload();
      }
    }
  }
  renderPageNoClient() {
    window.addEventListener("load", function (event) {
      Atomic.renderElement(document.getElementsByTagName('html')[0]);
    });
  }
}
module.exports.Atomic = Atomic;
module.exports.HotReload = require('./modules/HotReload.js');
