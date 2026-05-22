import "dotenv/config";

const toNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: toNumber(process.env.BACKEND_PORT ?? process.env.PORT, 4000),
  frontendUrl: process.env.FRONTEND_URL ?? "http://127.0.0.1:4100",
  jwtSecret: process.env.JWT_SECRET ?? "urbanize-dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  cookieName: process.env.AUTH_COOKIE_NAME ?? "urbanize_session",
  redisUrl: process.env.REDIS_URL,
  metricsCron: process.env.METRICS_CRON ?? "*/15 * * * *",
};

export const isProduction = env.nodeEnv === "production";
