import cron from "node-cron";
import { env } from "../config/env";
import { metricsService } from "../services/metricsService";

export const startMetricsJob = () => {
  if (!cron.validate(env.metricsCron)) {
    console.warn(`Cron de métricas inválido (${env.metricsCron}); job desativado.`);
    return;
  }

  cron.schedule(env.metricsCron, async () => {
    try {
      await metricsService.persistSnapshot();
      console.log("Snapshot periódico de métricas consolidado.");
    } catch (error) {
      console.error("Falha ao consolidar métricas.", error);
    }
  });
};
