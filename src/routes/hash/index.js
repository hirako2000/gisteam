import {app} from 'server';
import {post, get} from 'koa-route';
import Hashes from 'jshashes';
import template from './template.marko';

const MD5 = new Hashes.MD5();
const SHA1 = new Hashes.SHA1();
const SHA256 = new Hashes.SHA256();
const SHA512 = new Hashes.SHA512();
const RMD160 = new Hashes.RMD160();

app.use(get('/hash', async ctx => {
  ctx.body = template.stream({ });
  ctx.type = 'text/html';
}));

app.use(post('/hash', async ctx => {
  const input = ctx.request.body.input;

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

  const b64Hashes = {
    md5: md5B64,
    sha1: sha1B64,
    sha256: sha256B64,
    sha512: sha512B64,
    RMD160: rmd160B64
  };

  ctx.body = template.stream({hexHashes, b64Hashes, input});
  ctx.type = 'text/html';
}));

