/* eslint-disable no-console */
import sgMail from '@sendgrid/mail';
import formatePrice from './formatPrice.js';

function sendEmail(result, userName, userEmail, paymentMethod) {
  let htmlMsg = `Olá ${userName}, segue o resumo da sua compra: <br>`;
  let totalOrder = 0;

  result.forEach((p) => {
    htmlMsg += `
        <br> ${p.product_qty}x - ${p.product_name} tam: ${p.product_size}
      `;
    totalOrder += p.product_value * p.product_qty;
  });
  htmlMsg += `<br><br>Forma de pagamento: <strong>${paymentMethod}</strong>`;
  htmlMsg += `<br><br> Total: <strong>R$ ${formatePrice(totalOrder)}</strong>`;

  sgMail.setApiKey(process.env.EMAIL_API_KEY);

  const msg = {
    to: userEmail,
    from: 'atelie.ecommerce@gmail.com',
    subject: 'Confirmação de Pedido',
    html: htmlMsg,
  };

  sgMail
    .send(msg)
    .then(() => {}, (error) => {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    });
}

export default sendEmail;
