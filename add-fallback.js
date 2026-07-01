const fs = require('fs');
const path = require('path');

const fallbackSrc = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80';
const onErrorAttr = `onError={(e) => { e.currentTarget.src = "${fallbackSrc}"; e.currentTarget.onerror = null; }}`;

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Look for <img ... > and if it doesn't have onError, add it.
      // Be careful not to replace it if it already has onError
      const imgRegex = /<img\s([^>]+)>/g;
      const newContent = content.replace(imgRegex, (match, attrs) => {
        if (attrs.includes('onError=')) {
          return match;
        }
        // Insert onError before the closing >
        return `<img ${attrs} ${onErrorAttr}>`;
      });
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src', 'components'));
console.log("Done adding fallbacks to images.");
