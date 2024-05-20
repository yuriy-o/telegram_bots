const { Telegraf } = require('telegraf');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const telegramToken = process.env.TELEGRAM_TOKEN_BOT_2;
const openaiKey = process.env.OPENAI_KEY_BOT_2;

const bot = new Telegraf(telegramToken);

const configuration = new Configuration({
    apiKey: openaiKey,
});

const openai = new OpenAIApi(configuration);

bot.on('text', async (ctx) => {
    try {
        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: ctx.message.text }],
        });

        ctx.reply(response.data.choices[0].message.content);
    } catch (error) {
        console.error('Error occurred while communicating with OpenAI:', error);
        ctx.reply('An error occurred while processing your request.');
    }
});

bot.launch();
