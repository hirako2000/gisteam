import {app} from 'server';
import {post, get} from 'koa-route';
import moment from 'moment';
import template from './template.marko';
import otemplate from './otemplate.marko';
import Paste from '../../db/models/paste';

const minutes = '10 MINUTES';
const hour = '1 HOUR';
const day = '1 DAY';
const week = '1 WEEK';
const month = '1 MONTH';

const expirations = [minutes, hour, day, week, month];

app.use(get('/paste', async (ctx, next) => {
  ctx.body = template.stream({expirations});
  ctx.type = 'text/html';
}));

app.use(get('/paste/:id', async (ctx, id) => {
  let pasteEntity;
  if (id.match(/^[0-9a-fA-F]{24}$/))
    pasteEntity = await Paste.findOne({_id: id});

  let output;
  let expiry;
  let size;
  if (pasteEntity && !isExpired(pasteEntity.expiry)) {
    output = pasteEntity.content;
    expiry = moment(pasteEntity.expiry).fromNow();
    size = Buffer.byteLength(output, 'utf8');
  }

  ctx.body = otemplate.stream({expiry, result: output, id, size});
  ctx.type = 'text/html';
}));

function isExpired(expiryDate) {
  return moment(expiryDate).isBefore(new Date());
}

app.use(get('/paste/raw/:id', async (ctx, id) => {
  let pasteEntity;
  if (id.match(/^[0-9a-fA-F]{24}$/))
    pasteEntity = await Paste.findOne({_id: id});

  if (!pasteEntity || isExpired(pasteEntity.expiry)) {
    ctx.response.status = 404;
    return;
  }

  const output = pasteEntity.content;

  ctx.body = output;
  ctx.type = 'text';
}));

app.use(get('/paste/download/:id', async (ctx, id) => {
  let pasteEntity;
  if (id.match(/^[0-9a-fA-F]{24}$/))
    pasteEntity = await Paste.findOne({_id: id});

  if (!pasteEntity || isExpired(pasteEntity.expiry)) {
    ctx.response.status = 404;
    return;
  }

  const output = pasteEntity.content;

  ctx.body = output;
  ctx.set('Content-disposition', `attachment; filename=${id}.txt`);
  ctx.type = 'text';
}));

app.use(post('/paste', async (ctx, next) => {
  const expiration = ctx.request.body.expiration;
  const input = ctx.request.body.input;
  let output;

  let expiry;
  switch (expiration) {
    case minutes:
      expiry = moment(new Date()).add(10, 'm');
      break;
    case hour:
      expiry = moment(new Date()).add(1, 'h');
      break;
    case day:
      expiry = moment(new Date()).add(1, 'd');
      break;
    case week:
      expiry = moment(new Date()).add(1, 'w');
      break;
    case month:
      expiry = moment(new Date()).add(1, 'M');
      break;
    default:
        // Let's default to 1 week
      expiry = moment(new Date()).add(1, 'w');
  }

  const pasteEntity = new Paste();
  pasteEntity.content = input;
  pasteEntity.expiry = expiry;
  await pasteEntity.save();

  ctx.redirect('/paste/' + pasteEntity._id);
}));

