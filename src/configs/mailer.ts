const configureMailerOptions = () => {
  return {
    transport: {
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
      secure: true,
    },
  };
};

export { configureMailerOptions };
