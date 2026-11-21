import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const main=fs.readFileSync(path.join(root,'public/index.html'),'utf8');
let checked=0;
for(const file of ['public/index.html','public/TattooLab-Ficha.html']){
  const html=fs.readFileSync(path.join(root,file),'utf8');
  for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){
    if(/text\/plain/.test(match[1]))continue;
    new vm.Script(match[2],{filename:file+':inline-script-'+checked});checked++;
  }
}
assert.equal(fs.readFileSync(path.join(root,'SOURCE_CODE.txt'),'utf8'),main,'SOURCE_CODE.txt must match public/index.html');
const config=JSON.parse(fs.readFileSync(path.join(root,'vercel.json'),'utf8'));
assert.equal(config.outputDirectory,'public');assert.equal(config.framework,null);
for(const feature of ['financeStatementsView','financeReadFile','financeFindFileDuplicate','financeConfirmDeleteStatement','showSupplierDocumentDetail','IPAD_CLIENT_PAGE'])assert(main.includes(feature),feature+' missing');
assert(main.includes('<th>Archivo y cuenta</th><th>Período de movimientos</th>'));
assert(!main.includes('data-statement-attach='),'Removed attach-original button unexpectedly returned');
assert(!main.includes('const CAPTURE_CLIENT_BATCH='),'Historical client imports must not be deployed');
assert(/const financeWorkbook\s*=\s*\[\]/.test(main),'Historical finance seeds must be empty');
for(const marker of ['couso.ismael@gmail.com','21.255.752-8','15.278.085-0'])assert(!main.toLowerCase().includes(marker.toLowerCase()),'Historical identity found');
for(const pattern of [/sk-[A-Za-z0-9]{20,}/,/gh[pousr]_[A-Za-z0-9]{20,}/,/AKIA[0-9A-Z]{16}/,/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/])assert(!pattern.test(main),'Credential-like string found');
console.log(`${checked} inline scripts parsed; static config, source text, required features and export checks passed. These checks do not certify browser end-to-end behavior or production security.`);
