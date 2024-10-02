const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input');
const fs = require('fs');
const path = require('path');
const { Api, errors } = require('telegram');
const crypto = require('crypto');

const apiId = 000;
const apiHash = '';

let savedSession = '';
if (fs.existsSync('session.txt')) {
    savedSession = fs.readFileSync('session.txt', 'utf8');
}

const stringSession = new StringSession(savedSession);

async function scrapeTelegram(keyword, postLimit = 100, includeMedia = false) {
    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    });

    try {
        await client.start({
            phoneNumber: async () => await input.text('Enter your phone number: '),
            password: async () => await input.text('Enter your password: '),
            phoneCode: async () => await input.text('Enter the code you received: '),
            onError: (err) => console.error('Login error:', err),
        });

        console.log('You are logged in!');
        fs.writeFileSync('session.txt', client.session.save(), 'utf8');
    } catch (err) {
        console.error('Login failed:', err);
        return [];
    }

    let messages = [];
    const dialogs = await client.getDialogs({ limit: 8 });

    for (const dialog of dialogs) {
        try {
            console.log(`Searching in dialog: ${dialog.name || dialog.title}`);
            const remainingLimit = postLimit - messages.length;
            const searchResult = await client.invoke(
                new Api.messages.Search({
                    peer: dialog.inputEntity,
                    q: keyword,
                    filter: includeMedia ? new Api.InputMessagesFilterPhotoVideo() : new Api.InputMessagesFilterEmpty(),
                    limit: remainingLimit,
                })
            );

            console.log(`Found ${searchResult.messages.length} messages in this dialog`);

            const dialogName = dialog.entity.username ? `@${dialog.entity.username}` : dialog.name || dialog.title;

            for (const message of searchResult.messages) {
                if (message.message && message.fromId && message.fromId.userId) {
                    let mediaInfo = null;

                    if (includeMedia && message.media) {
                        try {
                            mediaInfo = await handleMedia(client, message);
                            if (mediaInfo) {
                                console.log(`Media processed: ${mediaInfo.type} - ${mediaInfo.data}`);
                            }
                        } catch (mediaError) {
                            console.error('Error processing media:', mediaError);
                        }
                    }

                    messages.push({
                        group_name: dialogName,
                        author: message.fromId.userId ? message.fromId.userId.toString() : 'Unknown',
                        text: message.message,
                        media: mediaInfo,
                        timestamp: new Date(message.date * 1000).getTime(),
                    });

                    if (messages.length >= postLimit) {
                        break;
                    }
                }
            }

            if (messages.length >= postLimit) {
                break;
            }
        } catch (e) {
            if (e instanceof errors.FloodWaitError) {
                console.log(`Sleeping for ${e.seconds} seconds due to rate limit.`);
                await new Promise(resolve => setTimeout(resolve, e.seconds * 1000));
            } else {
                console.error(`Error searching in ${dialog.name || dialog.title}:`, e);
            }
        }
    }

    await client.disconnect();
    console.log(`Total messages scraped: ${messages.length}`);
    return messages;
}

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

module.exports = { scrapeTelegram };
