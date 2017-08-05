import { app } from 'server';
import { post, get } from 'koa-route';
import jsBeautify from 'js-beautify';
import template from './template.marko';
import {pd} from 'pretty-data';

const beautifyJs = jsBeautify.js_beautify;
const beautifyCss = jsBeautify.css;
const beautifyHtml = jsBeautify.html;

const javascript = 'JAVASCRIPT/JSON';
const xml = 'XML';
const html = 'HTML';
const css = 'CSS';
const sql = 'SQL';

const formats = [javascript, xml, html, css, sql];

app.use(get('/beautify', async(ctx, next) => {
  ctx.body = template.stream({ formats: formats });
  ctx.type = 'text/html';
}));

app.use(post('/beautify', async(ctx, next) => {
  const format = ctx.request.body.format;
  const input = ctx.request.body.input;
  let output;

  switch(format) {
    case javascript:
        output =  beautifyJs(input, { indent_size: 4});
        break;
    case html:
        output =  beautifyHtml(input, { indent_size: 4 });
        break;
    case css:
        output =  beautifyCss(input, { indent_size: 4 });
        break;
    case sql:
        output = pd.sql(input);
        break;
    case xml:
        output = pd.xml(input);
        break;
    case "guess":
        output =  beautifyJs(input, { indent_size: 4 });
        break;
    default:
        output =  beautifyJs(input, { indent_size: 4 });
  }

  ctx.body = template.stream({ format, formats, input, result: output });
  ctx.type = 'text/html';
}));


