# Atomic

Atomic is a framework to build web apps with atomicity concept

## Features

* **Simple to Get Started**: Install with npm, config and run
* **Strong Ecosystem**: Build encapsulated components that manage their own state, then compose them to make complex UIs
* **HotReload**: Code and view in development time
* **NodeJs Modules Compatibility**: Build with Express, Gulp, Grunt, UglifyJS2,... Or not
* **Fast Front-End Development**: Create once, reuse afterwards
* **Build from what you already know**: HTML, CSS and JAVASCRIPT

## Requirements
  1. [NodeJs](https://nodejs.org)

## Setup
  1. Install Atomic CLI via npm (**globally -g**) (Optional, but recommended for beginner)
  ```
    npm install Atomic -g
  ```
  2. Install Atomic module in your project via npm (**less global tag -g**)
  ```
    npm install Atomic
  ```
  3. Now **create the AtomicConfig.js file**. *AtomicConfig.js* file sets up all Atomic with your project. To create a default AtomicConfig file, you may run Atomic CLI command:
  ```
    Atomic init
  ```
  Or you can create it yourself (*File->New->AtomicConfig.js*)

  4. Read the *Section [AtomicConfig API](#atomicconfig-api)* to know how to config Atomic

  5. Run Atomic! Run Atomic CLI command:
  ```
    Atomic run
  ```
  Or you can run it yourself
  ```
    node AtomicConfig
  ```

## AtomicConfig API
  TODO...But for while read code comments on AtomicConfig.js created via **Atomic init** command.

## Simple example
  1. Clone this repo.
  2. Go to *Examples/simple_app*
  3. Install dependencies with npm:
  ```
    npm install
  ```
  4. And run (Atomic CLI must be installed):
  ```
    Atomic run
  ```
