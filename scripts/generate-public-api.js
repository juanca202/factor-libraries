const fs = require('fs');
const path = require('path');

const LIB_PATH = './projects/utils/src/lib';
const PUBLIC_API_PATH = './projects/utils/src/public-api.ts';

const filesToExport = [];

function processDirectory(directory) {
  const items = fs.readdirSync(directory);
  items.forEach(item => {
    const fullPath = path.join(directory, item);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (item.endsWith('.ts') && !item.endsWith('.spec.ts')) {
      const relativePath = fullPath.replace(LIB_PATH, '.').replace(/\\/g, '/').replace('.ts', '');
      filesToExport.push(`export * from '${relativePath}';`);
    }
  });
}

processDirectory(LIB_PATH);

fs.writeFileSync(PUBLIC_API_PATH, filesToExport.join('\n'));
console.log('public-api.ts generado con éxito.');
