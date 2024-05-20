const { Telegraf } = require('telegraf');
require('dotenv').config();
const axios = require('axios');


const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply('Welcome'));
bot.on('message', async (ctx) => {
    if (ctx.message.location) {
        const { latitude, longitude } = ctx.message.location;

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.API_KEY}`;
        const response = await axios.get(url);

        console.log('response.data >>>>', response.data);

        ctx.reply(`${response.data.name}: Math.round(${response.data.main.temp - 273.15} ) C`);
    } else {
        ctx.reply('Please provide your location.');
    }
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));