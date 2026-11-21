const fs=require('fs'),vm=require('vm'),assert=require('assert'),{webcrypto}=require('crypto');
const path=require('node:path').join(__dirname,'..','public','index.html');
const html=fs.readFileSync(path,'utf8');
const source=html.slice(html.indexOf('let financeStatements=[]'),html.indexOf('function financeStage(rows,source){'));
let records=new Map(),ledger=[],quota=false,ledgerFailure=false,reads=0,parseFailure=false;
const newFile=(content,name='cartola.csv')=>{const f=new Blob([content],{type:'text/csv'});f.name=name;return f};
const bankRows=[{id:'one',account:'A',date:'2026-02-02',description:'Pago proveedor',amount:-100,source:'Cartola',category:'Sin Clasificar'},{id:'two',account:'A',date:'2026-02-01',description:'Abono cliente',amount:200,source:'Cartola',category:'Sin Clasificar'}];
const context={crypto:webcrypto,console,Date,Map,Set,Promise,Number,String,JSON,Blob,setTimeout,clearTimeout,
 financeAllowed:()=>true,financeLedger:()=>ledger,financePreview:[],financeTab:'statement',financeMessage:'',copyData:x=>JSON.parse(JSON.stringify(x)),
 escHub:x=>String(x??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),
 financeOptions:()=>'',financeTable:()=>'',showFinance:()=>{},toast:()=>{},$:()=>({textContent:''}),
 financeSave:rows=>{if(ledgerFailure)return false;ledger=rows;return true},
 financeReadFile:async()=>{reads++;if(parseFailure)throw Error('Lectura falló');return structuredClone(bankRows)},
 financeStage:rows=>context.financePreview=rows};
vm.createContext(context);vm.runInContext(source,context);
context.financeStatementStore=async(mode,operation)=>{
 if(mode==='readwrite'&&quota)throw Error('Sin espacio');
 return operation({put:record=>{records.set(record.id,structuredClone(record));return record.id},getAll:()=>[...records.values()].map(x=>structuredClone(x)),delete:id=>records.delete(id)});
};
const js=s=>vm.runInContext(s,context);
async function reset(items=[],rows=[]){records=new Map(items.map(x=>[x.id,structuredClone(x)]));ledger=structuredClone(rows);quota=false;ledgerFailure=false;parseFailure=false;reads=0;context.financePreview=[];js("financeStatements=[];financeStatementsReady=false;financeStatementId='';financeStatementBusy=false");await context.financeInitStatements()}
(async()=>{
 await reset();
 const first=newFile('original exacto');
 await context.financeLoadStatement(first,'A');assert.equal(reads,1);assert.equal(context.financeStatementEntries().length,1);
 const id=context.financeStatementEntries()[0].id;
 assert.equal(await records.get(id).file.text(),'original exacto');
 await context.financeLoadStatement(newFile('original exacto','otro-nombre.xlsx'),'A');
 assert.equal(reads,1);assert.equal(context.financeStatementEntries().length,1);assert(context.financeMessage.includes('ya está guardada'));
 await context.financeLoadStatement(newFile('otra exportacion','otra.csv'),'A');
 assert.equal(reads,2);assert.equal(context.financeStatementEntries().length,1);assert.equal(records.size,1);assert(context.financeMessage.includes('No se guardó otra copia'));
 // The exact same binary also cannot be wrongly loaded as another account.
 await context.financeLoadStatement(newFile('original exacto'),'B');assert.equal(context.financeStatementEntries().length,1);assert.equal(reads,2);
 // Failed reads still keep originals; an exact retry is blocked and offered through the existing record.
 parseFailure=true;await context.financeLoadStatement(newFile('ilegible'),'A');
 const error=context.financeStatementEntries().find(x=>x.state==='error');assert(error);assert.equal(await error.file.text(),'ilegible');
 const before=reads;await context.financeLoadStatement(newFile('ilegible','renombrado.pdf'),'A');assert.equal(reads,before);
 // A legacy duplicate archive may share all its movements: deleting it must preserve both the other original and the ledger.
 const archived={id:'a',name:'a.pdf',account:'A',file:newFile('pdf-a'),rows:structuredClone(bankRows),state:'imported'};
 const duplicate={...archived,id:'b',name:'copia.pdf',file:newFile('pdf-b')};
 await reset([archived,duplicate],bankRows);
 assert.equal(context.financeStatementRemovalIds(archived).length,0);
 await context.financeDeleteStatement('b',true);
 assert.equal(ledger.length,2);assert.equal(context.financeStatementEntries().length,1);assert(records.get('b').deleted);assert(!records.get('b').file);
 // Removing the last history entry only must not recreate it as a legacy month on reload.
 await context.financeDeleteStatement('a',false);assert.equal(ledger.length,2);assert.equal(context.financeStatementEntries().length,0);
 js('financeStatementsReady=false');await context.financeInitStatements();assert.equal(context.financeStatementEntries().length,0);
 // Deletion can also remove exclusive movements and clear dangling reconciliation links.
 await reset([archived],[...bankRows,{id:'manual',source:'Manual',amount:100,status:'Conciliado',match:'one'}]);
 await context.financeDeleteStatement('a',true);assert.equal(ledger.length,1);assert.equal(ledger[0].id,'manual');assert(!ledger[0].match);assert.equal(ledger[0].status,'Pendiente de revisión');
 // Failures leave original and ledger available.
 await reset([archived],bankRows);quota=true;await assert.rejects(()=>context.financeDeleteStatement('a',true));assert(records.get('a').file);assert.equal(ledger.length,2);
 quota=false;ledgerFailure=true;await assert.rejects(()=>context.financeDeleteStatement('a',true),/sig(u|ue)/);assert(records.get('a').file);assert.equal(context.financeStatementEntries().length,1);assert.equal(ledger.length,2);
 // Crash recovery completes an already confirmed deletion once, preserving unrelated records.
 ledgerFailure=false;await reset([{id:'a',deleted:true,rows:bankRows.map(row=>({id:row.id})),pendingRemovalIds:['one','two']}],[...bankRows,{id:'keep',source:'Manual'}]);
 assert.equal(ledger.length,1);assert.equal(ledger[0].id,'keep');assert(!records.get('a').pendingRemovalIds);
 await context.financeRecoverStatementDeletions();assert.equal(ledger.length,1);
 const signature=context.financeStatementSignature(bankRows,'A');assert.equal(signature,context.financeStatementSignature([...bankRows].reverse(),'A'));assert.notEqual(signature,context.financeStatementSignature(bankRows,'B'));
 console.log('Correcto: duplicados por contenido y movimientos, renombrados, cuentas, originales fallidos, eliminación de duplicados sin perder movimientos, eliminación exclusiva, recarga sin reaparición, errores de guardado y recuperación tras interrupción.');
})().catch(error=>{console.error(error);process.exit(1)});
