import dotenv from "dotenv";
dotenv.config();

export const StreamingConfig = {
  janus: {
    url: process.env.JANUS_URL || "http://localhost:8088/janus",
    adminSecret: process.env.JANUS_ADMIN_SECRET || "",
  },
  jwtSecret: process.env.JWT_SECRET || "supersecret",
};
