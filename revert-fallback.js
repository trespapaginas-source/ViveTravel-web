const fs = require('fs');
const path = require('path');

const fallbackSrc = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80';
const badOnError = 'onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80"; e.currentTarget.onerror = null; }}';

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // 1. Revert the bad onClick={() = onError={...}> openLightbox(0)}
      content = content.replace(/=\s*onError=\{\(e\)\s*=>\s*\{\s*e\.currentTarget\.src\s*=\s*"[^"]+";\s*e\.currentTarget\.onerror\s*=\s*null;\s*\}\}>/g, '=>');
      
      // 2. Remove any other bad insertions (e.g. just `onError={...}`)
      content = content.split(badOnError).join('');
      
      // Clean up multiple spaces
      content = content.replace(/\s+\/>/g, ' />');

      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDirectory(path.join(__dirname, 'src', 'components'));
console.log("Reverted bad fallbacks");
