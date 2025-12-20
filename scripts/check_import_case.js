const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'frontend');
const exts = ['.jsx', '.js', '.ts', '.tsx', '.json', '.css', '.svg', '.png'];
const importRegex = /(?:import\s+[\s\S]*?from\s+|require\()\s*["'](\.\.\/|\.\/)[^"']+["']\)?/g;
const fromRegex = /(?:from\s+|require\()\s*["']([^"']+)["']\)?/;

function walk(dir){
  const files = [];
  for(const f of fs.readdirSync(dir)){
    const full = path.join(dir,f);
    const stat = fs.statSync(full);
    if(stat.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

function listDirExact(dir){
  try{ return fs.readdirSync(dir); }catch(e){ return []; }
}

const allFiles = walk(root);
const sourceFiles = allFiles.filter(p => /\.(jsx|js|ts|tsx|mjs|cjs)$/.test(p));

const mismatches = [];

for(const file of sourceFiles){
  const content = fs.readFileSync(file,'utf8');
  const matches = content.match(importRegex);
  if(!matches) continue;
  for(const m of matches){
    const g = m.match(fromRegex);
    if(!g) continue;
    const spec = g[1];
    if(!spec.startsWith('./') && !spec.startsWith('../')) continue;
    const absBase = path.resolve(path.dirname(file), spec);
    // Try candidate resolutions
    let foundExact = false;
    let foundInsensitive = false;
    let matchedActual = null;

    // If path already has an extension
    const hasExt = !!exts.find(e => absBase.toLowerCase().endsWith(e));
    const candidates = [];
    if(hasExt){
      candidates.push(absBase);
      candidates.push(absBase + '/index');
    } else {
      for(const e of exts) candidates.push(absBase + e);
      candidates.push(absBase + '/index.jsx');
      candidates.push(absBase + '/index.js');
    }

    for(const cand of candidates){
      const parent = path.dirname(cand);
      const base = path.basename(cand);
      const listing = listDirExact(parent);
      if(listing.length===0) continue;
      // exact
      if(listing.includes(base)){
        foundExact = true;
        matchedActual = path.join(parent, listing.find(x=>x===base));
        break;
      }
      // case-insensitive
      const li = listing.find(x => x.toLowerCase() === base.toLowerCase());
      if(li){
        foundInsensitive = true;
        matchedActual = path.join(parent, li);
        break;
      }
    }

    if(!foundExact && foundInsensitive){
      mismatches.push({fromFile: path.relative(root, file), importSpec: spec, resolvedTo: path.relative(root, matchedActual)});
    }
  }
}

if(mismatches.length===0){
  console.log('No case mismatches found');
  process.exit(0);
}

console.log('Case mismatches found:');
for(const m of mismatches){
  console.log(`- ${m.fromFile}: import "${m.importSpec}" -> actual file "${m.resolvedTo}"`);
}
process.exit(0);
