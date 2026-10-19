import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/data/courses.ts');
const content = fs.readFileSync(filePath, 'utf8');

const markerStart = '  // 11. Spoken English in Malayalam';
const markerEnd = '];\n\n// =============================================================================';
const markerEndCRLF = '];\r\n\r\n// =============================================================================';

const startIndex = content.indexOf(markerStart);
let endIndex = content.indexOf(markerEnd);
if (endIndex === -1) {
  endIndex = content.indexOf(markerEndCRLF);
}

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found! startIndex:', startIndex, 'endIndex:', endIndex);
  process.exit(1);
}

// Check what is right before markerStart
const before = content.slice(0, startIndex);
// We need to keep before (trimmed of trailing comma for the previous object if needed, but wait: the previous object has `  },\n\n`)
// Let's check what before ends with:
const last100 = before.slice(-100);
console.log('Content before markerStart:\n', last100);

// If the previous object has `  },`, we want to remove the comma and trailing newline:
let newBefore = before;
const commaMatch = before.match(/(\s*\}\s*),\s*$/);
if (commaMatch) {
  newBefore = before.slice(0, before.lastIndexOf(',')) + '\n';
}

const after = content.slice(endIndex);
const newContent = newBefore + after;

fs.writeFileSync(filePath, newContent, 'utf8');
console.log('Successfully updated courses.ts!');
