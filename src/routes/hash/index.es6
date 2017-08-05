import { app } from 'server';
import { post, get } from 'koa-route';
import Hashes from 'jshashes';
import template from './template.marko';

const md5 = 'MD5';
const sha1 = 'SHA1';
const sha256 = 'SHA256';
const sha512 = 'SHA512';
const ripemd = 'RIPEMD-160';


const MD5 = new Hashes.MD5
const SHA1 = new Hashes.SHA1
const SHA256 =  new Hashes.SHA256
const SHA512 = new Hashes.SHA512
const RMD160 = new Hashes.RMD160

app.use(get('/hash', async(ctx, next) => {
  ctx.body = template.stream({ });
  ctx.type = 'text/html';
}));

app.use(post('/hash', async(ctx, next) => {
  const input = ctx.request.body.input;
  let output;

  const md5Hex = MD5.hex(input);
  const sha1Hex = SHA1.hex(input);
  const sha256Hex = SHA256.hex(input);
  const sha512Hex = SHA512.hex(input);
  const rmd160Hex = RMD160.hex(input);

  const hexHashes = {
      md5: md5Hex,
      sha1: sha1Hex,
      sha256: sha256Hex,
      sha512: sha512Hex,
      RMD160: rmd160Hex
  };

  const md5B64 = MD5.b64(input);
  const sha1B64 = SHA1.b64(input);
  const sha256B64 = SHA256.b64(input);
  const sha512B64 = SHA512.b64(input);
  const rmd160B64 = RMD160.b64(input);
  const noneB64 = new Buffer(input).toString('base64')

  const b64Hashes = {
      none: noneB64,
      md5: md5B64,
      sha1: sha1B64,
      sha256: sha256B64,
      sha512: sha512B64,
      RMD160: rmd160B64
  }

  ctx.body = template.stream({ hexHashes, b64Hashes, input });
  ctx.type = 'text/html';
}));


