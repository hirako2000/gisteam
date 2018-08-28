import http from "http";
import koa from "koa";
import isDev from "isdev";
import convert from "koa-convert";
import bodyParser from "koa-better-body";
import serve from "koa-static";
import winston from "winston";
import { createLogger, transports, format } from "winston";
const logform = require("logform");
const { combine, timestamp, label, printf } = logform.format;

import lasso from "lasso";
import lassoReqNoop from "lasso/node-require-no-op";
import markoNodeReq from "marko/node-require";
require("marko/compiler").defaultOptions.writeToDisk = false;
import mongoose from "mongoose";
import helmet from "koa-helmet";
import monitor from "koa-monitor";
import config from "./config/config";

/* Koa App/Server */
export const app = new koa();
const serverPort = config.server.port;
const server = http.createServer(app.callback());

/* config winston */
winston.add(new winston.transports.Console());
const logger = createLogger({
  format: combine(
    label({ label: "Gisteam Server" }),
    timestamp(),
    printf(nfo => {
      return `${nfo.timestamp} [${nfo.label}] ${nfo.level}: ${nfo.message}`;
    })
  ),
  transports: [new transports.Console()]
});

/* Stats */
const statsOptions = {
  path: "/status",
  spans: [
    {
      interval: 1, // Every second
      retention: 60 // Keep 60 datapoints in memory
    },
    {
      interval: 5, // Every 5 seconds
      retention: 60
    },
    {
      interval: 15, // Every 15 seconds
      retention: 60
    },
    {
      interval: 30, // Every 30 seconds
      retention: 60
    }
  ]
};
app.use(monitor(server, statsOptions));

/* Static Files */
app.use(
  convert(
    serve(__dirname + "/public", {
      maxage: isDev ? 0 : 2628000,
      gzip: !isDev,
      hidden: isDev
    })
  )
);

/* Body Parser (form submission) */
app.use(
  convert(
    bodyParser({
      multipart: false,
      fields: "body",
      textLimit: "8000kb", // Default is '100kb'
      formLimit: "8000kb"
    })
  )
);

/* Marko (Templating) */
markoNodeReq.install();

/* Lasso (Bundler) */
lasso.configure({
  plugins: ["lasso-marko", "lasso-stylus", "lasso-less"],
  outputDir: __dirname + "/public/lasso",
  urlPrefix: "/lasso",
  resolveCssUrls: true,
  fingerprintsEnabled: !isDev,
  minify: !isDev,
  bundlingEnabled: !isDev
});
lassoReqNoop.enable(".css", ".styl", ".less");

/* Error handler */
app.use(async (ctx, next) => {
  try {
    await next();
    // Yes, I know what I'm doing...
    ctx.set("X-XSS-Protection", "0");
  } catch (err) {
    ctx.status = 500;
    ctx.body = err.stack;
  }
});

/* Some security, excluding xssFilter */
app.use(
  helmet({
    xssFilter: false
  })
);

/* Routes */
require("./routes/home");
require("./routes/beautify");
require("./routes/paste");
require("./routes/hash");
require("./routes/minify");
require("./routes/encode");
require("./routes/decode");

/* Connect to MongoDB */
const mongoHost = process.env.DB_HOST || config.mongodb.host;
const mongoPort = process.env.DB_PORT || config.mongodb.port;
const mongoName = process.env.DB_NAME || config.mongodb.db;
const mongoDB = mongoHost + ":" + mongoPort + "/" + mongoName;
mongoose.connect(
  mongoDB,
  { useNewUrlParser: true }
);
mongoose.connection.on("error", e => {
  winston.error("MongoDB Connection Error.", e);
  winston.log("MongoDB is expected to be at: " + mongoDB);
  winston.log("Please make sure that MongoDB is running there");
  process.exit(1);
});

/* Start Listening */
server.listen(serverPort, () =>
  logger.info("Server now listening on " + serverPort)
);
