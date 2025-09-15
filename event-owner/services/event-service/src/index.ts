//import "dotenv/config";
import { App } from "./app/App";
import dotenv from "dotenv";

dotenv.config();

const server = new App();
server.start();
