const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input');
const fs = require('fs');
const { Api, errors } = require('telegram');

const apiId = 000;
const apiHash = '';

let savedSession = '';
if (fs.existsSync('session.txt')) {
    savedSession = fs.readFileSync('session.txt', 'utf8');
}

const stringSession = new StringSession(savedSession);

async function scrapeTelegram(keyword, postLimit = 100) {
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
    fs.writeFileSync('session.txt', client.session.save(), 'utf8');

    let messages = [];
    const dialogs = await client.getDialogs({ limit: 8 });

    for (const dialog of dialogs) {
        try {
            const searchResult = await client.invoke(
                new Api.messages.Search({
                    peer: dialog,
                    q: keyword,
                    filter: new Api.InputMessagesFilterEmpty(),
                    limit: postLimit,
                })
            );

            const dialogName = dialog.entity.username ? `@${dialog.entity.username}` : dialog.name || dialog.title;

            for (const message of searchResult.messages) {
                if (message.message && message.fromId && message.fromId.userId) {
                    messages.push({
                        group_name: dialogName,
                        author: message.fromId.userId.toString(),
                        text: message.message,
                    });
                }

                if (messages.length >= postLimit) {
                    break;
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
                console.log(`Error searching in ${dialog.name || dialog.title}: ${e.message}`);
            }
        }
    }

    await client.disconnect();
    return messages.slice(0, postLimit);
}

module.exports = { scrapeTelegram };
