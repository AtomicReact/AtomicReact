var fs = require('fs');
var path = require('path');
var consoleFlags = require('./ConsoleFlags.js');
var FileTool = require('./tools/File.js');

class Atomic {
  constructor(Config, HotReload) {
    this.Global = {
      name: JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"))).name,
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
      Children: "data-atomic-children",
      Child: "data-atomic-child"
    };

    this.AtomicVariables = {
      Children: "atomic.children",
      Child: "atomic.child"
    }

    this.Config = (Config!=null) ? JSON.parse(JSON.stringify(Config)):{
      atomicDir: "",
      bundleDir: "",
      debug: true
    };

    if(!this.Config.atomicDir) { return console.log(consoleFlags.erro, "You must set an atomicDir where all yours atoms will be"); }
    this.Config.atomicDir = path.join(process.cwd(), this.Config.atomicDir);
    this.Config.bundleDir = path.join(process.cwd(), this.Config.bundleDir||"");
    this.Config.debug = (this.Config.debug==undefined) ? true:this.Config.debug;

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
    if(this.HotReload!=null) {
      // console.log("this.HotReload.webSocketsClients.length: "+this.HotReload.webSocketsClients.length);
      this.HotReload.watchingFiles = []; //reseta arquivos que ja estavam sendo watcheds
      //inicial watchs (atomicDir)
      this.HotReload.addToWatch(this.Config.atomicDir);
      // this.HotReload.addToWatch(process.cwd());

      this.HotReload.getEventEmiter().on('changes', (function(obj){
        // console.log("HotReload -> changes event emitted", obj);
        this.init();
      }).bind(this));
    }

    this.init();
  }
  init() {
    /* Carrega Data dos Atomos */
    this.Atomos = [];

    fs.readdirSync(this.Config.paths.html).forEach((function(file){
      var parsedFile = path.parse(path.join(this.Config.paths.html, file));
      if(parsedFile.ext.indexOf(".html")!=-1){
        // console.log(parsedFile.name);
        this.addAtomo({key: parsedFile.name});
      }
    }).bind(this));

    this.bundle();
    if(this.Config.debug) { this.printAtoms(); }
  }
  isRunning() {
    console.log(consoleFlags.info,'Atomic is running');
  }
  addAtomo(Atomo) {
    this.Atomos.push(Atomo);
    this.loadAtomo(this.Atomos.length-1);
  }
  replaceExpressao(expressao, expressaoParaSerReplaced, source, expressaoIsAFlag) {
    expressaoIsAFlag = expressaoIsAFlag||false;
    var regexTag = new RegExp('<(.)*'+expressao+'(\\s*=[^>]*)', 'gi');
    if(expressaoIsAFlag==false) {
      regexTag = new RegExp('<(.)*'+expressao+'([^>]*)', 'gi');
    }

    expressao = expressao.replace('.', '\\.');
    var regexToReplace = new RegExp(expressao, 'gi');
    var match;
    var valor;
    while(match = regexTag.exec(source)){
      valor = match[0].replace(regexToReplace, expressaoParaSerReplaced);
      source = source.slice(0, regexTag.lastIndex - match[0].length) + valor + source.slice(regexTag.lastIndex, source.length);
    }
    return source;
  }
  loadAtomo(pos) {
    if(this.Atomos[pos]==null || this.Atomos[pos].data!=null || this.Atomos[pos].data!=undefined) { return; }
    var fileAtomoHtml = path.join(this.Config.paths.html, this.Atomos[pos].key+'.html');

    if (!fs.existsSync(fileAtomoHtml)) {
      return console.log(consoleFlags.erro, "File "+fileAtomoHtml+" not exist");
    }
    this.Atomos[pos].data = fs.readFileSync(fileAtomoHtml).toString();

    //substui regular expressoes (atomic.child para data-atomic-child, ...)
    this.Atomos[pos].data = this.replaceExpressao(this.AtomicVariables.Child, this.ClientVariables.Child, this.Atomos[pos].data);
    this.Atomos[pos].data = this.replaceExpressao(this.AtomicVariables.Children, this.ClientVariables.Children, this.Atomos[pos].data, true);
    // console.log(this.Atomos[pos].data);
  }
  printAtoms() {
    if(this.Global.isOnClientSide) { console.log('Atoms Loaded:'); }
    else { console.log(consoleFlags.info, 'Atoms loaded:'); }
    for(var i=0; i<this.Atomos.length; i++) {
      if(this.Global.isOnClientSide) { console.log('   ['+(i+1)+'] '+this.Atomos[i].key); }
      else { console.log(consoleFlags.info, '   ['+(i+1)+'] '+this.Atomos[i].key); }
    }
  }
  getGeoCursorTag(source, TagKey, caseSensitivy) {
    caseSensitivy = (caseSensitivy==null || caseSensitivy==undefined) ? true:caseSensitivy;
    if(this.Global.isOnClientSide || (!caseSensitivy)) {
      source = source.toLowerCase();
      TagKey = TagKey.toLowerCase();
    }
    /*
      |startOpenAtomo|<Tag>|startCloseAtomo|...children...|endOpenAtomo|</Tag>|endCloseAtomo|
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
    var regexOpenOuClose = new RegExp('</?'+TagKey+'[^>]*>', "g");
    var regexOpen = new RegExp('<'+TagKey+'[^>]*>', "g");
    var match;
    var contadorTagsAbertas = 0;
    var encontrou = false;
    while((match = regexOpenOuClose.exec(source)) && encontrou==false ){
      if(match[0].search(regexOpen)>-1) {
        // console.log('========Open=========');
        if(contadorTagsAbertas==0) {
          // console.log('Este é o primeiro open');
          geoCursor.open.start = regexOpenOuClose.lastIndex - match[0].length;
          geoCursor.open.end = regexOpenOuClose.lastIndex;
        }
        contadorTagsAbertas+=1;
      } else {
        // console.log('=======Close=========');
        contadorTagsAbertas-=1;
        if(contadorTagsAbertas==0) {
          // console.log('Este é ultimo close');
          geoCursor.close.start = regexOpenOuClose.lastIndex - match[0].length;
          geoCursor.close.end = regexOpenOuClose.lastIndex;

          encontrou=true;
        }
      }
      // console.log('start index= ' +(regexOpenOuClose.lastIndex - match[0].length));
      // console.log('end index= ' + (regexOpenOuClose.lastIndex));
    }
    // console.log(geoCursor);
    return geoCursor;
  }
  renderAtomo(source, Atomo) {
    // console.log(Atomo.key);
    // console.log(source);
    var geoCursorAtomo = this.getGeoCursorTag(source, Atomo.key);
    if(geoCursorAtomo.open.start==-1) {return {Source: source, Acabou: true};}

    var AtomoData = Atomo.data;

    //atributos
    var atributos = source.slice(geoCursorAtomo.open.start,geoCursorAtomo.open.end);
    // console.log(atributos);

    //props
    // var regexPropAttr = new RegExp(/props\.\w*\s*=\s*(\")\s*([^\"]*)/, 'g');
    var regexPropAttr = new RegExp(this.ClientVariables.Props+'(\\.\\w*\\s*=\\s*(\\")\\s*([^\\"]*))', 'g');
    var match;
    var campo,valor;
    while(match = regexPropAttr.exec(atributos)){
      campo = match[0].slice(0,match[0].indexOf('=')).trim();
      valor = match[0];
      atributos = atributos.replace(valor+'"', ''); //Apaga esse props dos atributos para que eu possa ter um customAtributos limpo
      // console.log(valor);
      valor = valor.slice(valor.indexOf('"')+1, valor.length);
      AtomoData = AtomoData.replace(new RegExp('{((\\s)*)'+campo+'((\\s)*)}', 'gi'), valor);
    }

    //custom atributos:  (id, class, ....) devem ser add na tag do AtomoData
    // console.log(atributos);
    var customAtributos = atributos.slice(atributos.indexOf(" "), atributos.length-1);
    // console.log(customAtributos);

    //children
    var children = source.slice(geoCursorAtomo.open.end, geoCursorAtomo.close.start);
    // var geoCursorChildren = this.getGeoCursorTag(AtomoData, this.ClientVariables.Tags.children);
    // AtomoData = AtomoData.slice(0,geoCursorChildren.open.start)+children+AtomoData.slice(geoCursorChildren.close.end,AtomoData.length);
    var regExpChildrenTag = new RegExp('<(.)*'+this.ClientVariables.Children+'[^>]*', 'gi');
    // console.log(AtomoData);
    var openEndChildrenTag = -1;
    while(match = regExpChildrenTag.exec(AtomoData)) {
      openEndChildrenTag = regExpChildrenTag.lastIndex+1;
    }
    // console.log(openEndChildrenTag);
    // console.log(AtomoData.slice(openEndChildrenTag-10, openEndChildrenTag+1));
    AtomoData = AtomoData.slice(0,openEndChildrenTag)+children+AtomoData.slice(openEndChildrenTag,AtomoData.length);

    //Add Atomic.Key
    var atomicKey = " "+this.ClientVariables.Key+"='"+Atomo.key+"'";

    //Add Atomic.Id
    var atomicId = Atomo.key+"_"+this.Global.atomosRendered.count;
    // console.log("this.Global.isOnClientSide: "+this.Global.isOnClientSide);
    if(this.Global.isOnClientSide==true) { this.Global.atomosRendered.list.push({key:Atomo.key, id:atomicId}); }
    atomicId = " "+this.ClientVariables.Id+"='"+atomicId+"'";

    //Add Atomic.Child
    var atomicChild = '';
    var regexChildAttr = new RegExp(this.ClientVariables.Child+'(\\s*=\\s*(\\")\\s*([^\\"]*))', 'g');
    while(match = regexChildAttr.exec(atributos)){
      campo = match[0].slice(0,match[0].indexOf('=')).trim();
      valor = match[0];
      atomicChild = " "+atomicChild + match[0] + '"';
    }
    // console.log(atomicChild);

    var openEndFirstTagOnAtomoData = this.getGeoCursorTag(AtomoData, '').open.end - 1;
    AtomoData = AtomoData.slice(0, openEndFirstTagOnAtomoData)+customAtributos+atomicKey+atomicId+atomicChild+AtomoData.slice(openEndFirstTagOnAtomoData, AtomoData.length);

    this.Global.atomosRendered.count = this.Global.atomosRendered.count+1;
    // console.log(AtomoData);

    AtomoData = this.render(AtomoData);
    // console.log('geoCursorChildren: '+geoCursorChildren);
    // console.log('AtomoDataComChildren: '+AtomoDataComChildren);
    source = source.slice(0,geoCursorAtomo.open.start)+AtomoData+source.slice(geoCursorAtomo.close.end,source.length);

    return {Source: source, Acabou: false};
  }
  loopRender(source, Atomo) {
    var RetornoRenderAtomo = this.renderAtomo(source, Atomo);
    if(RetornoRenderAtomo.Acabou) {
      return RetornoRenderAtomo.Source;
    } else {
      return this.loopRender(RetornoRenderAtomo.Source, Atomo);
    }
  }
  render(source) {
    this.Atomos.forEach((function(Atomo){
      source = this.loopRender(source, Atomo);
    }).bind(this));
    // console.log(source);
    return source;
  }
  renderElement(domElement, elementOnNewChildrenAdded) {
    this.Global.atomosRendered.list = []; //limpa a lista de atomos renderizados

    if(elementOnNewChildrenAdded!=null && elementOnNewChildrenAdded!=undefined) {
      // console.log(domElement.outerHTML);
      var elementRenderizado = this.render(domElement.outerHTML);
      var childrenElement = this.getChildren(elementOnNewChildrenAdded);
      childrenElement.insertAdjacentHTML("beforeend", elementRenderizado);

      var key = elementOnNewChildrenAdded.getAttributeNode(this.ClientVariables.Key).value;
      var id = elementOnNewChildrenAdded.getAttributeNode(this.ClientVariables.Id).value;
      this.Atomos.forEach(function(Atomo, index){
        if((key == Atomo.key) && (this.Atomos[index].onNewChildrenAdded!=null)) {
          this.Atomos[index].onNewChildrenAdded(id, elementOnNewChildrenAdded, childrenElement.lastElementChild);
        }
      });
    } else {
      domElement.innerHTML = this.render(domElement.innerHTML);
    }

    this.Global.atomosRendered.list.forEach(function(AtomoRendered){
      // console.log(AtomoRendered.id + "como key: "+AtomoRendered.key);
      this.Atomos.forEach(function(Atomo, index){
        if((AtomoRendered.key == Atomo.key) && (this.Atomos[index].onRender!=null)) {
          this.Atomos[index].onRender(AtomoRendered.id, document.querySelector('['+this.ClientVariables.Id+'="'+AtomoRendered.id+'"]'));
        }
      });
    });

  }
  exportFunction(funcao) {
    return encodeURI(funcao.toString().replace(funcao.name, 'function').replace(/this/g, this.ClientVariables.Atomic)).replace(/'/g, '%27');
  }
  bundle() {
    if(this.Config.debug) { console.log(consoleFlags.info, "===Bundling==="); }
    /* Core JS */
    var jsCore = "";

    var objToExportToClient = {
      Global: JSON.parse(JSON.stringify(this.Global)), //gambi para clonar objeto
      Atomos: [],
      ClientVariables: this.ClientVariables,
      HotReload: {
        port: this.HotReload.port,
        addrs: this.HotReload.addrs
      }
    };
    objToExportToClient.Global.isOnClientSide = true;
    var objToExportToClientStringfied = encodeURI(JSON.stringify(objToExportToClient)).replace(/'/g, '%27'); //fix problemas das aspas com encodeURI - encodeURI do nodejs não encode o ', por isso fazemos isso manualmente
    jsCore = "const "+this.ClientVariables.Atomic+ " = JSON.parse(decodeURI('"+ objToExportToClientStringfied + "'));";

    //exporta aqui e importa funcoes no lado do client
    var functionsToExport = [this.printAtoms, this.getGeoCursorTag, this.renderAtomo, this.loopRender, this.render, this.renderElement, this.getAtom, this.getChild, this.getChildren, this.addChildren, this.ligaHotReloadNoClient, this.renderPageNoClient];
    functionsToExport.forEach((function(functionToExport){
      jsCore += 'eval(decodeURI(\''+this.ClientVariables.Atomic+'.'+functionToExport.name+'='+this.exportFunction(functionToExport)+'\'));';
    }).bind(this));

    //Liga HotReload
    if(this.HotReload!=null) {
      jsCore += this.ClientVariables.Atomic+"."+this.ligaHotReloadNoClient.name+"();";
    }
    jsCore += "Atomic.renderPageNoClient();";

    var jsCorePath = path.join(this.Config.bundleDir, 'atomicreact.core.js');
    fs.writeFileSync(jsCorePath, jsCore);

    /* Bundle JS */
    var jsBundle = "";

    //export Atomos
    var objToExportToClient = {
      Atomos: this.Atomos
    };
    var objToExportToClientStringfied = encodeURI(JSON.stringify(objToExportToClient)).replace(/'/g, '%27'); //fix problemas das aspas com encodeURI - encodeURI do nodejs não encode o ', por isso fazemos isso manualmente
    jsBundle = "JSON.parse(decodeURI('"+ objToExportToClientStringfied + "')).Atomos.forEach(function(Atomo){"+this.ClientVariables.Atomic+".Atomos.push(Atomo);});";

    var jsAtomoFile;
    // console.log(this.Config.paths.js);
    this.Atomos.forEach((function(Atomo, index){
      jsAtomoFile = path.join(this.Config.paths.js, Atomo.key + '.js');
      if (!fs.existsSync(jsAtomoFile)) {
        if(this.Config.debug) {console.log(consoleFlags.warn, "File "+jsAtomoFile+" not exist");}
        return;
      }

      let AtomoImported;
      try {
        delete require.cache[path.resolve(jsAtomoFile)];
        AtomoImported = require(jsAtomoFile);
      } catch(e) {
        console.log(consoleFlags.erro, e.message);
        console.log(consoleFlags.erro, e.stack);
        // console.log( Object.getOwnPropertyNames(e));
        // console.log(e.stack);
        return;
      }

      // //onRender
      // if(AtomoImported.onRender!=undefined) {
      //   jsBundle += 'eval(decodeURI(\''+this.ClientVariables.Atomic+'.Atomos['+index+'].onRender = '+encodeURI(AtomoImported.onRender.toString().replace(/this/g, this.ClientVariables.Atomic)).replace(/'/g, '%27')+'\'));';
      // } else {console.log(consoleFlags.warn, "function onRender undefined for "+Atomo.key);}
      // //onNewChildrenAdded
      // if(AtomoImported.onNewChildrenAdded!=undefined) {
      //   jsBundle += 'eval(decodeURI(\''+this.ClientVariables.Atomic+'.Atomos['+index+'].onNewChildrenAdded = '+encodeURI(AtomoImported.onNewChildrenAdded.toString().replace(/this/g, this.ClientVariables.Atomic)).replace(/'/g, '%27')+'\'));';
      // } else {console.log(consoleFlags.warn, "function onNewChildrenAdded undefined for "+Atomo.key);}

      // console.log(Object.getOwnPropertyNames(AtomoImported));
      var AtomoImportedObjName = Object.getOwnPropertyNames(AtomoImported);
      Object.values(AtomoImported).forEach((function(value, indexValues){
        // console.log(typeof value);
        if(typeof value === 'function') {
          // console.log("eh uma funcao", value.toString());
          jsBundle += 'eval(decodeURI(\''+this.ClientVariables.Atomic+'.getAtom(\"'+Atomo.key+'\").'+AtomoImportedObjName[indexValues]+' = '+encodeURI(value.toString()).replace(/'/g, '%27')+'\'));';
        }
        if(typeof value === 'object') {
          jsBundle += 'eval(decodeURI(\''+this.ClientVariables.Atomic+'.getAtom(\"'+Atomo.key+'\").'+AtomoImportedObjName[indexValues]+' = '+encodeURI(JSON.stringify(value)).replace(/'/g, '%27')+'\'));';
        }
        else {
          // console.log("nao eh uma funcao");
        }
      }).bind(this));
      // console.log(Object.values(AtomoImported)[2].toString());
      // console.log(Object.values(AtomoImported));
      if(AtomoImported.onRender==undefined && this.Config.debug==true) {
        console.log(consoleFlags.warn, "function onRender undefined for "+Atomo.key);
      }
      if(AtomoImported.onNewChildrenAdded==undefined && this.Config.debug==true) {
        console.log(consoleFlags.warn, "function onNewChildrenAdded undefined for "+Atomo.key);
      }

    }).bind(this));

    /* Bundle CSS */
    var cssBundle = "";
    var cssAtomoFile;
    this.Atomos.forEach((function(Atomo, index){
      cssAtomoFile = path.join(this.Config.paths.css, Atomo.key + '.css');
      if (!fs.existsSync(cssAtomoFile) && this.Config.debug) {
        return console.log(consoleFlags.warn, "File "+cssAtomoFile+" not exist");
      }
      cssBundle += fs.readFileSync(cssAtomoFile).toString();
    }).bind(this));

    //Bundle dependencies
    var packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json")));
    var nodeModulesPath = path.join(process.cwd(), "node_modules");
    try {
      if(this.Config.debug && packageJson.atomicReact.dependencies.length>0) { console.log(consoleFlags.info, "Dependencies Loaded"); }
      packageJson.atomicReact.dependencies.forEach((function(dp){ //dp = dependencie name
        var dpPath = path.join(nodeModulesPath, dp);

        var dpConfig = require(path.join(dpPath, "AtomicReact_config.js"));

        var dpBundleJsPath = path.join(dpPath, dpConfig.bundleDir);
        var dpBundleCssPath = path.join(dpBundleJsPath, "atomicreact.bundle.css");
        dpBundleJsPath = path.join(dpBundleJsPath, "atomicreact.bundle.js");

        if(fs.existsSync(dpBundleJsPath)) { jsBundle += fs.readFileSync(dpBundleJsPath).toString(); }
        if(fs.existsSync(dpBundleCssPath)) { cssBundle += fs.readFileSync(dpBundleCssPath).toString(); }
        if(this.Config.debug) { console.log(consoleFlags.info, "\t[+] "+dp); }
      }).bind(this));
    } catch(e){/*console.log(e);*/};

    //Save de bundle
    var jsBundlePath = path.join(this.Config.bundleDir, 'atomicreact.bundle.js');
    fs.writeFileSync(jsBundlePath, jsBundle);

    var cssBundlePath = path.join(this.Config.bundleDir, 'atomicreact.bundle.css');
    fs.writeFileSync(cssBundlePath, cssBundle);
  }
  getAtom(AtomoKey) {
    var index = -1;
    for(var i=0; i<this.Atomos.length; i++){
      if(AtomoKey==this.Atomos[i].key) {
        index = i;
      }
    }
    return this.Atomos[index];
  }
  getChild(element, child) {
    return element.querySelector('['+this.ClientVariables.Child+'="'+child+'"]');
  }
  getChildren(element) {
    return element.querySelector('['+this.ClientVariables.Children+']');
  }
  addChildren(element, AtomoKey, props) {
    props = props || [];
    var elementoToBeCreate = document.createElement(AtomoKey);
    props.forEach(function(prop){
      elementoToBeCreate.setAttribute(this.ClientVariables.Props+"."+prop.key, prop.value);
    });
    this.renderElement(elementoToBeCreate, element);
  }
  ligaHotReloadNoClient(){
    // console.log('ligaHotReloadNoClient disparado');
    if(this.WebSocketClient!=null && this.WebSocketClient!=undefined) { return; }
    this.WebSocketClient = new WebSocket("ws://"+this.HotReload.addrs+":"+this.HotReload.port);
    this.WebSocketClient.onmessage = function(e){
      console.log(e.data);
      if(e.data=="<atomicreact.hotreload.REFRESH>"){
        location.reload();
      }
    }
  }
  renderPageNoClient() {
    window.addEventListener("load", function(event) {
    	Atomic.renderElement(document.getElementsByTagName('html')[0]);
    });
  }
}
module.exports.Atomic = Atomic;
module.exports.HotReload = require('./modules/HotReload.js');
