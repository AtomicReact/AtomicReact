import { appendFileSync, cp, createReadStream, createWriteStream, existsSync, fstat, readdirSync, readFileSync, statSync, writeFileSync, WriteStream } from "fs";
import path, { dirname, join, parse, ParsedPath, relative, resolve } from "path";
import { ConsoleFlags } from "./tools/console_flags.js";
import { HotReload } from "./modules/hot_reload.js"
import { createDirIfNotExist } from "./tools/file.js";
import { fileURLToPath } from "url";
import TS, { TranspileOptions } from "typescript";
export * from "./lib.js"
import { AtomicReact, IAtom, IGlobal, resolveModuleName } from "./lib.js";

export { HotReload } from "./modules/hot_reload.js"

const __dirname = dirname(fileURLToPath(import.meta.url))
const __filename = fileURLToPath(import.meta.url)


export interface IConfig {
  atomicDir: string,
  bundleDir: string,
  debug: boolean,
  packageName: string
}


export class Atomic {

  global: IGlobal
  config: IConfig

  static hotReload: HotReload
  atoms: Array<IAtom>;

  constructor(config: IConfig, hotReload) {
    this.global = {
      name: JSON.parse(readFileSync(join(__dirname, "package.json")).toString()).name,
      version: JSON.parse(readFileSync(join(__dirname, "package.json")).toString()).version,
      isClientSide: false,
      atomosRendered: {
        count: 0,
        id: []
      },
    } as IGlobal;

    this.config = (config != null) ? JSON.parse(JSON.stringify(config)) : {
      atomicDir: "",
      bundleDir: "",
      debug: true,
      packageName: "PACKAGE_NAME_NOT_DEFINED"
    };

    if (!this.config.atomicDir) { console.log(ConsoleFlags.erro, "You must set an atomicDir where all yours atoms will be"); return; }
    this.config.atomicDir = path.join(process.cwd(), this.config.atomicDir);
    this.config.bundleDir = path.join(process.cwd(), this.config.bundleDir || "");
    this.config.debug = (this.config.debug == undefined) ? true : this.config.debug;

    //Create folder if not exist
    createDirIfNotExist(process.cwd(), this.config.bundleDir);

    /* HotReload */
    Atomic.hotReload = hotReload || null;
    if (Atomic.hotReload != null) {
      // console.log("Atomic.HotReload.webSocketsClients.length: "+Atomic.HotReload.webSocketsClients.length);
      Atomic.hotReload.watchingFiles = []; //reseta arquivos que ja estavam sendo watcheds
      //inicial watchs (atomicDir)
      Atomic.hotReload.addToWatch(this.config.atomicDir);
      // Atomic.HotReload.addToWatch(process.cwd());

      Atomic.hotReload.getEventEmitter().on('reload', ((msg) => {
        this.init();
      }));
    }

    this.init();
  }


  static readAtomsDir(dirPath: string, callback: (atomKey: string, filePath: string, parsedPath: ParsedPath) => void, extensions = [".html"], atomKey?: string) {
    readdirSync(dirPath).forEach(((file) => {
      let filePath = path.join(dirPath, file);

      let fileStat = statSync(filePath);
      let parsedPath = parse(filePath);

      if (fileStat.isDirectory()) {
        return Atomic.readAtomsDir(filePath, callback, extensions, parsedPath.name)
      }

      if (extensions.includes(parsedPath.ext)) {
        return callback((atomKey) ? atomKey : parsedPath.name, filePath, parsedPath)
      }
    }));
  }

  init() {
    this.atoms = [];

    this.bundle();

    if (this.config.debug) { this.printAtoms(); }
  }

  addAtomo(atom: IAtom) {
    this.atoms.push(atom);
  }

  printAtoms() {
    console.log(ConsoleFlags.info, 'Atoms loaded:');
    for (let i = 0; i < this.atoms.length; i++) {
      console.log(ConsoleFlags.info, '   [' + (i + 1) + '] ' + this.atoms[i].key);
    }
  }

