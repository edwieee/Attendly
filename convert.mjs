import fs from 'fs';
import path from 'path';

const htmlDir = 'src/screens_html';
const pagesDir = 'src/pages';
if (!fs.existsSync(pagesDir)) fs.mkdirSync(pagesDir, { recursive: true });

const files = fs.readdirSync(htmlDir);

function htmlToJsx(html) {
  let jsx = html;
  
  // Replace class= with className=
  jsx = jsx.replace(/class=/g, 'className=');
  // Replace for= with htmlFor=
  jsx = jsx.replace(/for=/g, 'htmlFor=');
  
  // Replace inline styles
  jsx = jsx.replace(/style="([^"]+)"/g, (match, styleString) => {
    const styles = {};
    styleString.split(/;\s*/).forEach(rule => {
      if (!rule.trim()) return;
      const [key, value] = rule.split(/:\s*/);
      if (!key || !value) return;
      const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
      styles[camelKey] = value.replace(/'/g, '"');
    });
    return `style={${JSON.stringify(styles).replace(/"([^"]+)":/g, '$1:')}}`;
  });

  // Ensure self-closing tags: hr, br, img, input
  jsx = jsx.replace(/<(img|hr|br|input)([^>]*?)(?<!\/)>/g, '<$1$2 />');

  // Strip html boilerplate and get main contents
  const bodyMatch = jsx.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) jsx = bodyMatch[1];
  
  // Also remove script tags
  jsx = jsx.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  return jsx.trim();
}

files.forEach(file => {
  if (!file.endsWith('.html')) return;
  const content = fs.readFileSync(path.join(htmlDir, file), 'utf8');
  let jsx = htmlToJsx(content);
  
  const compName = file.replace('.html', '').split('_').filter(Boolean).map(s => s[0].toUpperCase() + s.slice(1)).join('');
  
  const componentContent = `import React from 'react';
import { motion } from 'framer-motion';

export default function ${compName}() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full"
    >
      ${jsx}
    </motion.div>
  );
}`;

  fs.writeFileSync(path.join(pagesDir, `${compName}.tsx`), componentContent);
  console.log(`Created ${compName}.tsx`);
});
