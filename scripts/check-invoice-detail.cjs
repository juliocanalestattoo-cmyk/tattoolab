const fs=require('fs'),vm=require('vm'),assert=require('assert');
const file=require('node:path').join(__dirname,'..','public','index.html');
const html=fs.readFileSync(file,'utf8');
let count=0;
for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){
 if(/text\/plain/.test(match[1]))continue;
 new vm.Script(match[2]);count++;
}
const source=html.slice(html.indexOf('function supplierDocumentItemsTable('),html.indexOf('function bindFinanceSuppliers(){'));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let elements={},modal='',readCalls=0;
const context={escHub:esc,money:n=>'$'+n,db:{supplierDocuments:[]},financeAllowed:()=>true,
 showModal:s=>{modal=s;elements={'supplier-detail-items':{innerHTML:s.match(/<div id="supplier-detail-items">([\s\S]*?)<\/div><p id=/)[1],isConnected:true},'supplier-detail-status':{},'supplier-detail-edit':{},'supplier-detail-close':{}}},$:id=>elements[id],hideModal:()=>{},editSupplierDocument:()=>{},supplierAttachment:async()=>({type:'application/pdf'}),readSupplierPdf:async()=>{readCalls++;return 'text'},supplierFields:()=>({items:[{description:'Detectado',quantity:2,unitPrice:500,total:1000}]})};
vm.createContext(context);vm.runInContext(source,context);
(async()=>{
 const t=context.supplierDocumentItemsTable([{description:'<img onerror=x>',quantity:0,unitPrice:0,total:null}]);
 assert(t.includes('&lt;img'));assert(!t.includes('<img'));assert(t.includes('$0'));assert(t.includes('No indicado'));
 assert.equal(context.supplierDocumentItemsTable([]),'');
 context.db.supplierDocuments=[{supplier:'Proveedor A',name:'A.pdf',amount:123,items:[{description:'Producto A',quantity:1,unitPrice:123,total:123}]},{supplier:'Proveedor B',name:'B.pdf',data:'archivo'}];
 await context.showSupplierDocumentDetail(0);assert(elements['supplier-detail-items'].innerHTML.includes('Producto A'));assert.equal(readCalls,0);
 await context.showSupplierDocumentDetail(1);assert(modal.includes('Proveedor B'));assert(elements['supplier-detail-items'].innerHTML.includes('Detectado'));assert.equal(readCalls,1);assert.equal(context.db.supplierDocuments[1].items,undefined);
 context.supplierAttachment=async()=>{throw Error('Carpeta desconectada')};
 await context.showSupplierDocumentDetail(1);assert(elements['supplier-detail-status'].textContent.includes('Carpeta desconectada'));
 console.log(count+' scripts con sintaxis válida. Detalle por factura, lectura automática, precios cero, valores ausentes, texto seguro y error de adjunto: correctos.');
})().catch(e=>{console.error(e);process.exit(1)});
