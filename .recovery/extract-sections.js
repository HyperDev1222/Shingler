const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const transcript =
  'C:/Users/Luke Bauer/.cursor/projects/d-Dev-TEST-Shingler/agent-transcripts/ffe40e3f-6946-4ead-807b-9b708a8be0c5/ffe40e3f-6946-4ead-807b-9b708a8be0c5.jsonl';
const outDir = path.join(__dirname, 'extracted');
const sectionFiles = [
  'sections/header.liquid',
  'sections/footer.liquid',
  'sections/announcement-bar.liquid',
  'sections/header-group.json',
  'sections/footer-group.json',
];

const state = {};
for (const rel of sectionFiles) {
  try {
    state[rel] = execSync(`git show HEAD:${rel}`, { encoding: 'utf8', cwd: root });
  } catch {
    state[rel] = '';
  }
}

const lines = fs.readFileSync(transcript, 'utf8').split('\n');

function normalizePath(p) {
  return p.replace(/\\/g, '/').replace(/^.*\/Shingler\//i, '');
}

for (const line of lines) {
  if (!line.trim()) continue;
  let obj;
  try {
    obj = JSON.parse(line);
  } catch {
    continue;
  }
  const content = obj.message?.content;
  if (!Array.isArray(content)) continue;

  for (const part of content) {
    if (part.type !== 'tool_use') continue;
    const inp = part.input || {};
    const rel = normalizePath(inp.path || '');
    if (!sectionFiles.includes(rel)) continue;

    if (part.name === 'Write') {
      state[rel] = inp.contents;
    } else if (part.name === 'StrReplace' && state[rel] && inp.old_string) {
      if (state[rel].includes(inp.old_string)) {
        state[rel] = state[rel].replace(inp.old_string, inp.new_string);
      } else {
        console.warn('StrReplace miss:', rel, 'line snippet:', inp.old_string.slice(0, 60));
      }
    }
  }
}

fs.mkdirSync(outDir, { recursive: true });
for (const rel of sectionFiles) {
  if (state[rel]) {
    const out = path.join(outDir, path.basename(rel));
    fs.writeFileSync(out, state[rel], 'utf8');
    console.log('Wrote', rel, 'len', state[rel].length);
  }
}
