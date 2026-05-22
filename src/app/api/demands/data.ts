import { Demand, DemandCategory, DemandStatus } from "@/types/demand";
import { MetricsSummary } from "@/types/metrics";
import { randomUUID } from "crypto";

const now = new Date();

const baseDemands: Demand[] = [
  {
    id: randomUUID(),
    protocolo: "URB-10001",
    titulo: "Poste sem iluminação na Rua das Flores",
    descricao: "Poste em frente ao número 120 está apagado há 3 dias.",
    categoria: "iluminacao_publica",
    prioridade: "media",
    status: "registrada",
    nomeSolicitante: "João Lima",
    emailSolicitante: "joao@email.com",
    endereco: { endereco: "Rua das Flores, 120", bairro: "Centro", cidade: "Recife" },
    origem: "cidadao",
    criadaEm: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
    atualizadaEm: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
    historico: [],
  },
  {
    id: randomUUID(),
    protocolo: "URB-10002",
    titulo: "Buraco em via principal",
    descricao: "Buraco grande na Av. Boa Viagem sentido centro.",
    categoria: "vias_publicas",
    prioridade: "alta",
    status: "em_atendimento",
    nomeSolicitante: "Ana Souza",
    emailSolicitante: "ana@email.com",
    endereco: { endereco: "Av. Boa Viagem, 900", bairro: "Boa Viagem", cidade: "Recife" },
    origem: "cidadao",
    criadaEm: new Date(now.getTime() - 1000 * 60 * 60 * 48).toISOString(),
    atualizadaEm: new Date(now.getTime() - 1000 * 60 * 60 * 12).toISOString(),
    historico: [],
  },
  {
    id: randomUUID(),
    protocolo: "URB-10003",
    titulo: "Coleta de lixo atrasada",
    descricao: "Sem coleta há dois dias na Rua da Aurora.",
    categoria: "coleta_de_lixo",
    prioridade: "baixa",
    status: "resolvida",
    nomeSolicitante: "Marcos Costa",
    emailSolicitante: "marcos@email.com",
    endereco: { endereco: "Rua da Aurora, 300", bairro: "Santo Amaro", cidade: "Recife" },
    origem: "cidadao",
    criadaEm: new Date(now.getTime() - 1000 * 60 * 60 * 72).toISOString(),
    atualizadaEm: new Date(now.getTime() - 1000 * 60 * 60 * 6).toISOString(),
    historico: [],
  },
];

let demands = [...baseDemands];

export function listDemands(filters: {
  status?: DemandStatus;
  categoria?: DemandCategory;
  bairro?: string;
  busca?: string;
} = {}) {
  return demands.filter((d) => {
    if (filters.status && d.status !== filters.status) return false;
    if (filters.categoria && d.categoria !== filters.categoria) return false;
    if (filters.bairro && d.endereco.bairro !== filters.bairro) return false;
    if (filters.busca && !d.titulo.toLowerCase().includes(filters.busca.toLowerCase())) return false;
    return true;
  });
}

export function getDemand(id: string) {
  return demands.find((d) => d.id === id);
}

export function createDemand(payload: Omit<Demand, "id">) {
  const demand: Demand = { ...payload, id: randomUUID() };
  demands = [demand, ...demands];
  return demand;
}

export function updateDemandStatus(id: string, status: DemandStatus) {
  demands = demands.map((d) => (d.id === id ? { ...d, status, atualizadaEm: new Date().toISOString() } : d));
  return getDemand(id);
}

export function metrics(): MetricsSummary {
  const total = demands.length;
  const porStatus = demands.reduce<Record<string, number>>((acc, d) => {
    acc[d.status] = (acc[d.status] ?? 0) + 1;
    return acc;
  }, {});
  const porCategoria = demands.reduce<Record<string, number>>((acc, d) => {
    acc[d.categoria] = (acc[d.categoria] ?? 0) + 1;
    return acc;
  }, {});

  return { total, porStatus, porCategoria, tempoMedioAtendimentoDias: 4.2 };
}
