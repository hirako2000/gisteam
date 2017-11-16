import {app} from 'server';
import {post, get} from 'koa-route';
import UglifyJS from 'uglify-es';
import jsonminify from 'jsonminify';
import CleanCSS from 'clean-css';
import {pd} from 'pretty-data';
import template from './template.marko';

const javascript = 'JAVASCRIPT';
const json = 'JSON';
const xml = 'XML';
const css = 'CSS';
const sql = 'SQL';

const formats = [javascript, json, xml, css, sql];

const title = 'Minify - GisTeam';

app.use(get('/minify', async ctx => {
  ctx.body = template.stream({formats, title});
  ctx.type = 'text/html';
}));

app.use(post('/minify', async ctx => {
  const format = ctx.request.body.format;
  const input = ctx.request.body.input;
  let output;

  switch (format) {
    case javascript:
      output = minifyJS(input);
      break;
    case json:
      output = minifyJSON(input);
      break;
    case css:
      output = minifyCSS(input);
      break;
    case sql:
      output = pd.sqlmin(input);
      break;
    case xml:
      output = pd.xml(input);
      break;
    case 'guess':
      output = minifyJS(input);
      break;
    default:
      output = minifyJS(input);
  }

  ctx.body = template.stream({format, formats, input, result: output, title});
  ctx.type = 'text/html';
}));

function minifyJS(data) {
  const out = UglifyJS.minify(data, {
    compress: false, mangle: false
  });
  if (out.error) return 'Parsing Error, perhaps try JSON minifier...';
  return out.code;
}

function minifyJSON(data) {
  return jsonminify(data);
}

function minifyCSS(data) {
  const output = new CleanCSS({}).minify(data);
  if (!output || output.styles.length === 0) return 'No CSS in there...';
  return output.styles;
}
