import nodemailer, { Transporter } from "nodemailer";
import fs from "fs";
import path from "path";

interface EmailOptions {
  to: string;
  subject: string;
  templateName?: string;
  templateVars?: { [key: string]: string };
  text?: string;
}

export class EmailService {
  private transporter: Transporter;

  constructor() {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASS) {
      throw new Error("GMAIL_USER and GMAIL_APP_PASS must be set in .env");
    }

    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
      },
    });
  }

  private compileTemplate(templateName: string, templateVars: { [key: string]: string }) {
    const templatePath = path.join(process.cwd(), "src", "utils", "templates", `${templateName}.html`);
    let template = fs.readFileSync(templatePath, "utf-8");

    Object.keys(templateVars).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      template = template.replace(regex, templateVars[key]);
    });

    return template;
  }

  async sendEmail(options: EmailOptions) {
    const { to, subject, templateName, templateVars, text } = options;

    const htmlContent = templateName && templateVars
      ? this.compileTemplate(templateName, templateVars)
      : undefined;

    await this.transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      text: text || "No text provided",
      html: htmlContent,
    });

    console.log(`Email sent to ${to} with subject: ${subject}`);
  }
}
