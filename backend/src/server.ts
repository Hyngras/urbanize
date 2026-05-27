import { app } from "./app";
import { env } from "./config/env";
import { connectRedis } from "./config/redis";
import { startMetricsJob } from "./config/cron";

const start = async () => {
  await connectRedis();
  startMetricsJob();

  app.listen(env.port, () => {
    console.log(`Backend Urbanize disponível em http://localhost:${env.port}/api`);
  });
};

start().catch((error) => {
  console.error("Falha ao iniciar backend.", error);
  process.exit(1);
});
