
const fs = require(" fs\);
const path = require(\path\);

function write(relPath, content) {
 const full = path.join(\D:/CreatorHub\, relPath);
 const dir = path.dirname(full);
 if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
 fs.writeFileSync(full, content, \utf8\);
 console.log(\Wrote: \ + relPath);
}

module.exports = { write };
