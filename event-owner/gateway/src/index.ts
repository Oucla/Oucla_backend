import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();
const services: Record<string, string | undefined> = {
  "/event-auth": process.env.AUTH_URL,
  "/event-email": process.env.EMAIL_URL,
  "/events": process.env.EVENT_URL,
  "/dashboard": process.env.DASHBOARD_URL,
  "/event-stream": process.env.STREAM_URL,
};

// Register proxies
for (const [route, target] of Object.entries(services)) {
  if (target) {
    console.log(`Proxying ${route} → ${target}`);
    app.use(route, createProxyMiddleware({ target, changeOrigin: true }));
  }
}

// Root health check
app.get("/", (_, res) => {
  res.send("Oucla Event API Gateway is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`);
});
