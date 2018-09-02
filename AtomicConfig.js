var path = require('path');
var Atomic = require('atomicreact').Atomic;
var AtomicHotReload = require('atomicreact').HotReload;

var atomicConfig = {
	publicDir: path.join(__dirname, ''), //publicDir: folder with static files (js, css, imgs...). See documentation for more info.
	paths:{
		html: '<AtomicConfigPathsHtml>', //path where your html Atoms are
		js: '<AtomicConfigPathsJs>', //path where your js Atoms are
		css: '<AtomicConfigPathsCss>', //path where your css Atoms are
	},
	debug: true,
	devMode: true //if false, Atomic dev modules like HotReload won't be runned on client side
};

var myHotReload = new AtomicHotReload(runAtomic, 1337, 'localhost'); //initialize Atomic HotReload on localhost:1337
myHotReload.start();

/* All changes in Atomic files will call the function runAtomic if using HotReload*/
function runAtomic(){
	var myAtomic = new Atomic(atomicConfig, myHotReload); //initialize Atomic using HotReload
	// myAtomic.setPreRender(['oneAtom']); //Atoms will be pre renderized on compile.
	myAtomic.printAtoms(); //print all Atoms loaded
	myAtomic.compileFile(path.join(__dirname, '<AtomicCompileFile>')); //file to compile e.g: myAtomic.compileFile(path.join(__dirname, 'index.html'));
}
