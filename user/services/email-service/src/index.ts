import "dotenv/config";
import { App } from "./app/App";
const PORT = Number(process.env.EMAIL_SERVICE_PORT);
new App().start(PORT);
