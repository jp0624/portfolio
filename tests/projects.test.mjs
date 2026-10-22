import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {filterProjects,hasLiveSnapshot} from '../src/project-utils.mjs';
const projects=JSON.parse(fs.readFileSync(new URL('../src/projects.json',import.meta.url)));
test('catalogue has unique IDs, evidence-based details and local snapshots',()=>{assert.equal(new Set(projects.map(p=>p.id)).size,projects.length);for(const p of projects){assert.ok(p.description.length>50);assert.ok(p.skills.length);assert.ok(p.languages.length);assert.ok(fs.existsSync(new URL('../public/'+p.image,import.meta.url)));if(p.repo)assert.ok(p.repo.startsWith('https://github.com/jp0624/'))}});
test('search combines words and skills without case sensitivity',()=>{const result=filterProjects(projects,{query:'REACT firebase'});assert.ok(result.some(p=>p.id==='realestate'));assert.ok(result.every(p=>p.skills.includes('Firebase')))});
test('category and language combine; no results handled',()=>{const result=filterProjects(projects,{category:'Product apps',language:'TypeScript'});assert.ok(result.length>0);assert.ok(result.every(p=>p.category==='Product apps'&&p.languages.includes('TypeScript')));assert.equal(filterProjects(projects,{query:'zzzz-not-present'}).length,0)});
test('sort leaves original catalogue unchanged',()=>{const ids=projects.map(p=>p.id);const result=filterProjects(projects,{sort:'A–Z'});assert.deepEqual(projects.map(p=>p.id),ids);assert.deepEqual(result.map(p=>p.title),result.map(p=>p.title).sort((a,b)=>a.localeCompare(b)))});


test('showcases require a live link and a real screenshot',()=>{
 assert.equal(hasLiveSnapshot({live:'https://example.com',image:'shot.jpg',imageNote:'Live website snapshot'}),true);
 assert.equal(hasLiveSnapshot({live:'',image:'shot.jpg',imageNote:'Live website snapshot'}),false);
 assert.equal(hasLiveSnapshot({live:'https://example.com',image:'cover.svg',imageNote:'Technical project cover'}),false);
 assert.equal(hasLiveSnapshot({live:'https://example.com',image:'',imageNote:'Live website snapshot'}),false);
 assert.equal(projects.filter(hasLiveSnapshot).length,19);
});

test("explicit compact placement overrides a live screenshot",()=>{for(const id of ["lessonfactory","dbd"])assert.equal(hasLiveSnapshot(projects.find(p=>p.id===id)),false)});
