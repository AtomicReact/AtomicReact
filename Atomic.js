var fs = require('fs');
var path = require('path');
var consoleFlags = require('./ConsoleFlags');

class Atomic {
  constructor(Config, HotReload) {
    this.Global = {
      isOnClientSide: false,
      atomosRendered: {
        count: 0,
        id: []
      },
    };
    this.ClientVariables = {
      Atomic: "Atomic",
      Props: "props",
      Id: "data-atomic-id",
      Key: "data-atomic-key",
      Children: "data-atomic-children",
      Child: "data-atomic-child"
    };

    this.Config = (Config!=null) ? Config:{
      paths:{
        html: __dirname,
        js: __dirname,
        css: __dirname
      },
      publicDir: "",
      debug: true,
      devMode: true
    };
    this.Config.publicDir = this.Config.publicDir || "";
    this.Config.devMode = this.Config.devMode || true;

    this.AtomicVariables = { //para uso interno do Atomic
      Children: "atomic.children",
      Child: "atomic.child"
    }

    /* HotReload */
    this.HotReload = HotReload || null;
    if(this.HotReload!=null) {
      // console.log("this.HotReload.webSocketsClients.length: "+this.HotReload.webSocketsClients.length);
      this.HotReload.watchingFiles = []; //reseta arquivos que ja estavam sendo watcheds
      //inicial watchs (js e css dir)
      this.HotReload.addToWatch(this.Config.paths.html);
      this.HotReload.addToWatch(path.join(this.Config.publicDir, this.Config.paths.js));
      this.HotReload.addToWatch(path.join(this.Config.publicDir, this.Config.paths.css));
    }

    // /* Carrega Data dos Atomos */
    this.Atomos = [];
    fs.readdirSync(this.Config.paths.html).forEach((function(file){
      var parsedFile = path.parse(path.join(this.Config.paths.html, file));
      if(parsedFile.ext.indexOf(".html")!=-1){
        // console.log(parsedFile.name);
        this.addAtomo({key: parsedFile.name});
      }
    }).bind(this));

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
    console.log(consoleFlags.info, 'Atomos loaded:');
    for(var i=0; i<this.Atomos.length; i++) {
      console.log('   ->'+this.Atomos[i].key);
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
  renderAtomo(source, Atomo, renderOnlyRenderOnCompile) {
    // console.log(Atomo.key);
    // console.log(source);
    var geoCursorAtomo = this.getGeoCursorTag(source, Atomo.key);
    if(geoCursorAtomo.open.start==-1) {return {Source: source, Acabou: true};}

    var AtomoData = Atomo.data;
    //props
    var atributos = source.slice(geoCursorAtomo.open.start,geoCursorAtomo.open.end);
    // console.log(atributos);
    // var regexPropAttr = new RegExp(/props\.\w*\s*=\s*(\")\s*([^\"]*)/, 'g');
    var regexPropAttr = new RegExp(this.ClientVariables.Props+'(\\.\\w*\\s*=\\s*(\\")\\s*([^\\"]*))', 'g');
    var match;
    var campo,valor;
    while(match = regexPropAttr.exec(atributos)){
      campo = match[0].slice(0,match[0].indexOf('=')).trim();
      valor = match[0];
      valor = valor.slice(valor.indexOf('"')+1, valor.length);
      AtomoData = AtomoData.replace(new RegExp('{((\\s)*)'+campo+'((\\s)*)}', 'gi'), valor);
    }

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
    AtomoData = AtomoData.slice(0, openEndFirstTagOnAtomoData)+atomicKey+atomicId+atomicChild+AtomoData.slice(openEndFirstTagOnAtomoData, AtomoData.length);

    this.Global.atomosRendered.count = this.Global.atomosRendered.count+1;
    // console.log(AtomoData);

    AtomoData = this.render(AtomoData, renderOnlyRenderOnCompile);
    // console.log('geoCursorChildren: '+geoCursorChildren);
    // console.log('AtomoDataComChildren: '+AtomoDataComChildren);
    source = source.slice(0,geoCursorAtomo.open.start)+AtomoData+source.slice(geoCursorAtomo.close.end,source.length);

    return {Source: source, Acabou: false};
  }
  loopRender(source, Atomo, renderOnlyRenderOnCompile) {
    var RetornoRenderAtomo = this.renderAtomo(source, Atomo, renderOnlyRenderOnCompile);
    if(RetornoRenderAtomo.Acabou) {
      return RetornoRenderAtomo.Source;
    } else {
      return this.loopRender(RetornoRenderAtomo.Source, Atomo, renderOnlyRenderOnCompile);
    }
  }
  render(source, renderOnlyRenderOnCompile) {
    // renderOnlyRenderOnCompile: renderiza apenas atomos marcados pra renderiza durante o compile (Atomo.renderOnCompile = true)
    if(renderOnlyRenderOnCompile==null || renderOnlyRenderOnCompile==undefined) { renderOnlyRenderOnCompile = false; }
    this.Atomos.forEach((function(Atomo){
      if((renderOnlyRenderOnCompile==true) && (Atomo.renderOnCompile==false || Atomo.renderOnCompile==undefined)) {
        // console.log('nao vai renderiza');
        return;
      } else {
        source = this.loopRender(source, Atomo, renderOnlyRenderOnCompile);
      }
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
  renderFile(fileRoot) {
    var rootData = fs.readFileSync(fileRoot).toString();
    return this.render(rootData);
  }
  exportFunction(funcao) {
    return encodeURI(funcao.toString().replace(funcao.name, 'function').replace(/this/g, this.ClientVariables.Atomic)).replace(/'/g, '%27');
  }
  createScriptToImportAtomosCss(fileRoot) {
    var inject = '';
    var src;
    var cssFile;
    // console.log(this.Config.paths.js);
    this.Atomos.forEach((function(Atomo){
      cssFile = path.join(this.Config.paths.css, Atomo.key + '.css');
      src = path.relative(fileRoot, cssFile).replace(/\\/g, '/');
      // <link rel="stylesheet" href="./diretorio1/arquivo.css">
      if (!fs.existsSync(path.join(this.Config.publicDir, cssFile))) {
        return console.log(consoleFlags.warn, "File "+path.join(this.Config.publicDir, cssFile)+" not exist");
      }
      inject += '<link rel="stylesheet" href="'+src+'">';
    }).bind(this));
    // console.log(inject);
    return inject;
  }
  createScriptToImportAtomosJavascript(fileRoot) {
    var inject = '';
    var src;
    var jsFile;
    // console.log(this.Config.paths.js);
    this.Atomos.forEach((function(Atomo){
      jsFile = path.join(this.Config.paths.js, Atomo.key + '.js');
      src = path.relative(fileRoot, jsFile).replace(/\\/g, '/');
      // '<script src="./diretorio1/arquivo.js"></script>'
      // console.log(path.join(this.Config.publicDir, jsFile));
      // console.log(src);
      if (!fs.existsSync(path.join(this.Config.publicDir, jsFile))) {
        return console.log(consoleFlags.warn, "File "+path.join(this.Config.publicDir, jsFile)+" not exist");
      }
      inject += '<script src="'+src+'"></script>';
    }).bind(this));
    // console.log(inject);
    return inject;
  }
  setPreRender(AtomosToPreRender) {
    AtomosToPreRender.forEach((function(AtomoKey){
      this.Atomos.forEach((function(Atomo, pos){
        if(AtomoKey==Atomo.key) {
          this.Atomos[pos].renderOnCompile = true;
        }
      }).bind(this));
    }).bind(this));
  }
  loadFile(fileRoot) {
    //carrega Atomic na pagina
    var rootData = fs.readFileSync(fileRoot).toString();
    rootData = this.render(rootData, true);
    var geoCursorHead = this.getGeoCursorTag(rootData, 'head', false);
    // console.log(geoCursorHead);
    var objToExportToClient = {
      Global: JSON.parse(JSON.stringify(this.Global)), //gambi para clonar objetp
      Atomos: this.Atomos,
      ClientVariables: this.ClientVariables,
      HotReload: {
        port: this.HotReload.port,
        addrs: this.HotReload.addrs
      }
    };
    objToExportToClient.Global.isOnClientSide = true;

    //fix problemas das aspas com encodeURI
    var objToExportToClientStringfied = encodeURI(JSON.stringify(objToExportToClient)).replace(/'/g, '%27'); //encodeURI do nodejs não encode o ', por isso fazemos isso manualmente

    var inject = "<script type='text/javascript'>const "+this.ClientVariables.Atomic+ " = JSON.parse(decodeURI('"+ objToExportToClientStringfied + "'));</script>";

    //exporta aqui e importa funcoes no lado do client
    var functionsToExport = [this.printAtoms, this.renderAtomo, this.loopRender, this.render, this.renderElement, this.getGeoCursorTag, this.setOnRender, this.setOnNewChildrenAdded, this.getChild, this.getChildren, this.addChildren, this.ligaHotReloadNoClient];
    var importFunctions = '';
    functionsToExport.forEach((function(functionToExport){
      importFunctions += 'eval(decodeURI(\''+this.ClientVariables.Atomic+'.'+functionToExport.name+'='+this.exportFunction(functionToExport)+'\'));';
    }).bind(this));
    inject += "<script type='text/javascript'>"+importFunctions+"</script>";

    //Liga HotReload
    if(this.HotReload!=null && this.Config.devMode==true) { inject += "<script type='text/javascript'>Atomic.ligaHotReloadNoClient()</script>"; }

    //css dos atomos
    inject += this.createScriptToImportAtomosCss(fileRoot);
    //javascript dos atomos
    inject += this.createScriptToImportAtomosJavascript(fileRoot);

    rootData = rootData.slice(0, geoCursorHead.close.start)+inject+rootData.slice(geoCursorHead.close.start, rootData.length);

    //Add um preStyle
    var stylePreAdd = " style=\"display: none;\"";
    this.Atomos.forEach(function(Atomo){
      var regexOpen = new RegExp('<'+Atomo.key+'[^>]*>', "g");
      while(regexOpen.exec(rootData)){
        rootData = rootData.slice(0, regexOpen.lastIndex-1)+stylePreAdd+rootData.slice(regexOpen.lastIndex-1, rootData.length);
      }
    });

    return rootData;
  }
  compileFile(file, outputPathFile, callback) {
    var parsedFile = path.parse(file);
    // console.log(parsedFile.dir);
    outputPathFile = outputPathFile || path.join(parsedFile.dir, parsedFile.name+"_compiled"+parsedFile.ext);
    var parsedOutputPathFile = path.parse(outputPathFile);
    // console.log(parsedOutputPathFile.dir);
    if (!fs.existsSync(parsedOutputPathFile.dir)) {
      return console.log(consoleFlags.erro, "Directory(s) to compile "+outputPathFile+" not exist");
    }
    if (!fs.existsSync(file)) {
      return console.log(consoleFlags.erro, "File to compile "+file+" not exist");
    }

    //HotReload
    if(this.HotReload!=null) {
      this.HotReload.addToWatch(file);
    }

    // console.log(callback);
    if(callback==undefined) {
      fs.writeFileSync(outputPathFile,this.loadFile(file), {flag:'w+'});
      if(this.Config.debug) {console.log(consoleFlags.info, "File compiled with sucess: "+file)}
      return;
    } else {
      fs.writeFile(outputPathFile,this.loadFile(file), {flag:'w+'}, (function(err){
        if(err) { console.log(consoleFlags.erro, err);  }
        else { if(this.Config.debug) {console.log(consoleFlags.info, "File compiled with sucess: "+file);} }
        return callback(file, outputPathFile, err);
      }).bind(this));
    }
  }
  setOnRender(AtomoKey, onRender) {
    this.Atomos.forEach(function(Atomo, index){
      if(AtomoKey==Atomo.key) {
        this.Atomos[index].onRender = onRender;
        // console.log('onRender setado com sucesso');
      }
    });
  }
  setOnNewChildrenAdded(AtomoKey, onNewChildrenAdded) {
    this.Atomos.forEach(function(Atomo, index){
      if(AtomoKey==Atomo.key) {
        this.Atomos[index].onNewChildrenAdded = onNewChildrenAdded;
        // console.log('onNewChildrenAdded setado com sucesso');
      }
    });
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
      // console.log(e);
      location.reload();
    }
  }
}
module.exports.Atomic = Atomic;
module.exports.HotReload = require('./modules/HotReload.js');
