var path = require('path');
var Atomic = require('Atomic').Atomic;
var AtomicHotReload = require('Atomic').HotReload;

var atomicConfig = {
	publicDir: path.join(__dirname, 'public'), //publicDir: folder with static files (js, css, imgs...). See documentation for more info.
	paths:{
		html: 'myAtomic', //path where your html Atoms are
		js: 'myAtomicStatic/js', //path where your js Atoms are. (public/myAtomicStatic/js)
		css: 'myAtomicStatic/css', //path where your css Atoms are. (public/myAtomicStatic/css)
	},
	debug: true,
	devMode: true //if false, Atomic dev modules like HotReload won't be runned on client side
};

var myHotReload = new AtomicHotReload(runAtomic, 1337, 'localhost'); //initialize Atomic HotReload on localhost:1337
myHotReload.start();

/* All changes in Atomic files will call the function runAtomic if using HotReload*/
function runAtomic(){
	var myAtomic = new Atomic(atomicConfig, myHotReload); //initialize Atomic using HotReload
	myAtomic.setPreRender(['myHeadDefault']); //Atoms will be pre renderized on compile.
	myAtomic.printAtoms(); //print all Atoms loaded
	myAtomic.compileFile(path.join(__dirname, 'index.html')); //file to compile e.g: myAtomic.compileFile(path.join(__dirname, 'index.html'));
}
