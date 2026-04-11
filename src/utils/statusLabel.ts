import { DemandStatus } from "@/types/demand";

export const statusLabel: Record<DemandStatus, string> = {
  registrada: "Registrada",
  em_analise: "Em análise",
  encaminhada: "Encaminhada",
  em_atendimento: "Em atendimento",
  resolvida: "Resolvida",
  cancelada: "Cancelada",
};

export const statusColor: Record<DemandStatus, string> = {
  registrada: "yellow",
  em_analise: "orange",
  encaminhada: "blue",
  em_atendimento: "cyan",
  resolvida: "green",
  cancelada: "red",
};
