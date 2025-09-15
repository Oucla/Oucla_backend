import "dotenv/config"

import { App } from "./app/App.js";

const server = new App();
server.start();
