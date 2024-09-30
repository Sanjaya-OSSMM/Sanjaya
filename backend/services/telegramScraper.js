const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input'); // npm install input
const fs = require('fs');
const { Api, errors } = require('telegram');

const apiId = 000;
const apiHash = '';

// Load session string from a file if it exists
let savedSession = '';
if (fs.existsSync('session.txt')) {
    savedSession = fs.readFileSync('session.txt', 'utf8');
}

const stringSession = new StringSession(savedSession); // Load saved session string

async function scrapeTelegram(keyword) {
    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    });

    await client.start({
        phoneNumber: async () => await input.text('Enter your phone number: '),
        password: async () => await input.text('Enter your password: '),
        phoneCode: async () => await input.text('Enter the code you received: '),
        onError: (err) => console.log(err),
    });

    console.log('You are logged in!');

    // Save the session string after login
    fs.writeFileSync('session.txt', client.session.save(), 'utf8');

    let messages = [];

    // Get dialogs (chats, channels, etc.)
    const dialogs = await client.getDialogs({ limit: 8 });

    for (const dialog of dialogs) {
        try {
            const searchResult = await client.invoke(
                new Api.messages.Search({
                    peer: dialog,
                    q: keyword,
                    filter: new Api.InputMessagesFilterEmpty(),
                    limit: 100,
                })
            );

            // Extract group/channel username or title
            const dialogName = dialog.entity.username ? `@${dialog.entity.username}` : dialog.name || dialog.title;

            for (const message of searchResult.messages) {
                if (message.message && message.fromId && message.fromId.userId) {
                    messages.push({
                        group_name: dialogName,  // Replace with group or channel username
                        author: message.fromId.userId.toString(),
                        text: message.message,
                    });
                }
            }
        } catch (e) {
            if (e instanceof errors.FloodWaitError) {
                console.log(`Sleeping for ${e.seconds} seconds due to rate limit.`);
                await sleep(e.seconds * 1000);
            } else {
                console.log(`Error searching in ${dialog.name || dialog.title}: ${e.message}`);
            }
        }
    }

    await client.disconnect();
    return messages;
}

module.exports = { scrapeTelegram };
