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
    keyboard: [
      ["online", "offline"],
      ["соц. сети elbrusBootCamp", "оставить заявку"]
    ],
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

const requestState = {}; // chatID -> questionIndex
const requestObjectInfoUser = {};
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
  const backToMenuOptions = {
    reply_markup: {
      keyboard: [["Вернуться в меню"]] /* ,
      one_time_keyboard: true */
    }
  };
  const notPromoBackToMenuOptions = {
    reply_markup: {
      keyboard: [["Нет промокода"],["Вернуться в меню"]] /* ,
      one_time_keyboard: true */
    }
  };
  const onlineOfflineOptions = {
    reply_markup: {
      keyboard: [["online обучение", "offline обучение"], ["Вернуться в меню"]],
      one_time_keyboard: true
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
    /////request////////////////////////////////////////////////////////
    // const questionNumber = 0;
    const questions = [
      "Ваше имя?",
      "Какой вид обучения вам подходит? Выберите из списка",
      "Ваш номер телефона",
      "Ваш email",
      "Напишите Ваш промокод, если его нет нажмите на кнопку "
    ];
    
    if (match[0].toLowerCase() === "оставить заявку") {
      await bot.sendMessage(
        chatId,
        "Чтобы оставить заявку надо ответить на 4 вопроса или можете вернуться в меню",
        backToMenuOptions
        );
        
        requestState[chatId] = 0;

        await bot.sendMessage(chatId, questions[requestState[chatId]]);
      } else if (typeof requestState[chatId] !== "undefined") {
      if (requestState[chatId] === 0) {
        const nameRegExp = new RegExp("^[a-zA-Zа-яА-Я'][a-zA-Zа-яА-Я-' ]+[a-zA-Zа-яА-Я']?$","u");
        // const nameRegExp = new RegExp("^\\s*\\w{1,}\\s*$");

        // console.log('>>>msg.text', msg.text, nameRegExp.test(msg.text));

//request/name/////////////////
        if (nameRegExp.test(msg.text)) {
          requestState[chatId] += 1;
          requestObjectInfoUser.name = msg.text;

          
          await bot.sendMessage(
            chatId,
            questions[requestState[chatId]],
            onlineOfflineOptions
          );
        } else if (match[0].toLowerCase() === "вернуться в меню") {
          await bot.sendMessage(
            chatId,
            "Вы в меню",
            globalOptions
          );
        } else {
          await bot.sendMessage(
            chatId,
            "Что то пошло не так. Введите ваше имя"
          );
          console.error("BAD NAME");
        }
      }

//request/training/////////////////
      else if (requestState[chatId] === 1) {
        if (match[0].toLowerCase() === "online обучение") {
          requestState[chatId] += 1;
          requestObjectInfoUser.training = match[0];

          await bot.sendMessage(
            chatId,
            questions[requestState[chatId]],
            backToMenuOptions
          );
        } else if (match[0].toLowerCase() === "offline обучение") {
          requestState[chatId] += 1;
          requestObjectInfoUser.training = match[0];
          console.log("name & trOFF: ", requestObjectInfoUser);
          await bot.sendMessage(
            chatId,
            questions[requestState[chatId]],
            backToMenuOptions
          );
        } else if (match[0].toLowerCase() === "вернуться в меню") {
          await bot.sendMessage(
            chatId,
            "Вы в меню",
            globalOptions
          );
        }else {
          await bot.sendMessage(chatId, "Что то пошло не так");
          await bot.sendMessage(
            chatId,
            questions[requestState[chatId]],
            
          );
          console.error("BAD of & on msg");
        }
      } 
    
      
//request/phone/////////////////
      else if (requestState[chatId] === 2) {
        const phoneRegExp = new RegExp("^\\d[\\d\\(\\)\\ -]{4,14}\\d$");

        if (phoneRegExp.test(msg.text)) {

          requestState[chatId] += 1;
          requestObjectInfoUser.phone = msg.text;

          await bot.sendMessage(
            chatId,
            questions[requestState[chatId]],
            backToMenuOptions
          );
          
        } else if (match[0].toLowerCase() === "вернуться в меню") {
          await bot.sendMessage(
            chatId,
            "Вы в меню",
            globalOptions
          );
        }else {
          await bot.sendMessage(chatId, "Наверно у вас ошибка в номере. Попробуйте сначало");
          await bot.sendMessage(
            chatId,
            questions[requestState[chatId]],
            
          );
          console.error("BAD phone");
        }

      }
       
//request/email/////////////////     
     
      else if (requestState[chatId] === 3) {
        const emailRegExp = new RegExp("^[-a-z0-9!#$%&'*+/=?^_`{|}~]+(\\.[-a-z0-9!#$%&'*+/=?^_`{|}~]+)*@([a-z0-9]([-a-z0-9]{0,61}[a-z0-9])?\\.)*(aero|arpa|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|[a-z][a-z])$");
        

        if (emailRegExp.test(msg.text)) {
         
          requestState[chatId] += 1;
          requestObjectInfoUser.email = msg.text;


          await bot.sendMessage(
            chatId,
            questions[requestState[chatId]],
            notPromoBackToMenuOptions
          );
          
        } else if (match[0].toLowerCase() === "вернуться в меню") {
          await bot.sendMessage(
            chatId,
            "Вы в меню",
            globalOptions
          );
        }else {
          await bot.sendMessage(chatId, "Наверно у вас ошибка в email. Попробуйте сначало");
          await bot.sendMessage(
            chatId,
            questions[requestState[chatId]],
            
          );
          console.error("BAD email");
        }
      }

//request/promo/////////////////     
     
      else if (requestState[chatId] === 4) {
        if (msg.text) {
          requestObjectInfoUser.promo = msg.text;
          console.log(requestObjectInfoUser);
          
/* ///////////////////////////////логика CRM здесь */
          delete requestObjectInfoUser
          delete requestState[chatId];
          await bot.sendMessage(
            chatId,
            "Заявка отправлена",
            globalOptions
          );
          
        } else if (match[0].toLowerCase() === "вернуться в меню") {
          await bot.sendMessage(
            chatId,
            "Вы в меню",
            globalOptions
          );
        }else if(match[0].toLowerCase() === "нет промокода") {
          console.log(requestObjectInfoUser);
          
          
          /* ///////////////////////////////логика CRM здесь */
          
          
          delete requestState[chatId];
          delete requestObjectInfoUser
          await bot.sendMessage(
            chatId,
            "Заявка отправлена",
            globalOptions
          );
        }

       



      }
    }













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
      await bot.sendMessage(
        chatId,
        `https://www.facebook.com/elbrusbootcamp`
        // , {
        //   disable_web_page_preview: true /* ссылка без описания */,
        //   disable_notification: true /* выключает звук и нотификацию */
        // }
      );
    }
    if (match[0].toLowerCase() === "vk") {
      await bot.sendMessage(
        chatId,
        `https://vk.com/elbrusbootcamp`
        // , {
        //   disable_web_page_preview: true /* ссылка без описания */,
        //   disable_notification: true /* выключает звук и нотификацию */
        // }
      );
    }
    if (match[0].toLowerCase() === "instagram") {
      await bot.sendMessage(
        chatId,
        `https://www.instagram.com/elbrus.bootcamp/`
        // ,
        // {
        //   disable_web_page_preview: true /* ссылка без описания */,
        //   disable_notification: true /* выключает звук и нотификацию */
        // }
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
