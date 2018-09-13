import { app } from 'server';
import { post, get } from 'koa-route';
import template from './template.marko';

const url = 'URL';
const base64 = 'Base64';

const formats = [url, base64];

const title = 'Encode - GisTeam';

app.use(
  get('/encode', async (ctx, next) => {
    ctx.body = template.stream({ formats, title });
    ctx.type = 'text/html';
  })
);

app.use(
  post('/encode', async (ctx, next) => {
    const format = ctx.request.body.format;
    const input = ctx.request.body.input;
    let output;

    switch (format) {
      case url:
        output = encodeURI(input);
        break;
      case base64:
        output = Buffer.from(input).toString('base64');
        break;
      default:
        output = encodeURI(input);
    }

    ctx.body = template.stream({
      format,
      formats,
      input,
      result: output,
      title
    });
    ctx.type = 'text/html';
  })
);
