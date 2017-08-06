import 'babel-polyfill';
import 'source-map-support/register';

global.Promise = require('bluebird');

import 'app-module-path/register';

import 'server';
