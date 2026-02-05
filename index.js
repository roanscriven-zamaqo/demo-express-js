require('dotenv').config(); // must be first

const express = require('express');
const expressApp = express();
const axios = require('axios');
const path = require('path');
const { Telegraf } = require('telegraf');

const port = process.env.PORT || 3000;

console.log("BOT_TOKEN:", process.env.BOT_TOKEN);
if (!process.env.BOT_TOKEN) {
  console.error("❌ BOT_TOKEN is missing! Check your .env file.");
  process.exit(1);
}

const bot = new Telegraf(process.env.BOT_TOKEN);

expressApp.use(express.static('static'));
expressApp.use(express.json());

expressApp.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

bot.command('start', ctx => {
  console.log(ctx.from);
  ctx.reply('Hello there! Welcome to the Code Capsules telegram bot.\nI respond to /ethereum. Please try it');
});

bot.command('ethereum', async ctx => {
  console.log(ctx.from);
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const rate = response.data.ethereum.usd;
    ctx.reply(`Hello, today the ethereum price is ${rate} USD`);
  } catch (err) {
    console.error(err);
    ctx.reply("Sorry, I couldn't fetch Ethereum price right now.");
  }
});

bot.launch()
  .then(() => console.log("✅ Bot launched successfully!"))
  .catch(err => console.error("❌ Bot launch failed:", err));

expressApp.listen(port, () => {
  console.log(`Express server running on http://localhost:${port}`);
});
