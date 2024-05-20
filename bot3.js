const TelegramApi = require('node-telegram-bot-api');
require('dotenv').config();

const { gameOptions, againOptions } = require('./bot3_options');

const telegramToken = process.env.TELEGRAM_TOKEN_BOT_2;

const bot = new TelegramApi(telegramToken, { polling: true });

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Я задумав число від 0 до 9. Спробуй його відгадати.');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;

    console.log(chats);

    await bot.sendMessage(chatId, `Відгадай!`, gameOptions);
};

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Початковий привітання' },
        { command: '/name', description: 'Вивести Ім`я користувача' },
        { command: '/game', description: 'Пограти в гру' },
    ]);

    bot.on('message', async msg => {
        const sticker_file_id = 'CAACAgIAAxkBAAMiZkooEztxxhJfhZ1UBxcSSzJB6NsAAmYAA1m7_CWcvJiSv7eHFzUE';

        const chatId = msg.chat.id;
        const text = msg.text;

        if (text === '/start') {
            await bot.sendSticker(chatId, sticker_file_id, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Button 1', callback_data: 'button1' }],
                        [{ text: 'Button 2', callback_data: 'button2' }],
                    ],
                },
            });

            return bot.sendMessage(chatId, `Вітаю тебе в Третьому Боті !!!`);
        }

        if (text === '/name') {
            return bot.sendMessage(chatId, `Тебе звати ${msg.from.first_name}`);
        }

        if (text === '/game') {
            return startGame(chatId);
        }

        return await bot.sendMessage(chatId, `Ти написав такий текст >>>> ${text}`);
    });

    // Слухає кнопки на які натискаю в боті
    bot.on('callback_query', async msg => {
        const chatId = msg.message.chat.id;
        const data = msg.data;

        if (data === '/again') {
            return startGame(chatId);
        }

        if (+data !== chats[chatId]) {
            // return await bot.sendMessage(chatId, `Ти вибрав число ${data}.\nЦе не вірно, я загадав інше число.\nНумо спробуй *ще раз!*`, { parse_mode: 'Markdown' });
            return await bot.sendMessage(chatId, `${msg.from.first_name} ти не вгадав, Бот загадав число ${chats[chatId]}`, againOptions);
        }

        return await bot.sendMessage(chatId, `Вітаю ${msg.from.first_name}! Ти вгадав задумане Ботом число ${data}`, againOptions);
    });

};

start();