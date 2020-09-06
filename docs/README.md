# AtomicReact  &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/AtomicReact/AtomicReact/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/atomicreact.svg?style=flat)](https://www.npmjs.com/package/atomicreact) ![NPM Downloads](https://img.shields.io/npm/dt/atomicreact.svg)

![Logo](/assets/logo.svg?)

AtomicReact is a framework to build Web Apps with atomicity concept
## Features

* **Fast to Get Started**: Install and run!
* **Strong Ecosystem**:
    *  Build encapsulated Atoms, then compose them to make complex UIs.
    *  Easy to use Atoms from other developers
    *  Atom is made by structure, logic and style! In our words: Atom = { html, js, css }
* **Don't waste time recompiling**: Code and view in same time with HotReload feature
* **NodeJs Modules Compatibility**: Easy to build with Express, Gulp, Grunt, UglifyJS2, ...
* **Fast Front-End Development**: Create once, reuse afterwards
* **Organized**: Each part in its own directory
* **Share**: Fast to share your Atoms with others developers.

## Requirements
1. [NodeJs](https://nodejs.org) (with NPM of course)

## Getting a little theoretical
AtomicReact was designed using atoms as concept. What are the things in the universe made of?
Let's use an essencial thing in our lives as an example: The Water. The water molecule is made up of two hydrogen atoms and one oxygen atom.
Basically Atom Concept is create things from the smallest particle of them.

## How it works
In AtomicReact the smallest particle is called an Atom. One Atom is formed by 3 parts: Structure (HTML) & Logic (JS) & Style (CSS). Necessarily, an Atom need to have a structure but doesn't need a logic and style.
After running `Atomic` command, your `AtomicDir` is created and that's where your Atoms will be.
In `AtomicDir` there are three dirs: html, js, css.
``` text
└── AtomicDir
    ├── html
    ├── js
    └── css
```
**To create an Atom**, just create a file inside the `AtomicDir/html` folder.

[Let's get started!](getStarted?id=installation) 🚀
