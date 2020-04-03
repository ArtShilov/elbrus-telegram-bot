const TelegramBot = require("node-telegram-bot-api");
const debug = require("./helpers");
const env = require("dotenv").config();

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: {
    interval: 300,
    autoStart: true,
    params: {
      timeout: 60
    }
  }
});

const globalOptions = {
  reply_markup: {
    keyboard: [["online", "offline"], ["соц. сети elbrusBootCamp"]],
    one_time_keyboard: true
  }
};

bot.onText(/\/start/, async msg => {
  const chatId = msg.chat.id;
  try {
    await bot.sendMessage(chatId, "Здравствуйте я ElbrusCamp_bot");
    await bot.sendMessage(
      chatId,
      "Какой вид обучения Вам подходит?",
      globalOptions
    );
  } catch (err) {
    console.error("WTF", err);
  }
});

/////////////////////////////////////////////////////////////
bot.onText(/.+/g, async (msg, match) => {
  // console.log('match ',match);
  // console.log('msg ',msg);
  const chatId = msg.chat.id;
  const onlineOptions = {
    reply_markup: {
      keyboard: [
        ["Цена online курса", "Длительность online курса"],
        ["Как проходит online обучение?", "Контакты online курса"],
        ["Вернуться в меню"]
      ] /* ,
      one_time_keyboard: true */
    }
  };
  const offlineOptions = {
    reply_markup: {
      keyboard: [
        ["Цена offline курса", "Длительность offline курса"],
        ["FAQ offline курса", "Контакты offline курса"],
        ["Вернуться в меню"]
      ] /* ,
      one_time_keyboard: true */
    }
  };
  const socialNetworksOptions = {
    reply_markup: {
      keyboard: [
        ["Наш сайт", "Facebook"],
        ["Instagram", "VK"],
        ["Вернуться в меню"]
      ] /* ,
      one_time_keyboard: true */
    }
  };
  const contactChooseOfflineCityOptions = {
    reply_markup: {
      keyboard: [
        [`\u2713Moscow`, `\u2713St. Petersburg`],
        ["Вернуться в offline меню"]
      ] /* ,
      one_time_keyboard: true */
    }
  };
  const FAQofflineOptions = {
    reply_markup: {
      keyboard: [
        ["На каком языке я буду учиться программировать?"],
        ["Я смогу поступить на курс, если у меня нет опыта?"],
        ["Как мне записаться на учебный курс по программированию?"],
        ["Если я пойму, что мне не нравится, я смогу вернуть деньги?"],
        ["Что такое выпускной проект?", "Нужно ли иметь свой ноутбук?"],
        ["Вернуться в offline меню"]
      ] /* ,
      one_time_keyboard: true */
    }
  };

  try {
    /////socialNetworks////////////////////////////////////////////////////////
    if (match[0].toLowerCase() === "соц. сети elbrusbootcamp") {
      await bot.sendMessage(
        chatId,
        "Что Вас интересует?",
        socialNetworksOptions
      );
    }
    if (match[0].toLowerCase() === "наш сайт") {
      await bot.sendMessage(
        chatId,
        `https://elbrusboot.camp/`
        //         ,{
        //   disable_web_page_preview:true,/* ссылка без описания */
        //   disable_notification:true /* выключает звук и нотификацию */
        // }
      );
    }
    if (match[0].toLowerCase() === "facebook") {
      await bot.sendMessage(chatId, `https://www.facebook.com/elbrusbootcamp`, {
        disable_web_page_preview: true /* ссылка без описания */,
        disable_notification: true /* выключает звук и нотификацию */
      });
    }
    if (match[0].toLowerCase() === "vk") {
      await bot.sendMessage(chatId, `https://vk.com/elbrusbootcamp`, {
        disable_web_page_preview: true /* ссылка без описания */,
        disable_notification: true /* выключает звук и нотификацию */
      });
    }
    if (match[0].toLowerCase() === "instagram") {
      await bot.sendMessage(
        chatId,
        `https://www.instagram.com/elbrus.bootcamp/`,
        {
          disable_web_page_preview: true /* ссылка без описания */,
          disable_notification: true /* выключает звук и нотификацию */
        }
      );
    }

    /////ONLINE////////////////////////////////////////////////////////
    if (match[0].toLowerCase() === "online") {
      await bot.sendMessage(
        chatId,
        "Выберите что Вас инетересует",
        onlineOptions
      );
    }
    // console.log(msg);

    if (match[0].toLowerCase() === "цена online курса") {
      await bot.sendMessage(chatId, "150 000 \u20BD", onlineOptions);
    }
    if (match[0].toLowerCase() === "контакты online курса") {
      try {
        await bot.sendContact(
          chatId,
          "+7 495 786-05-81",
          "ElbrusBootCamp",
          onlineOptions
        );
        await bot.sendMessage(
          chatId,
          "Напиши нам в WatsApp или позвони по этому номеру \u2b06",
          onlineOptions
        );
        await bot.sendMessage(
          chatId,
          "Или напиши нам в телеграм @elbrus_bootcamp",
          onlineOptions
        );
      } catch (error) {
        if (error.response.body.error_code === 429) {
          await bot.sendMessage(
            chatId,
            "Напиши нам в WatsApp или позвони по этому номеру:",
            onlineOptions
          );
          await bot.sendMessage(chatId, "89112816062", onlineOptions);
          await bot.sendMessage(
            chatId,
            "Или напиши нам в телеграм @elbrus_bootcamp",
            onlineOptions
          );
        }
      }
    }
    if (match[0].toLowerCase() === "длительность online курса") {
      await bot.sendMessage(chatId, "16 недель", onlineOptions);
    }
    if (match[0].toLowerCase() === "как проходит online обучение?") {
      await bot.sendMessage(
        chatId,
        "КАЖДЫЙ БУДНИЙ ДЕНЬ проходит обучение с 9:00 до 17:00 полностью погружаешься в процесс — это похоже на работу или стажировку в IT-компании. Первые 3 недели можно совмещать с работой/учебой выполняя задания в удобное время в течение дня, а начиная с 4 недели занятия проходят фулл-тайм",
        onlineOptions
      );

      await bot.sendMessage(
        chatId,
        `ЛЕКЦИИ в режиме реального времени — предзаписанных лекций нет, преподаватель будет на связи «здесь и сейчас». ПРЕПОДАВАТЕЛЬ будет с тобой на протяжении всего обучения`,
        onlineOptions
      );

      await bot.sendMessage(
        chatId,
        `РАБОТА С GITHUB. GitHub — крупнейшая система управления проектами и версиями кода, созданная для разработчиков. Ты сможешь следить за другими разработчиками, за их проектами, успехами и теми, с кем они общаются`,
        onlineOptions
      );

      await bot.sendMessage(
        chatId,
        `РАБОТА В КОМАНДЕ. Самое интересное и вдохновляющее — вместе выполняете задания реализация усвоенного материала через создание web-приложения`,
        onlineOptions
      );

      await bot.sendMessage(
        chatId,
        `ПОЛНОЦЕННОЕ ПОРТФОЛИО ДЛЯ ТРУДОУСТРОЙСТВА. Каждая строчка написанная во время обучения сохранится в твоем портфолио`,
        onlineOptions
      );
    }
    /////offline////////////////////////////////////////////////////////
    if (match[0].toLowerCase() === "offline") {
      await bot.sendMessage(
        chatId,
        "Выберите что Вас инетересует",
        offlineOptions
      );
    }
    if (match[0].toLowerCase() === "цена offline курса") {
      await bot.sendMessage(chatId, "230 000 \u20BD в Москве", offlineOptions);
      await bot.sendMessage(
        chatId,
        "170 000 \u20BD в Санкт-Петербурге",
        offlineOptions
      );
    }
    if (match[0].toLowerCase() === "длительность offline курса") {
      await bot.sendMessage(chatId, "11 недель", offlineOptions);
    }
    if (match[0].toLowerCase() === "контакты offline курса") {
      await bot.sendMessage(
        chatId,
        "Выберите город",
        contactChooseOfflineCityOptions
      );
    }
    if (match[0] === "\u2713Moscow") {
      try {
        await bot.sendContact(
          chatId,
          "+7 495 786-05-81",
          "ElbrusBootCamp_in_Moscow",
          contactChooseOfflineCityOptions
        );
        await bot.sendMessage(
          chatId,
          "Напиши нам в WatsApp или позвони по этому номеру \u2b06",
          contactChooseOfflineCityOptions
        );
        await bot.sendMessage(
          chatId,
          "Или напиши нам в телеграм @elbrus_bootcamp",
          contactChooseOfflineCityOptions
        );
      } catch (error) {
        console.log(
          ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> TIME",
          error.response.body.parameters
        );

        if (error.response.body.error_code === 429) {
          await bot.sendMessage(
            chatId,
            "Напиши нам в WatsApp или позвони по этому номеру:",
            contactChooseOfflineCityOptions
          );
          await bot.sendMessage(
            chatId,
            "89112816062",
            contactChooseOfflineCityOptions
          );
          await bot.sendMessage(
            chatId,
            "Или напиши нам в телеграм @elbrus_bootcamp",
            contactChooseOfflineCityOptions
          );
        }
      }
    }
    if (match[0] === "\u2713St. Petersburg") {
      try {
        await bot.sendContact(
          chatId,
          "+7 911 281-60-62",
          `ElbrusBootCamp in St. Petersburg`,
          contactChooseOfflineCityOptions
        );
        await bot.sendMessage(
          chatId,
          "Напиши нам в WatsApp или позвони по этому номеру \u2b06",
          contactChooseOfflineCityOptions
        );
        await bot.sendMessage(
          chatId,
          "Или напиши нам в телеграм @elbrus_bootcamp",
          contactChooseOfflineCityOptions
        );
      } catch (error) {
        if (error.response.body.error_code === 429) {
          console.log(
            ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> TIME",
            error.response.body.parameters
          );

          await bot.sendMessage(
            chatId,
            "Напиши нам в WatsApp или позвони по этому номеру:",
            contactChooseOfflineCityOptions
          );
          await bot.sendMessage(
            chatId,
            "89112816062",
            contactChooseOfflineCityOptions
          );
          await bot.sendMessage(
            chatId,
            "Или напиши нам в телеграм @elbrus_bootcamp",
            contactChooseOfflineCityOptions
          );
        }
      }
    }

    /////to Start ////////////////////////////////////////////////////////
    if (match[0].toLowerCase() === "вернуться в меню") {
      await bot.sendMessage(
        chatId,
        "Какой вид обучения Вам подходит?",
        globalOptions
      );
    }
    /////FAQ offline////////////////////////////////////////////////////////
    if (match[0].toLowerCase() === "faq offline курса") {
      await bot.sendMessage(chatId, "Выберите вопрос", FAQofflineOptions);
    }
    if (match[0].toLowerCase() === "вернуться в offline меню") {
      await bot.sendMessage(chatId, "Вы в offline меню", offlineOptions);
    }

    if (
      match[0].toLowerCase() ===
      "на каком языке я буду учиться программировать?"
    ) {
      await bot.sendMessage(
        chatId,
        "Мы учим программировать на JavaScript. Этот язык подходит для написания frontend и backend сайтов, игр, приложений и позволяет получить представление о программировании в целом. Когда вы освоите JS, вам будет нетрудно выучить другие языки, если это понадобится для решения новых задач.",
        FAQofflineOptions
      );
    }

    if (
      match[0].toLowerCase() ===
      "я смогу поступить на курс, если у меня нет опыта?"
    ) {
      await bot.sendMessage(
        chatId,
        "Да, можете. Однако для поступления необходимо сдать вступительный экзамен на знание базового синтаксиса JavaScript. Материалы для подготовки к экзамену мы отправим вам на почту, если вы оставите заявку.",
        FAQofflineOptions
      );
    }

    if (
      match[0].toLowerCase() ===
      "как мне записаться на учебный курс по программированию?"
    ) {
      await bot.sendMessage(
        chatId,
        "После того, как вы заполните заявку на сайте, с вами свяжется куратор, чтобы задать несколько вопросов о ваших ожиданиях и технических навыках. Далее мы планируем собеседование (Skype или в кампусе Elbrus). Чтобы пройти техническое собеседование, вам достаточно изучить первые 5 глав книги Выразительный Java Script. Нужно разобраться с синтаксисом языка Java Script, это займет максимум 10-20 часов.",
        FAQofflineOptions
      );
    }

    if (
      match[0].toLowerCase() ===
      "если я пойму, что мне не нравится, я смогу вернуть деньги?"
    ) {
      await bot.sendMessage(
        chatId,
        "Да, мы возвращаем 100% стоимости, если в первые 3 недели обучения вы поняли, что программа не для вас.",
        FAQofflineOptions
      );
    }

    if (match[0].toLowerCase() === "что такое выпускной проект?") {
      await bot.sendMessage(
        chatId,
        "Это сайт или приложение, которое вы создаете в команде с другими студентами. У вас будет 2 недели на осуществление этого проекта. Преподаватели всегда рядом, чтобы помочь советом и ответить на ваши вопросы.",
        FAQofflineOptions
      );
    }

    if (match[0].toLowerCase() === "нужно ли иметь свой ноутбук?") {
      await bot.sendMessage(
        chatId,
        `Да, у вас должен быть ноутбук. Это может быть Mac или PC, во втором случае вам потребуется установить ОС Ubuntu. Обязательное требование к "железу" - 8 GB оперативной памяти и поддержка архитектуры x64. Для комфортного обучения мы рекомендуем использовать SSD и процессоры с оценкой Passmark CPU от 2500 и выше.`,
        FAQofflineOptions
      );
    }
  } catch (err) {
    console.error("WTF2", err);
  }
});
