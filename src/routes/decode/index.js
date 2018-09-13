import { app } from 'server';
import { post, get } from 'koa-route';
import template from './template.marko';

const url = 'URL';
const base64 = 'Base64';

const formats = [url, base64];

const title = 'Decode - GisTeam';

app.use(
  get('/decode', async (ctx, next) => {
    ctx.body = template.stream({ formats, title });
    ctx.type = 'text/html';
  })
);

app.use(
  post('/decode', async (ctx, next) => {
    const format = ctx.request.body.format;
    const input = ctx.request.body.input;
    let output;

    switch (format) {
      case url:
        output = decodeURI(input);
        break;
      case base64:
        output = Buffer.from(input, 'base64').toString();
        break;
      default:
        output = decodeURI(input);
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
