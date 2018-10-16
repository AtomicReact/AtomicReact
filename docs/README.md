# AtomicReact  &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/facebook/react/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/atomicreact.svg?style=flat)](https://www.npmjs.com/package/atomicreact)

AtomicReact is a framework to build Web Apps with atomicity concept

## Features

* **Fast to Get Started**: Install and run
* **Strong Ecosystem**:
    *  Build encapsulated atoms that manage their own state, then compose them to make complex UIs.
    *  Easy to use install atoms from other developers
    *  Atom is made by structure, logic and style! In our words: Atom = { html, js, css }
* **Don't waste time recompiling**: Code and view in same time with HotReload feature
* **NodeJs Modules Compatibility**: Easy to build with Express, Gulp, Grunt, UglifyJS2, ...
* **Fast Front-End Development**: Create once, reuse afterwards
* **Build from what you already know**: HTML, CSS and JAVASCRIPT
* **Share**: Share your atoms with others developers.

## Requirements
1. [NodeJs](https://nodejs.org) (with NPM of course)


## Installation
1. Install Atomic package globally via *npm* (to use CLI commands)
```
  npm install atomicreact -g
```
2. Install Atomic package in your project via *npm*
```
  npm install atomicreact --save
```
3. **Initialize Atomic** inside your project folder:
```
  Atomic init
```
4. **Run Atomic**:
```
  Atomic run
```

that's all folks !

## Let's get a little teoria before get started?!
AtomicRact was designed in atoms concept. Of what things in the universe are made of?
Let's get an essencial thing to our lives: The Water. The water is made with a lot of molecules whose each one is composed by one oxigen and two hidrogen atoms.
Basically Atom Concept is create things from the minimal particle of them.

## How AtomicReact works
In AtomicReact the minimal particle is called by Atom. One Atom is formed by 3 parts: Structure (HTML) & Logic Interface (JS) & Style (CSS). Necessarily, an Atom need to have a structure but doesn't need a logic and style.

After runs *Atomic init* command,  is created your *AtomicDir* where your Atoms will be are
The *Atomic dir* there three dirs: html, js, css.
```
    AtomicDir
    ├──  html
    ├──  js
    ├──  css
```
**To create an atom**, just create one file with anyone name in *AtomicDir->html* folder.


## Full Documentation

The full documentation for AtomoicReact can be found on <https://guihgo.github.io/AtomicReact/>
