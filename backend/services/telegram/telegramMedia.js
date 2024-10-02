const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

async function handleMedia(client, message) {
    if (!message.media) {
        console.log('No media found');
        return null;
    }

    let mediaType, mediaId, fileExtension;

    if (message.media.photo) {
        mediaType = 'photo';
        mediaId = message.media.photo.id.toString();
        fileExtension = 'jpg';
    } else if (message.media.document && message.media.document.mimeType.startsWith('video/')) {
        mediaType = 'video';
        mediaId = message.media.document.id.toString();
        fileExtension = 'mp4';
    } else {
        console.log('Unsupported media type or no media to download');
        return null;
    }

    const mediaDir = path.join(__dirname, '..', 'media');
    if (!fs.existsSync(mediaDir)) {
        fs.mkdirSync(mediaDir, { recursive: true });
    }

    const fileHash = crypto.createHash('md5').update(mediaId).digest('hex');
    const fileName = `${fileHash}.${fileExtension}`;
    const filePath = path.join(mediaDir, fileName);

    if (!fs.existsSync(filePath)) {
        console.log(`Downloading ${mediaType}: ${fileName}`);
        await client.downloadMedia(message.media, {
            outputFile: filePath,
        });
        console.log(`${mediaType} downloaded: ${fileName}`);
    } else {
        console.log(`${mediaType} already exists: ${fileName}`);
    }

    // Read the file and convert it to Base64
    const fileBuffer = fs.readFileSync(filePath);
    const base64Data = fileBuffer.toString('base64');

    return {
        type: mediaType,
        data: `data:${mediaType}/${fileExtension};base64,${base64Data}`,
    };
}

module.exports = { handleMedia };