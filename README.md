[![Codacy Badge](https://api.codacy.com/project/badge/Grade/c33fcfaa0237435e84dc11ac44ea372c)](https://app.codacy.com/app/hirako2000/gisteam?utm_source=github.com&utm_medium=referral&utm_content=hirako2000/gisteam&utm_campaign=Badge_Grade_Dashboard)
[![uptime](https://img.shields.io/uptimerobot/ratio/m781182158-18096b64a2b89e307dcc0a30)](https://img.shields.io/uptimerobot/ratio/m781182158-18096b64a2b89e307dcc0a30)
[![Build Status](https://travis-ci.org/hirako2000/gisteam.svg?branch=master)](https://travis-ci.org/hirako2000/gisteam)
[![Dependency Status](https://david-dm.org/hirako2000/gisteam.svg?style=flat)](https://david-dm.org/hirako2000/gisteam)
[![devDependency Status](https://david-dm.org/hirako2000/gisteam/dev-status.svg)](https://david-dm.org/hirako2000/gisteam#info=devDependencies)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?maxAge=2592000)](https://github.com/hirako2000/gisteam/blob/master/LICENSE)

# GisTeam - Minimalist web app to minify/beautify code, store, hash and encode/decode text

[Live Demo](https://gisteam.herokuapp.com/)

![demo](https://github.com/hirako2000/gisteam/blob/master/gisteam-demo.gif?raw=true)

## Features
- 💫 Beautifier - Javascript/JSON, XML, HTML, CSS, SQL
- 💨 Minifier - Javascript, JSON, XML, CSS, SQL
- 🔑 Hash - Hash strings with md5 and sha1, sha256, sha512
- 📋 Paste - Pastebin-like feature, with expiry, download and raw view
- ⟿ Encode - URL, Base64
- ⟵ Decode - URL Encode, Base64

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

This transpiles *.js files, and copies other files (css/etc), from /src to /lib

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
    │   │   index.js   // basic initial configuration (babel, sourcemaps)
    │   │
    │   │   server.js  // Koa server and configuration
    │   │              // exports the koa `app` which can be required elsewhere
    │   │              // imports /routes/xxx
    │   │
    │   ├───routes
    │   │   │   layout.marko // basic layout
    │   │   │
    │   │   ├───beautify
    │   │   │       index.js
    │   │   │       template.marko
    │   │   ├───hash
    │   │   │       index.js
    │   │   │       template.marko
    │   │   ├───home
    │   │   │       index.js       // route logic
    │   │   │       template.marko // marko template (extends from layout.marko)
    │   │   │       widget.js      // marko-widget (better client-side javascripting)
    │   │   ├───minify
    │   │   │       index.js
    │   │   │       template.marko
    │   │   ├───paste
    │   │   │       index.js
    │   │   │       template.marko
    │   │   │       otemplate.marko // this one has a specific output template
    │   │   │   browser.json // for lasso
    │   │   │
    │   │   └───...
    │   │
    │   ├───db
    │   │   └───... // db schema for Paste
    │   └───public
    │       └───... // public resources exposed as static files
    │
    │
    ├───lib (auto-generate)
    │   │  // /src gets compiled here, the project mainly runs from here
    │   │  // .js files from /src gets compiled to .js files here
    │   │  // other than .js files get copied as is (css, fonts etc)
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


### <a href='src/index.js'>`src/index.js`</a>

This file sets up preliminaries:

  * babel
  * sourcemap-support
  * [Bluebird] as the  default promise library

### <a href='src/server.js'>`src/server.js`</a>

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

[livedemo]: https://gisteam.herokuapp.com/
