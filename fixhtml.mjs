import fs from 'fs';
import path from 'path';

const pDir = 'src/pages';
const files = fs.readdirSync(pDir);

files.forEach(f => {
  if (!f.endsWith('.tsx')) return;
  const fp = path.join(pDir, f);
  let text = fs.readFileSync(fp, 'utf8');
  
  // Remove HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, '');
  
  // Fix required="" inline
  text = text.replace(/required=""/g, 'required');
  
  // Also inline styles might have boolean errors or similar if they were missing quotes etc
  // We already handled style="..." converting to style={{}}

  // Check for any unescaped attributes or random HTML issues:
  text = text.replace(/onsubmit="return false;"/g, 'onSubmit={(e)=>e.preventDefault()}');

  fs.writeFileSync(fp, text);
  console.log('Cleaned', f);
});
