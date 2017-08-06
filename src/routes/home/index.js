import {app} from 'server';
import {post, get} from 'koa-route';
import template from './template.marko';
import 'public/assets/css/styles.css';

app.use(get('/', async (ctx, next) => {
  ctx.body = template.stream({ });
  ctx.type = 'text/html';
}));

