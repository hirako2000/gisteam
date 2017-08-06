[![Build Status](https://travis-ci.org/hirako2000/gisteam.svg?branch=master)](https://travis-ci.org/hirako2000/gisteam)
[![Dependency Status](https://david-dm.org/hirako2000/gisteam.svg?style=flat)](https://david-dm.org/hirako2000/gisteam)
[![devDependency Status](https://david-dm.org/hirako2000/gisteam/dev-status.svg)](https://david-dm.org/hirako2000/gisteam#info=devDependencies)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](https://github.com/hirako2000/gisteam/blob/master/LICENSE)

# GisTeam - A minimalist web app to beautify code, share paste and hash

## Features
- 💫 Beautifier - Javascript/JSON, XML, HTML, CSS, SQL
- 🔑 Hash - Hash strings with md5 and sha1, sha256, sha512
- 📋 Paste - pastebin like feature, with expiry, download and raw view

### Techy bits
- production ready with properly minified, compressed and bundled assets
- pm2 to manage and scale node processes

## Roadmap
- Time manipulation/converter
- Encrypt Pastes

### Techy bits
- Dockerize
- Add unit tests
- Benchmark

## Quickstart

### Prerequisites
- Node.js 
- MongoDB

### Fork/clone/download this repo

### Install dependencies

```bash
npm install
```

### Build the sources

```bash
npm run build
```

This transpiles *.es6 files, and copies other files (css/etc), from /src to /lib

It uses `gulp build` task as defined in the <a href='gulpfile.js'>`.gulpfile`</a>


While developing, use:

```bash
npm run gulp -- build watch
```

This builds the project and then watches /src for file changes and compiles only the changed files.

You can let this run in the background while developing. (you'll still need to restart the server for certain changes to take effect.)

### Run the server

```bash
npm run start

```


## Libraries used

### Koa 2

Koa is an excellent minimalist server framework on node.

>[Koa] is a new web framework designed by the team behind Express, which aims to be a smaller, more expressive, and more robust foundation for web applications and APIs.

### Babel

>[Babel] is a JavaScript compiler. es6/7 is great.

>[ECMAScript 2015] is the newest version of the ECMAScript standard.

Babel transpiles new ES2015 (and ES2016) syntax into ES5 valid code.

### Lasso

>[Lasso.js][lasso] is an open source Node.js-style JavaScript module bundler from eBay. It also provides first-level support for optimally delivering JavaScript, CSS, images and other assets to the browser.

It's like Webpack + Browserify/jspm/RequireJS

### Marko

>[Marko] is a [*really* fast][marko-benchmarks] and lightweight HTML-based templating engine that compiles templates to CommonJS modules and supports streaming, async rendering and custom tags.

### MongoDB/Mongoose

> Ideal for fast development, using [mongoose][mongoose]


## Usage

### Directory structure

    │   package.json
    │   gulpfile.js
    │   .babelrc
    │   .gitignore
    │   README.md
    │
    ├───src
    │   │
    │   │   index.es6  // basic initial configuration (babel, sourcemaps)
    │   │
    │   │   server.es6 // Koa server and configuration
    │   │              // exports the koa `app` which can be required elsewhere
    │   │              // imports /routes/xxx
    │   │
    │   ├───routes
    │   │   │   layout.marko // basic layout
    │   │   │
    │   │   ├───beautify
    │   │   │       index.es6
    │   │   │       template.marko
    │   │   ├───hash
    │   │   │       index.es6
    │   │   │       template.marko
    │   │   ├───home
    │   │   │       index.es6      // route logic
    │   │   │       template.marko // marko template (extends from layout.marko)
    │   │   │       widget.es6     // marko-widget (better client-side javascripting)
    │   │   │
    │   │   ├───paste
    │   │   │       index.es6
    │   │   │       template.marko
    │   │   │       otemplate.marko // this one has a specific output template
    │   │   │
    │   │   │   browser.json // for lasso
    │   │   │
    │   │   └───...
    │   │
    │   ├───db
    │   │       index.es6 // uses redis
    │   │       user.es6  // basic user
    │   │
    │   └───public
    │       └───... // public resources exposed as static files
    │
    │
    ├───lib (auto-generate)
    │   │  // /src gets compiled here, the project mainly runs from here
    │   │  // .es6 files from /src gets compiled to .js files here
    │   │  // other than .es6 files get copied as is (css, fonts etc)
    │   │
    │   ├───public
    │   │   │
    │   │   └────lasso
    │   │        └────...  // lasso related bundled files are auto-generated here
    │   │
    │   └───... whole lib is .gitignore’d as it's essentially just a dumplicate of /src
    │
    ├───.cache (auto-generated, lasso related, .gitignore’d)
    │
    └───node_modules // (.gitignore’d)


### <a href='src/index.es6'>`src/index.es6`</a>

This file sets up preliminaries:

  * babel
  * sourcemap-support
  * [Bluebird] as the  default promise library

### <a href='src/server.es6'>`src/server.es6`</a>

Sets up Koa 2 and most used modules

  * [Static][koa-static] files server from <a href='public'>`/public`</a>
  * [Body Parser][koa-better-body] (for form submission/file updloads)
  * [Marko] \(Templating Language)
  * [Lasso] \(Bundler)

### Route handling (<a href='src/routes'>`src/routes`</a>)

[Koa]: http://koajs.com/
[Koa 2]: https://github.com/koajs/koa/issues/533

[Lasso]: https://github.com/lasso-js/lasso

[Marko]: http://markojs.com
[marko-benchmarks]: https://github.com/marko-js/templating-

[Babel]: http://babeljs.io
[ECMAScript 2015]: http://babeljs.io/docs/learn-es2015

[gulp]: http://gulpjs.com

[node-chakra]: https://github.com/nodejs/node-chakracore


[install Gulp 4]: http://demisx.github.io/gulp4/2015/01/15/install-gulp4.html

[Bluebird]: http://bluebirdjs.com

[app-module-path]: https://github.com/patrick-steele-idem/app-module-path-node

[koa-static]: https://github.com/koajs/static
[koa-better-body]: https://github.com/tunnckoCore/koa-better-body

[mongoose]: http://mongoosejs.com/

