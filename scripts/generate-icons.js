const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputImage = path.join(__dirname, '..', 'public', 'favicon.png');
const outputDir = path.join(__dirname, '..', 'public', 'icons');

// Tamaños estándar necesarios
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Tamaños para versiones maskable (con padding del 20%)
const maskableSizes = [192, 512];

async function generateIcons() {
  // Crear el directorio de iconos si no existe
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Generando iconos desde:', inputImage);
  console.log('Directorio de salida:', outputDir);

  try {
    // Generar iconos estándar
    for (const size of sizes) {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
      await sharp(inputImage)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      console.log(`✓ Generado: icon-${size}x${size}.png`);
    }

    // Generar iconos maskable (con padding del 20%)
    for (const size of maskableSizes) {
      const outputPath = path.join(outputDir, `icon-${size}x${size}-maskable.png`);
      const iconSize = Math.round(size * 0.8); // 80% del tamaño final
      const padding = Math.round((size - iconSize) / 2); // Padding centrado

      await sharp(inputImage)
        .resize(iconSize, iconSize, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .extend({
          top: padding,
          bottom: padding,
          left: padding,
          right: padding,
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      console.log(`✓ Generado: icon-${size}x${size}-maskable.png`);
    }

    console.log('\n✅ Todos los iconos generados exitosamente!');
  } catch (error) {
    console.error('❌ Error generando iconos:', error);
    process.exit(1);
  }
}

generateIcons();
