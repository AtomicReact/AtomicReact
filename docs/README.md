# AtomicReact  &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/facebook/react/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/atomicreact.svg?style=flat)](https://www.npmjs.com/package/atomicreact)

AtomicReact is a framework to build web apps with atomicity concept

## Features

* **Fast to Get Started**: Install and run
* **Strong Ecosystem**:
    *  Build encapsulated atoms that manage their own state, then compose them to make complex UIs.
    *  Easy to use atoms from other developers
    *  Atom is made by structure, logic and style! In our words: Atom = { html, js, css }
* **HotReload**: Code and view in same time
* **Build with NodeJs Modules**: Easy to build with Express, Gulp, Grunt, UglifyJS2
* **Fast Front-End Development**: Create once, reuse afterwards
* **Build from what you already know**: HTML, CSS and JAVASCRIPT

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

*init* command will create the default files. And *run* will start Atomic using these files.
Or you can do 3. and 4. steps in one with:
```
  Atomic
```
that's all folks !

## Let's get a little teoria before get started?!
AtomicRact was designed in atoms concept. Whats are the things made ?
Let's get an essencial thing to our lives: The Water. The water is made with a lot of molecules whose each one is composed by one oxigen and two hidrogen atoms.
Basically Atom Conecept is create things from the minimal part of them.

## Get Started
One atom is formed by 3 parts: Structure (html) & Logic Interface (Js) & Style (Css). Necessarily, an atom need to have a structure but doesn't a logic and style.
The *Atomic dir* there three dirs: html, js, css.
```
    AtomicDir
    ├──  html
    ├──  js
    ├──  css
```
**To create an atom**, just create one file with anyone name in *AtomicDir->html* folder.
