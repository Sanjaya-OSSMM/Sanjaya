const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input');
const fs = require('fs');
const { Api, errors } = require('telegram');
const { handleMedia } = require('./telegramMedia.js');

const apiId = 0000;
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

module.exports = { scrapeTelegram };
