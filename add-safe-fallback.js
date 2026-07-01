const fs = require('fs');
const path = require('path');

const fallbackSrc = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80';
const onErrorStr = `onError={(e) => { e.currentTarget.src = "${fallbackSrc}"; e.currentTarget.onerror = null; }}`;

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Split the content by "<img"
      const parts = content.split('<img');
      if (parts.length > 1) {
        for (let i = 1; i < parts.length; i++) {
          // Find the end of the img tag. Could be '>' or '/>'
          const endIdx = parts[i].indexOf('>');
          if (endIdx !== -1) {
            const tagContent = parts[i].substring(0, endIdx);
            if (!tagContent.includes('onError=')) {
              // Insert onError at the end of the tag (before the closing > or />)
              let beforeClose = tagContent;
              let suffix = parts[i].substring(endIdx); // starts with '>'
              
              if (beforeClose.trim().endsWith('/')) {
                // it's '/>'
                beforeClose = beforeClose.substring(0, beforeClose.lastIndexOf('/'));
                parts[i] = beforeClose + ' ' + onErrorStr + ' /' + suffix;
              } else {
                // it's '>'
                parts[i] = beforeClose + ' ' + onErrorStr + suffix;
              }
            }
          }
        }
        const newContent = parts.join('<img');
        if (content !== newContent) {
          fs.writeFileSync(fullPath, newContent, 'utf8');
          console.log(`Updated ${fullPath}`);
        }
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src', 'components'));
console.log("Done adding safe fallbacks to images.");
