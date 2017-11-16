import config from './config/config';
import koa from 'koa';
import compress from 'koa-compress';
import isDev from 'isdev';
import convert from 'koa-convert';
import bodyParser from 'koa-better-body';
import serve from 'koa-static';
import winston from 'winston';
import lasso from 'lasso';
import lassoReqNoop from 'lasso/node-require-no-op';
import markoNodeReq from 'marko/node-require';
import mongoose from 'mongoose';
import helmet from 'koa-helmet';
import monitor from 'koa-monitor';
import http from 'http';

/* Koa App/Server */
export const app = new koa();
const serverPort = config.server.port;
const server = http.createServer(app.callback());

/* Stats */
const statsOptions = {
  path: '/status',
  spans: [{
    interval: 1,     // Every second
    retention: 60    // Keep 60 datapoints in memory
  }, {
    interval: 5,     // Every 5 seconds
    retention: 60
  }, {
    interval: 15,    // Every 15 seconds
    retention: 60
  }, {
    interval: 30,    // Every 30 seconds
    retention: 60
  }]
};
app.use(monitor(server, statsOptions));

/* Static Files */
app.use(convert(serve(__dirname + '/public', {
  maxage: isDev ? 0 : 2628000,
  gzip: !isDev,
  hidden: isDev
})));

/* Body Parser (form submission) */
app.use(convert(bodyParser({
  multipart: false,
  fields: 'body',
  textLimit: '8000kb', // Default is '100kb'
  formLimit: '8000kb'
})));

/* Marko (Templating) */
markoNodeReq.install();

/* Lasso (Bundler) */
lasso.configure({
  plugins: ['lasso-marko', 'lasso-stylus', 'lasso-less'],
  outputDir: __dirname + '/public/lasso',
  urlPrefix: '/lasso',
  resolveCssUrls: true,
  fingerprintsEnabled: !isDev,
  minify: !isDev,
  bundlingEnabled: !isDev
});
lassoReqNoop.enable('.css', '.styl', '.less');

/* Error handler */
app.use(async (ctx, next) => {
  try {
    await next();
    // Yes, I know what I'm doing...
    ctx.set('X-XSS-Protection', '0');
  } catch (err) {
    ctx.status = 500;
    ctx.body = err.stack;
  }
});

/* Some security, excluding xssFilter */
app.use(helmet({
  xssFilter: false
}));

/* Routes */
require('./routes/home');
require('./routes/beautify');
require('./routes/paste');
require('./routes/hash');
require('./routes/minify');

/* Connect to MongoDB */
const mongoHost = process.env.DB_HOST || config.mongodb.host;
const mongoPort = process.env.DB_PORT || config.mongodb.port;
const mongoName = process.env.DB_NAME || config.mongodb.db;
const mongoDB = mongoHost + ':' + mongoPort + '/' + mongoName;
mongoose.connect(mongoDB, {
  useMongoClient: true
});
mongoose.connection.on('error', (e) => {
  winston.error('MongoDB Connection Error.', e);
  winston.log('MongoDB is expected to be at: ' + mongoDB);
  winston.log('Please make sure that MongoDB is running there');
  process.exit(1);
});

/* Start Listening */
server.listen(serverPort, () => winston.info('Server now listening on ' + serverPort));
