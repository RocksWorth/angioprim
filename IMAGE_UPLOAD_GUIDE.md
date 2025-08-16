# 📸 VersatilePrint - Image Upload Guide

## 🎯 Required Product Images

### 📁 Directory Structure
```
public/products/
├── business-cards/
│   ├── featured.jpg        (Main product showcase - 800x600px)
│   ├── 13pt-enviro.jpg     (Environment-friendly option - 600x400px)
│   ├── 14pt-matte.jpg      (Matte finish option - 600x400px)
│   └── 18pt-writable.jpg   (Writable surface option - 600x400px)
├── flyers/
│   ├── featured.jpg        (Main flyer showcase - 800x600px)
│   ├── 80lb-silk.jpg       (Silk paper option - 600x400px)
│   └── 100lb-gloss.jpg     (Gloss paper option - 600x400px)
├── postcards/
│   ├── featured.jpg        (Main postcard showcase - 800x600px)
│   └── 14pt-uv.jpg         (UV coating option - 600x400px)
├── stickers/
│   ├── featured.jpg        (Main sticker showcase - 800x600px)
│   └── vinyl.jpg           (Vinyl sticker option - 600x400px)
├── posters/
│   ├── featured.jpg        (Main poster showcase - 800x600px)
│   ├── 24x36-canvas.jpg    (Canvas poster option - 600x400px)
│   └── 18x24-photo.jpg     (Photo paper option - 600x400px)
└── brochures/
    ├── featured.jpg        (Main brochure showcase - 800x600px)
    ├── tri-fold.jpg        (Tri-fold option - 600x400px)
    └── bi-fold.jpg         (Bi-fold option - 600x400px)
```

## 📐 Image Specifications

### ✅ Required Formats
- **Format**: JPG or PNG (JPG preferred for photos)
- **Quality**: High resolution, 72-300 DPI
- **Color Space**: sRGB
- **Max File Size**: 2MB per image

### 📏 Recommended Dimensions
- **Featured Images**: 800x600px (4:3 aspect ratio)
- **Option Images**: 600x400px (3:2 aspect ratio)
- **Minimum**: 400x300px
- **Maximum**: 1920x1440px

## 🎨 Image Content Guidelines

### 📋 What to Include
- **High-quality product photos** showing texture and finish
- **Professional lighting** with good contrast
- **Clean backgrounds** (white or neutral preferred)
- **Multiple angles** when possible
- **Real printing samples** rather than mockups

### ❌ Avoid
- Blurry or pixelated images
- Poor lighting or shadows
- Copyrighted content
- Low-resolution images
- Images with watermarks

## 🚀 How to Upload Images

### Method 1: Direct File Replacement
1. Navigate to `public/products/[product-category]/`
2. Replace existing files with your images
3. **Keep the exact same filename** (e.g., `featured.jpg`)
4. Refresh your browser to see changes

### Method 2: Drag & Drop (Recommended)
1. Open the `public/products/` folder in Finder/Explorer
2. Drag your properly named images into the correct subfolder
3. Confirm the files are in the right location
4. Restart the development server: `npm run dev`

## 🔧 Image Optimization Tips

### 📊 Compression
- Use tools like **TinyPNG** or **ImageOptim** before uploading
- Target file sizes under 500KB for featured images
- Target file sizes under 300KB for option images

### 🎯 SEO-Friendly Names
- Use descriptive filenames: `business-cards-premium-matte.jpg`
- Avoid spaces: use hyphens instead
- Include relevant keywords

## 🔍 Testing Your Images

After uploading, test your images by:
1. Running `npm run dev`
2. Visiting each product page
3. Checking that images load properly
4. Verifying mobile responsiveness

## 🚨 Troubleshooting

### Images Not Loading?
- Check filename spelling and case sensitivity
- Ensure images are in the correct folder
- Verify file format (JPG/PNG only)
- Restart the development server
- Clear browser cache

### Images Loading Slowly?
- Compress images using online tools
- Reduce image dimensions if too large
- Convert PNG to JPG for photographs

## 📱 Example Upload Process

1. **Prepare your business card images**:
   - Main showcase photo → rename to `featured.jpg`
   - Environment option → rename to `13pt-enviro.jpg`
   - Matte finish option → rename to `14pt-matte.jpg`
   - Writable option → rename to `18pt-writable.jpg`

2. **Upload to correct location**:
   ```
   public/products/business-cards/
   ├── featured.jpg ← Your main image here
   ├── 13pt-enviro.jpg ← Your environment image here
   ├── 14pt-matte.jpg ← Your matte image here
   └── 18pt-writable.jpg ← Your writable image here
   ```

3. **Test the results**:
   - Visit `http://localhost:3000/shop/business-cards`
   - Verify all images display correctly

## 🎉 Need Help?

If you encounter issues:
- Check the terminal for error messages
- Ensure file permissions allow reading
- Verify the development server is running
- Contact support if images still don't appear

---
*Remember: High-quality images significantly improve customer trust and conversion rates!*
