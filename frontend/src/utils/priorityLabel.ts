import { DemandPriority } from "@/types/demand";

export const priorityLabel: Record<DemandPriority, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

export const priorityColor: Record<DemandPriority, string> = {
  baixa: "gray",
  media: "orange",
  alta: "red",
};
