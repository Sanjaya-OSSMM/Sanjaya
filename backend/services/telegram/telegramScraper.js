const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input');
const fs = require('fs');
const { Api, errors } = require('telegram');
const { handleMedia } = require('./telegramMedia.js');
const { createTelegramFilter, parseKeywordWithOperators, applyCustomFilters } = require('./telegramFilters');

const apiId = 0000;
const apiHash = '';

let savedSession = '';
if (fs.existsSync('session.txt')) {
    savedSession = fs.readFileSync('session.txt', 'utf8');
}

const stringSession = new StringSession(savedSession);

async function scrapeTelegram(keyword, postLimit = 100, includeMedia = false, filterOptions = {}) {
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
    const dialogs = await client.getDialogs({ limit: 50 });

    for (const dialog of dialogs) {
        try {
            const entity = await client.getEntity(dialog.entity);
            const dialogName = entity.title || entity.firstName || '';
            const dialogUsername = entity.username || '';
            
            // Apply group name and username filters
            if (filterOptions.groupUsername && dialogUsername.toLowerCase() !== filterOptions.groupUsername.toLowerCase().replace('@', '')) {
                console.log(`Skipping dialog: @${dialogUsername} (doesn't match group username filter)`);
                continue;
            }

            if (filterOptions.groupName && !dialogName.toLowerCase().includes(filterOptions.groupName.toLowerCase())) {
                console.log(`Skipping dialog: ${dialogName} (doesn't match group name filter)`);
                continue;
            }

            console.log(`Searching in dialog: ${dialogName} (@${dialogUsername})`);
            const remainingLimit = postLimit - messages.length;
            const filter = createTelegramFilter(filterOptions);
            const parsedKeyword = parseKeywordWithOperators(keyword, filterOptions.operators);

            const searchResult = await client.invoke(
                new Api.messages.Search({
                    peer: dialog.inputEntity,
                    q: parsedKeyword,
                    filter: includeMedia ? new Api.InputMessagesFilterPhotoVideo() : filter,
                    limit: remainingLimit,
                })
            );

            console.log(`Found ${searchResult.messages.length} messages in this dialog`);

            for (const message of searchResult.messages) {
                if (message.message) {
                    let sender;
                    try {
                        sender = message.fromId ? await client.getEntity(message.fromId) : null;
                    } catch (error) {
                        console.error('Error fetching sender:', error);
                        sender = null;
                    }
                    
                    // Apply custom filters
                    if (!applyCustomFilters(message, sender, filterOptions)) {
                        console.log('Message filtered out by custom filters');
                        continue;
                    }

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
                        group_username: dialogUsername,
                        author: sender ? (sender.username || sender.firstName || 'Unknown') : 'Unknown',
                        author_id: sender ? sender.id.toString() : 'Unknown',
                        text: message.message,
                        media: mediaInfo,
                        timestamp: new Date(message.date * 1000).getTime(),
                    });

                    console.log(`Added message from: ${messages[messages.length - 1].author}`);

                    if (messages.length >= postLimit) {
                        console.log(`Reached post limit of ${postLimit}`);
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
