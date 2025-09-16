import "dotenv/config"

import { App } from "./app/App";

const server = new App();
server.start();
