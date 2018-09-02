#!/usr/bin/env node
var path = require('path');
var fs = require('fs');
const { exec } = require('child_process');

var ConsoleIO = require('./tools/ConsoleIO.js');
var ConsoleFlags = require('./ConsoleFlags.js');

class AtomicCLI {
  constructor() {
    this.pathAtomicConfig = path.join(__dirname, 'AtomicConfig.js');
    this.pathAtomicConfigDev = path.join(process.cwd(), path.parse(this.pathAtomicConfig).base);

    var params = [
      {nome: "<Command>", valor: process.argv[2]}
    ];
    if(params[0].valor=="init") { this.init(); };
    if(params[0].valor=="run" || params[0].valor==undefined || params[0].valor==null) { this.run(); };
  };
  init() {
    // console.log('Atomic init commanded');
    /* Copy AtomicConfig.js to developer working dir */
    var copyAtomicConfig = ()=> {
      fs.readFile(this.pathAtomicConfig, (err, data)=>{
        if(err) { return console.log(ConsoleFlags.erro, "Erro [0] on create AtomicConfig.js on "+process.cwd());}
        fs.writeFile(this.pathAtomicConfigDev, data, (err)=>{
          if(err) { return console.log(ConsoleFlags.erro, "Erro [1] on create AtomicConfig.js on "+process.cwd()); }
          return console.log(ConsoleFlags.info, "Atomic initialized in "+process.cwd() );
        });
      });
    };
    if(fs.existsSync(this.pathAtomicConfigDev)) {
      console.log(ConsoleFlags.warn, "You already have a AtomicConfig file. Are you sure replace? (Type Y to replace)");
      ConsoleIO.readLine().on('lineReaded', (line)=>{
        if(line.toLowerCase().indexOf("y")==-1) {
          return console.log(ConsoleFlags.info, "Atomic init aborted");
        } else {
          copyAtomicConfig();
        }
      });
    } else {
      copyAtomicConfig();
    }

  };
  run() {
    // console.log('Atomic run commanded');
    var childProcess = exec('node AtomicConfig.js', (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(stdout);
    });
    childProcess.stdout.on('data', (data)=>{
      console.log(data);
    });
  };
}

new AtomicCLI();
