import{cp,mkdir,readFile,rm,stat}from'node:fs/promises';import{resolve}from'node:path';
const root=resolve(import.meta.dirname,'..'),output=resolve(root,'dist');
const files=['index.html','styles.css','script.js','robots.txt','sitemap.xml'];
await rm(output,{recursive:true,force:true});await mkdir(output,{recursive:true});
for(const file of files){await stat(resolve(root,file));await cp(resolve(root,file),resolve(output,file))}
await cp(resolve(root,'assets'),resolve(output,'assets'),{recursive:true});
const html=await readFile(resolve(root,'index.html'),'utf8');
const refs=[...html.matchAll(/(?:href|src)="(?!https?:|#)([^"?]+)"/g)].map(match=>match[1]);
for(const file of new Set(refs))await stat(resolve(root,file));
console.log(`Build concluída: ${files.length+1} entradas copiadas para dist/.`);
