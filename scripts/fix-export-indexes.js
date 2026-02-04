const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'out');

function walk(dir, filelist = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      walk(filepath, filelist);
    } else {
      filelist.push(filepath);
    }
  });
  return filelist;
}

function ensureIndexCopies() {
  if (!fs.existsSync(outDir)) {
    console.error('out/ directory not found — run the export first');
    process.exit(1);
  }

  const files = walk(outDir);
  files.forEach((f) => {
    if (f.endsWith('.html')) {
      const rel = path.relative(outDir, f);
      if (path.basename(rel).toLowerCase() === 'index.html') return;
      // skip root index.html
      if (rel === 'index.html') return;

      const withoutExt = rel.slice(0, -'.html'.length);
      const targetDir = path.join(outDir, withoutExt);
      const targetIndex = path.join(targetDir, 'index.html');

      try {
        fs.mkdirSync(targetDir, { recursive: true });
        fs.copyFileSync(f, targetIndex);
      } catch (err) {
        console.error('Failed to create index copy for', f, err);
      }
    }
  });
}

ensureIndexCopies();
