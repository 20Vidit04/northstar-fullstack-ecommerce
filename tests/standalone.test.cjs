const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const html = fs.readFileSync(require('node:path').join(__dirname,'..','OPEN-WEBSITE.html'),'utf8');
const js = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const core=js.slice(0,js.indexOf("document.addEventListener('click'"));
const storage = new Map();
function session(){
 const nodes=new Map();
 const qs=(sel)=>{
   if(!nodes.has(sel))nodes.set(sel,{innerHTML:'', textContent:'',value:'',className:'',hidden:false});
   return nodes.get(sel);
 };
 const ctx={console,Math,Number,JSON,Set,String,Array,Object,FormData:class{constructor(form){this.form=form}get(key){return this.form[key]}},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)},document:{querySelector:qs,querySelectorAll:()=>[]},window:{confirm:()=>true},URL};
 vm.createContext(ctx);vm.runInContext(core,ctx);
 return {ctx,run:code=>vm.runInContext(code,ctx),nodes};
}
let s=session();
assert.equal(s.run('allProducts.length'),12);
s.run('renderCategories();filter()');
assert.match(s.nodes.get('#results').innerHTML,/Headphones/);
s.run(`addProductFromForm({name:'Travel Flask',description:'For travelling',price:'849',category:'Daily Carry',image_url:''})`);
assert.equal(s.run('allProducts.length'),13);
assert.equal(s.run('allProducts.find(x=>x.id===13).name'),'Travel Flask');
assert.match(storage.get('northstar-added-products-v2'),/Travel Flask/);
assert.match(s.nodes.get('.tabs').innerHTML,/Daily Carry/);
s=session();assert.equal(s.run('allProducts.length'),13);
s.run('deleteProduct(13)');assert.equal(s.run('allProducts.length'),12);
s=session();assert.equal(s.run('allProducts.length'),12);
s.run('deleteProduct(1)');assert.equal(s.run('allProducts.length'),11);
s=session();assert.equal(s.run('allProducts.length'),11);
s.run('restoreProducts()');assert.equal(s.run('allProducts.length'),12);
console.log('PASS: loaded 12, added and persisted new product, deleted and persisted added product, deleted seed product, restored seeds, rendered search/category/admin.');
