const fs = require('fs');
const path = require('path');

const PRODUCTS_DIR = path.join(__dirname, '../public/products');

// Define the required image structure
const imageStructure = {
  'business-cards': [
    'featured.jpg',
    '13pt-enviro.jpg',
    '14pt-matte.jpg',
    '18pt-writable.jpg'
  ],
  'flyers': [
    'featured.jpg',
    '80lb-silk.jpg',
    '100lb-gloss.jpg'
  ],
  'postcards': [
    'featured.jpg',
    '14pt-uv.jpg'
  ],
  'stickers': [
    'featured.jpg',
    'vinyl.jpg'
  ],
  'posters': [
    'featured.jpg',
    '24x36-canvas.jpg',
    '18x24-photo.jpg'
  ],
  'brochures': [
    'featured.jpg',
    'tri-fold.jpg',
    'bi-fold.jpg'
  ]
};

// Create placeholder SVG
function createPlaceholderSVG(width = 800, height = 600, text = 'Product Image') {
  return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f1f5f9"/>
    <g opacity="0.6">
      <rect x="${width * 0.2}" y="${height * 0.3}" width="${width * 0.6}" height="${height * 0.4}" rx="8" fill="#cbd5e1"/>
      <circle cx="${width * 0.35}" cy="${height * 0.45}" r="${width * 0.08}" fill="#94a3b8"/>
      <polygon points="${width * 0.45},${height * 0.55} ${width * 0.6},${height * 0.4} ${width * 0.75},${height * 0.55} ${width * 0.75},${height * 0.7} ${width * 0.45},${height * 0.7}" fill="#94a3b8"/>
    </g>
    <text x="50%" y="85%" text-anchor="middle" font-family="system-ui" font-size="16" fill="#64748b">
      ${text}
    </text>
  </svg>`;
}

// Ensure directory exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dirPath}`);
  }
}

// Create placeholder image if not exists
function createPlaceholderIfNeeded(filePath, text) {
  if (!fs.existsSync(filePath)) {
    const svgContent = createPlaceholderSVG(800, 600, text);
    // For now, we'll create an SVG file instead of JPG
    const svgPath = filePath.replace('.jpg', '.svg');
    fs.writeFileSync(svgPath, svgContent);
    console.log(`📝 Created placeholder: ${svgPath}`);
    return true;
  }
  return false;
}

function main() {
  console.log('🚀 Setting up product image structure...\n');
  
  ensureDir(PRODUCTS_DIR);
  
  let totalPlaceholders = 0;
  let existingImages = 0;
  
  Object.entries(imageStructure).forEach(([category, images]) => {
    const categoryDir = path.join(PRODUCTS_DIR, category);
    ensureDir(categoryDir);
    
    console.log(`\n📁 Processing ${category}:`);
    
    images.forEach(imageName => {
      const imagePath = path.join(categoryDir, imageName);
      const imageLabel = `${category.replace('-', ' ')} - ${imageName.replace('.jpg', '').replace('-', ' ')}`;
      
      if (fs.existsSync(imagePath)) {
        console.log(`   ✅ ${imageName} (exists)`);
        existingImages++;
      } else {
        if (createPlaceholderIfNeeded(imagePath, imageLabel)) {
          totalPlaceholders++;
        }
      }
    });
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   📸 Existing images: ${existingImages}`);
  console.log(`   📝 Created placeholders: ${totalPlaceholders}`);
  console.log(`   📁 Total categories: ${Object.keys(imageStructure).length}`);
  
  if (totalPlaceholders > 0) {
    console.log(`\n🎯 Next Steps:`);
    console.log(`   1. Replace SVG placeholders with your actual JPG images`);
    console.log(`   2. Keep the exact same filenames`);
    console.log(`   3. Use JPG format for photos, PNG for graphics`);
    console.log(`   4. Recommended size: 800x600px for featured, 600x400px for options`);
    console.log(`   5. Run 'npm run dev' to see your images`);
  }
  
  console.log(`\n✨ Product image structure setup complete!`);
}

if (require.main === module) {
  main();
}

module.exports = { imageStructure, createPlaceholderSVG };
