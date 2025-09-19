// generate-gallery-json.js
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'images');
const outputFile = path.join(__dirname, 'gallery.json');

function isImage(file) {
  return /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(file);
}
function titleCase(name) {
  return name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

const galleries = [];
const standalone = [];

if (!fs.existsSync(imagesDir)) {
  console.error('No images/ folder found.');
  process.exit(1);
}

const items = fs.readdirSync(imagesDir, { withFileTypes: true });
for (const item of items) {
  if (item.isDirectory()) {
    const dirPath = path.join(imagesDir, item.name);
    const files = fs.readdirSync(dirPath).filter(isImage);
    if (files.length > 0) {
      galleries.push({
        key: item.name,
        title: titleCase(item.name),
        photos: files.map(f => `images/${item.name}/${f}`)
      });
    }
  } else if (item.isFile() && isImage(item.name)) {
    standalone.push({
      src: `images/${item.name}`,
      caption: titleCase(path.parse(item.name).name)
    });
  }
}

const manifest = { galleries, standalone };
fs.writeFileSync(outputFile, JSON.stringify(manifest, null, 2));
console.log('gallery.json generated with', galleries.length, 'galleries and', standalone.length, 'standalone photos.');
