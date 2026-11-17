const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'northstar-test-'));
process.env.DB_PATH = path.join(tmp, 'products.db');
const app = require('../app');
const db = require('../db');
let server, origin;
test.before(async () => {
  server = await new Promise(resolve => {const s = app.listen(0, () => resolve(s));});
  origin = `http://127.0.0.1:${server.address().port}`;
});
test.after(async () => {
  await new Promise(resolve => server.close(resolve));
  db.close();
  fs.rmSync(tmp, {recursive: true, force: true});
});
test('health', async () => {
  const r = await fetch(origin + '/api/health');
  assert.equal(r.status, 200);
  assert.equal((await r.json()).status, 'ok');
});
test('lists seeded products', async () => {
  const r = await fetch(origin + '/api/products');
  const d = await r.json();
  assert.equal(r.status, 200);
  assert.equal(d.total, 12);
});
test('search and filters', async () => {
  const r = await fetch(origin + '/api/products?search=headphones&category=Tech&maxPrice=2500');
  const d = await r.json();
  assert.equal(d.total, 1);
  assert.match(d.products[0].name, /Headphones/);
});
test('detail and invalid IDs', async () => {
  assert.equal((await fetch(origin + '/api/products/1')).status, 200);
  assert.equal((await fetch(origin + '/api/products/nope')).status, 400);
  assert.equal((await fetch(origin + '/api/products/999999')).status, 404);
});
test('bad queries are rejected', async () => {
  assert.equal((await fetch(origin + '/api/products?minPrice=-1')).status, 400);
  assert.equal((await fetch(origin + '/api/products?sort=something')).status, 400);
});
test('add product, find via search, and delete product', async () => {
  const r = await fetch(origin + '/api/products', {
    method: 'POST', headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({name:'New Test Bottle', description:'Lab sample', price:599, category:'Supplies', image_url:'/assets/bottle.svg'})
  });
  assert.equal(r.status, 201);
  const p = await r.json();
  assert.equal(p.name, 'New Test Bottle');
  assert.equal(p.price, 599);
  assert.ok(p.id > 12);
  const search = await (await fetch(origin + '/api/products?category=Supplies')).json();
  assert.equal(search.total, 1);
  assert.equal(search.products[0].id, p.id);
  const deletion = await fetch(`${origin}/api/products/${p.id}`, {method:'DELETE'});
  assert.equal(deletion.status, 200);
  assert.equal((await deletion.json()).deleted, true);
  assert.equal((await fetch(`${origin}/api/products/${p.id}`)).status, 404);
  assert.equal((await fetch(`${origin}/api/products/${p.id}`, {method:'DELETE'})).status, 404);
});
test('reject invalid product data and unsafe image URLs', async () => {
  const invalid = [
    {name:'', category:'Tech', price:120},
    {name:'X', category:'Tech', price:-50},
    {name:'X', category:'Tech', price:30, image_url:'javascript:alert(1)'},
    {name:'X', category:'Tech', price:0, image_url:'data:text/html,hello'},
  ];
  for (const body of invalid) {
    const r = await fetch(origin + '/api/products', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)});
    assert.equal(r.status, 400);
  }
});
