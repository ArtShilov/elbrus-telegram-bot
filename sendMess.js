
const nodemailer = require("nodemailer");

async function sendEmail(requestObjectInfoUser) {
  let transporter = nodemailer.createTransport({
    host: "smtp.yandex.ru",
    port: 465,
    secure: true,
    auth: {
      user: process.env.YANAME_TOKEN,
      pass: process.env.YAPASS_TOKEN
    }
  });

  let result = await transporter.sendMail({
    from: `"elbrusBot" <${process.env.YANAME_TOKEN}>`,
    to: process.env.SEND_MAIL_TOKEN,
    subject: `Новая заявка от пользователя ${requestObjectInfoUser.name}`,
    // text:  JSON.stringify(requestObjectInfoUser)
     html: `<p>
     Вид обучения: ${requestObjectInfoUser.training}
     </p>
     <p>
     Номер телефона: ${requestObjectInfoUser.phone}
     </p>
     <p>
     Email адрес:  ${requestObjectInfoUser.email}
     </p> 
     <p>
     Промокод: ${requestObjectInfoUser.promo}
     </p>`
  });
  console.log(result);

}

sendEmail().catch(console.error);

module.export = sendEmail;
