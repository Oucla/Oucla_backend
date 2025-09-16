import axios from "axios";
import dotenv from "dotenv";


dotenv.config();


interface EmailVars {
  [key: string]: string;
}

export class EmailClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.EMAIL_SERVICE_URL || "http://localhost:4000/api/email";
  }

  async sendTemplateEmail(
    to: string,
    subject: string,
    templateName: string,
    templateVars: EmailVars
  ) {
    try {
      await axios.post(`${this.baseUrl}/send`, {
        to,
        subject,
        templateName,
        templateVars,
      });
      console.log(`Email request sent to ${to}`);
    } catch (err: any) {
      console.error(`Failed to send email to ${to}: ${err.message}`);
      throw new Error("Unable to send email at the moment");
    }
  }
}
