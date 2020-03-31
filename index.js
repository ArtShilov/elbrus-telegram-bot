const TelegramBot = require("node-telegram-bot-api");
const debug = require("./helpers");
const env = require("dotenv").config();


const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true
});

const globalOptions = {
  reply_markup: {
    keyboard: [["online"], ["offline"]],
    one_time_keyboard: true
  }
};

bot.onText(/\/start/, async msg => {
  const chatId = msg.chat.id;
  await bot.sendMessage(chatId, "Здравствуйте я ElbrusCamp_bot");
  await bot.sendMessage(
    chatId,
    "Какой вид обучения Вам подходит?",
    globalOptions
  );
});

/////////////////////////////////////////////////////////////
bot.onText(/.+/g, async (msg, match) => {
  // console.log('match ',match);
  // console.log('msg ',msg);
  const chatId = msg.chat.id;
  const onlineOptions = {
    reply_markup: {
      keyboard: [
        ["Цена online курса","Длительность online курса"],
        ["Вернуться в меню"]
      ],
      one_time_keyboard: true
    }
  };
  const offlineOptions = {
    reply_markup: {
      keyboard: [
        ["Цена offline курса","Длительность offline курса"],
        ["Вернуться в меню"]
      ],
      one_time_keyboard: true
    }
  };

  /////ONLINE////////////////////////////////////////////////////////
  if (match[0].toLowerCase() === "online") {
    bot.sendMessage(chatId, "Выберите что Вас инетересует", onlineOptions);
  }
  // console.log(msg);

  if (match[0].toLowerCase() === "цена online курса") {
    bot.sendMessage(chatId, "150 000 \u20BD", onlineOptions);
  }
  if (match[0].toLowerCase() === "длительность online курса") {
    bot.sendMessage(chatId, "16 недель", onlineOptions);
  }
  if (match[0].toLowerCase() === "offline") {
    bot.sendMessage(chatId, "Выберите что Вас инетересует", offlineOptions);
  }
  /////offline////////////////////////////////////////////////////////
  if (match[0].toLowerCase() === "цена offline курса") {
    await bot.sendMessage(chatId, "230 000 \u20BD в Москве", offlineOptions);
    await bot.sendMessage(
      chatId,
      "170 000 \u20BD в Санкт-Петербурге",
      offlineOptions
    );
  }
  if (match[0].toLowerCase() === "длительность offline курса") {
    bot.sendMessage(chatId, "11 недель", offlineOptions);
  }

  /////to Start ////////////////////////////////////////////////////////
  if (match[0].toLowerCase() === "вернуться в меню") {
  bot.sendMessage(chatId, "Какой вид обучения Вам подходит?", globalOptions );
}
});



