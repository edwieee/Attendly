import fs from 'fs';
import path from 'path';

const pDir = 'src/pages';
const files = fs.readdirSync(pDir);

files.forEach(f => {
  if (!f.endsWith('.tsx')) return;
  const fp = path.join(pDir, f);
  let text = fs.readFileSync(fp, 'utf8');
  
  // Replace all <button> tags that DO NOT have an onClick with a generic onClick alert
  text = text.replace(/<button(?![^>]*onClick)/g, '<button onClick={() => alert("Action triggered!")}');
  
  fs.writeFileSync(fp, text);
  console.log('Added generic onClicks to buttons in', f);
});

// Also fix Header.tsx
let text = fs.readFileSync('src/components/Header.tsx', 'utf8');
text = text.replace(/<button(?![^>]*onClick)/g, '<button onClick={() => alert("Action triggered!")}');
fs.writeFileSync('src/components/Header.tsx', text);

// Also fix Sidebar.tsx
let sb = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');
sb = sb.replace(/<button(?![^>]*onClick)/g, '<button onClick={() => alert("Action triggered!")}');
fs.writeFileSync('src/components/Sidebar.tsx', sb);
