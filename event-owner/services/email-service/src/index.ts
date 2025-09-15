import "dotenv/config";
import { App } from "./app/App.js";
const PORT = Number(process.env.EMAIL_SERVICE_PORT);
new App().start(PORT);
