const sharp = require('sharp');

async function makeRound(inputPath, outputPath, size) {
    const roundedCorners = Buffer.from(
        `<svg width="${size}" height="${size}">
         <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white" />
       </svg>`
    );

    await sharp(inputPath)
        .resize(size, size, { fit: 'cover' })
        .composite([{
            input: roundedCorners,
            blend: 'dest-in'
        }])
        .png()
        .toFile(outputPath);
}

async function main() {
    try {
        await makeRound('public/logo.png', 'src/app/icon.png', 1024);
        await makeRound('public/logo.png', 'public/icon-192x192.png', 192);
        await makeRound('public/logo.png', 'public/icon-512x512.png', 512);
        console.log("Successfully created round icons!");
    } catch (e) {
        console.error(e);
    }
}
main();