  static getTranspileOptions(moduleName: string): TranspileOptions {
    return {
      moduleName: moduleName,
      compilerOptions: {
        jsx: TS.JsxEmit.ReactJSX,
        jsxFactory: "factory",
        jsxFragmentFactory: "fragment",
        jsxImportSource: "atomicreact/lib/JSX",
        reactNamespace: "JSX",
        isolatedModules: true,
        allowSyntheticDefaultImports: true,
        preserveValueImports: true,
        module: TS.ModuleKind.AMD,
        target: TS.ScriptTarget.ESNext,
        moduleResolution: TS.ModuleResolutionKind.NodeJs,
        lib: ["es2016", "dom", "es5"],
        strict: true,
        strictNullChecks: true,
        esModuleInterop: true,
        forceConsistentCasingInFileNames: true,
        declaration: false,
        allowJs: true,
        removeComments: true,
        // sourceMap: true
      }
    }
  }

  async bundle() {
    if (this.config.debug) { console.log(ConsoleFlags.info, "===Bundling==="); }

    // Atomic.readAtomsDir(this.config.atomicDir, (atomKey, filePath) => {
    //   this.addAtomo({
    //     key: atomKey,
    //     struct: readFileSync(filePath).toString()
    //   });
    // }, [".html"])

    /* Core JS */
    // let jsCore = "";

    // let exportCoreToClient = {
    //   global: JSON.parse(JSON.stringify(Atomic.global)) as IGlobal, //gambi para clonar objeto
    //   atoms: [] as Array<IAtom>,
    //   ClientVariables: ClientVariables as IClientVariables,
    //   AtomicVariables: AtomicVariables as IAtomicVariables,
    //   hotReload: null
    // };
    // if (Atomic.hotReload != null) {
    //   exportCoreToClient.hotReload = {
    //     port: Atomic.hotReload.port,
    //     addrs: Atomic.hotReload.addrs
    //   };
    // }

    // exportCoreToClient.global.isClientSide = true;
    // let exportCoreToClientStringfied = encodeURI(JSON.stringify(exportCoreToClient)).replace(/'/g, '%27'); //fix problemas das aspas com encodeURI - encodeURI do nodejs não encode o ', por isso fazemos isso manualmente
    // jsCore = "const " + ClientVariables.Atomic + " = JSON.parse(decodeURI('" + exportCoreToClientStringfied + "'));";

    //exporta aqui e importa funcoes no lado do client
    /* let functionsToExport = [Atomic.addAtomo, Atomic.printAtoms, Atomic.isRunning, Atomic.getGeoCursorTag, Atomic.renderAtomo, Atomic.replaceExpressao, Atomic.loopRender, Atomic.render, Atomic.renderElement, Atomic.createAtomClass, Atomic.notifyAtomOnRender, Atomic.getAtom, Atomic.getElement, Atomic.getSub, Atomic.getNucleus, Atomic.add, Atomic.enableHotReloadOnClient, Atomic.renderPageOnClient];
    functionsToExport.forEach(((functionToExport) => {
      jsCore += 'eval(decodeURI(\'' + ClientVariables.Atomic + '.' + functionToExport.name + '=' + Atomic.exportFunction(functionToExport) + '\'));';
    })); */

    //Turn On HotReload
    /*   if (Atomic.hotReload != null) {
        jsCore += ClientVariables.Atomic + "." + Atomic.enableHotReloadOnClient.name + "();";
      } */
    /*  jsCore += "Atomic.renderPageOnLoad();"; */

    /* Save core */
    /*     let jsCorePath = path.join(Atomic.config.bundleDir, 'atomicreact.core.js');
        writeFileSync(jsCorePath, jsCore); */

    /* Bundle Core */
    const coreBundlePath = join(this.config.bundleDir, 'atomicreact.core.js');
    writeFileSync(coreBundlePath, readFileSync(resolve(join(__dirname, "../helper/loader.js")), { encoding: "utf-8" }), { encoding: "utf-8" })

    const atomicReactModule = "AtomicReact"
    const compilerOptions = Atomic.getTranspileOptions(atomicReactModule.toLowerCase())
    const transpiledCore = TS.transpileModule(readFileSync(resolve(join(__dirname, `lib.js`))).toString(), compilerOptions)
    appendFileSync(coreBundlePath, transpiledCore.outputText);


    /* Bundle Logic */
    const logicBundlePath = join(this.config.bundleDir, 'atomicreact.bundle.js');
    writeFileSync(logicBundlePath, readFileSync(resolve(join(__dirname, "../helper/switch_bundle.js")), { encoding: "utf-8" }).replaceAll("{{PACKAGE_NAME}}", this.config.packageName))
    Atomic.readAtomsDir(this.config.atomicDir, (atomKey, filePath) => {
      // if (atomKey != "atom1" && atomKey != "dashboard") return;
      if (this.config.debug) console.log(`\t[LOGIC] [${atomKey}] => ${filePath}`);

      const relativePath = resolveModuleName(relative(this.config.atomicDir, filePath))

      const transpiled = TS.transpileModule(readFileSync(filePath).toString(), Atomic.getTranspileOptions(relativePath))
      appendFileSync(logicBundlePath, transpiled.outputText);
    }, [".js", ".ts" , ".tsx"])



    /* Pos Build */
    appendFileSync(logicBundlePath, readFileSync(resolve(join(__dirname, "../helper/pos_load.js")), { encoding: "utf-8" }));

    // const compilerHost = TS.createCompilerHost(compilerOptions.compilerOptions)
    // compilerHost.readDirectory(this.config.atomicDir, ["tsx"])

    /* appendFileSync(logicBundlePath, readFileSync(resolve(join(__dirname, "../init/switchBundle.js")), { encoding: "utf-8" }).replaceAll("{{PACKAGE_NAME}}", this.config.packageName+"_other"))
    Atomic.readAtomsDir(this.config.atomicDir, (atomKey, filePath) => {
      // if (atomKey != "atom1" && atomKey != "dashboard") return;
      if (this.config.debug) console.log(`\t[LOGIC] [${atomKey}] => ${filePath}`);

      const relativePath = relative(this.config.atomicDir, filePath).replaceAll("\\", "/").replaceAll(".ts", "").replaceAll(".js", "")

      const transpiled = TS.transpileModule(readFileSync(filePath).toString(), Atomic.getTranspileOptions(relativePath))
      appendFileSync(logicBundlePath, transpiled.outputText);

      // appendFileSync(logicBundlePath, transpiled.sourceMapText);
    }, [".js", ".ts"]) */


    // writeFileSync(logicBundlePath, transpiled.outputText);


    /* Export atoms */
    // let atomsToExport = {
      // atoms: this.atoms
    // };
    // const atomsToExportStringfied = encodeURI(JSON.stringify(atomsToExport)).replace(/'/g, '%27'); //fix problemas das aspas com encodeURI - encodeURI do nodejs não encode o ', por isso fazemos isso manualmente
    // const atoms = "JSON.parse(decodeURI('" + atomsToExportStringfied + "')).atoms.forEach(function(atom){" + atomicReactModule + ".atoms.push(atom);});";
    // appendFileSync(logicBundlePath, `JSON.parse(decodeURI('${atomsToExportStringfied}')).atoms.forEach(function(atom){require('${atomicReactModule.toLowerCase()}').${atomicReactModule}.atoms.push(atom);});`);

    /* First render */
    // const renderOnLoad = `${atomicReactModule}.renderPageOnLoad();`
    // appendFileSync(logicBundlePath, renderOnLoad);

    // let jsBundle = "";

    // //export atoms
    // let atomsToExportToClient = {
    //   atoms: Atomic.atoms
    // };

    // const exportAtomsToClientStringfied = encodeURI(JSON.stringify(atomsToExportToClient)).replace(/'/g, '%27'); //fix problemas das aspas com encodeURI - encodeURI do nodejs não encode o ', por isso fazemos isso manualmente
    // jsBundle = "JSON.parse(decodeURI('" + exportAtomsToClientStringfied + "')).atoms.forEach(function(Atomo){" + ClientVariables.Atomic + ".atoms.push(Atomo);});";
    /*
       let jsAtomFile;
       // console.log(Atomic.Config.paths.js);
       Atomic.atoms.forEach(((atom, index) => {
         jsAtomFile = path.join(Atomic.config.paths.js, atom.key + '.js');
         if (!existsSync(jsAtomFile)) {
           if (Atomic.config.debug) { console.log(ConsoleFlags.warn, "File " + jsAtomFile + " not exist"); }
           return;
         }
   
         let importedAtom;
         try {
           delete require.cache[path.resolve(jsAtomFile)];
           importedAtom = require(jsAtomFile);
         } catch (e) {
           console.log(ConsoleFlags.erro, e["message"]);
           console.log(ConsoleFlags.erro, e["stack"]);
           // console.log( Object.getOwnPropertyNames(e));
           // console.log(e.stack);
           return;
         }
   
         // console.log(Object.getOwnPropertyNames(AtomoImported));
         let AtomoImportedObjName = Object.getOwnPropertyNames(importedAtom);
         Object.values(importedAtom).forEach(((value, indexValues) => {
           // console.log(typeof value);
           // console.log(AtomoImportedObjName[indexValues]);
           if (AtomoImportedObjName[indexValues] == "main") {
             jsBundle += 'eval(decodeURI(\'' + ClientVariables.Atomic + '.getAtom(\"' + atom.key + '\").mainClass = ' + encodeURI(value.toString()).replace(/'/g, '%27') + '\'));';
             jsBundle += 'eval(decodeURI(\'' + ClientVariables.Atomic + '.getAtom(\"' + atom.key + '\").' + AtomoImportedObjName[indexValues] + ' = new (' + ClientVariables.Atomic + '.getAtom(\"' + atom.key + '\")).mainClass();\'));';
           }
         }));
         // console.log(Object.values(AtomoImported)[2].toString());
         // console.log(Object.values(AtomoImported));
         // console.log(AtomoImportedObjName);
         if (importedAtom.main == undefined && Atomic.config.debug == true) {
           console.log(ConsoleFlags.warn, "[" + atom.key + "] don't have main class");
         }
   
       })); */

    /* Bundle Styles */
    const styleBundlePath = join(this.config.bundleDir, 'atomicreact.bundle.css');
    writeFileSync(styleBundlePath, "")
    Atomic.readAtomsDir(this.config.atomicDir, (atomKey, filePath) => {
      if (this.config.debug) console.log(`\t[STYLE] [${atomKey}] => ${filePath}`);
      appendFileSync(styleBundlePath, readFileSync(filePath));
    }, [".css"])


    /*     Atomic.atoms.forEach(((Atomo, index) => {
          cssAtomoFile = path.join(Atomic.config.paths.css, Atomo.key + '.css');
          if (!existsSync(cssAtomoFile)) {
            if (Atomic.config.debug) console.log(ConsoleFlags.warn, "File " + cssAtomoFile + " not exist");
            return;
          }
          cssBundle += readFileSync(cssAtomoFile).toString();
        })); */

    //Bundle dependencies
    // let packageJson = JSON.parse(readFileSync(path.join(process.cwd(), "package.json")).toString());
    // let nodeModulesPath = path.join(process.cwd(), "node_modules");
    // try {
    //   if (Atomic.config.debug && packageJson.atomicReact.dependencies.length > 0) { console.log(ConsoleFlags.info, "Dependencies Loaded"); }
    //   packageJson.atomicReact.dependencies.forEach(((dp) => { //dp = dependencie name
    //     let dpPath = path.join(nodeModulesPath, dp);

    //     let dpConfig = require(path.join(dpPath, "AtomicReact_config.ts"));

    //     let dpBundleJsPath = path.join(dpPath, dpConfig.bundleDir);
    //     let dpBundleCssPath = path.join(dpBundleJsPath, "atomicreact.bundle.css");
    //     dpBundleJsPath = path.join(dpBundleJsPath, "atomicreact.bundle.js");

    //     /* if (existsSync(dpBundleJsPath)) { jsBundle += readFileSync(dpBundleJsPath).toString(); }
    //     if (existsSync(dpBundleCssPath)) { cssBundle += readFileSync(dpBundleCssPath).toString(); } */

    //     if (Atomic.config.debug) { console.log(ConsoleFlags.info, "\t[+] " + dp); }
    //   }));
    // } catch (e) {/*console.log(e);*/ };

    // //Save de bundle
    // let jsBundlePath = path.join(Atomic.config.bundleDir, 'atomicreact.bundle.js');
    // writeFileSync(jsBundlePath, jsBundle);


    // writeFileSync(styleBundlePath, cssBundle);
  }

  /*   static getAtom(atomKey: IAtom["key"]) {
      let index = -1;
      for (let i = 0; i < Atomic.atoms.length; i++) {
        if (atomKey == Atomic.atoms[i].key) {
          index = i;
        }
      }
      return Atomic.atoms[index];
    } */





}
