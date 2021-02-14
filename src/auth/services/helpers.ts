export const configureSendMailOptions = ({
  to,
  text,
  html,
  subject,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) => ({
  to,
  from: `messenger <${process.env.MAIL_USER}>`,
  subject,
  text,
  html,
});

export function getTemplateRegistration(hash: string) {
  return `
        <h1>Подтверждение регистрации</h1>
        <p>Для подтверждения регистрации, пожалуйста, перейдите по <a href='${
          process.env.BASE_FRONT_URI + 'confirm-hash/' + hash
        }'>ссылке</a>.</p>
        <p>Если вы ничего не отправляли, пожалуйста, проигнорируйте это письмо.</p>
      `;
}
