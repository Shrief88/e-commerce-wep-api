import nodemailer from "nodemailer";

import env from "../config/validateEnv";

interface EmailOptions {
  email: string;
  subject: string;
  content: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    secure: true,
    auth: {
      user: env.EMAIL_USER,
      pass: env.APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: "E-commerce App",
    to: options.email,
    subject: options.subject,
    text: options.content,
  };

  await transporter.sendMail(mailOptions);
};
