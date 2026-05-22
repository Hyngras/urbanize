import { mockDelay } from "@/utils/mockDelay";
import { mockDemands, mockUsers } from "./mockData";
import { Demand, FilterState } from "@/types/demand";
import { MetricsSummary } from "@/types/metrics";
import { User } from "@/types/user";
import { newId } from "@/utils/uuid";
import { detectRoleFromEmail } from "@/utils/roleDetection";

const persistKey = "urbanize-demands";
const persistVersion = "urbanize-demands-v";
const CURRENT_VERSION = "2";

const loadDemands = (): Demand[] => {
  if (typeof localStorage === "undefined") return [...mockDemands];
  const version = localStorage.getItem(persistVersion);
  if (version !== CURRENT_VERSION) {
    localStorage.removeItem(persistKey);
    localStorage.setItem(persistVersion, CURRENT_VERSION);
    return [...mockDemands];
  }
  const stored = localStorage.getItem(persistKey);
  if (!stored) return [...mockDemands];
  try {
    return JSON.parse(stored) as Demand[];
  } catch {
    return [...mockDemands];
  }
};

const saveDemands = (demands: Demand[]) => {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(persistKey, JSON.stringify(demands));
};

let cache = loadDemands();

export const api = {
  async getDemands(filters: FilterState = {}): Promise<Demand[]> {
    await mockDelay();
    return cache.filter((d) => {
      if (filters.status && d.status !== filters.status) return false;
      if (filters.categoria && d.categoria !== filters.categoria) return false;
      if (filters.prioridade && d.prioridade !== filters.prioridade) return false;
      if (filters.bairro && d.endereco.bairro !== filters.bairro) return false;
      if (filters.busca && !d.titulo.toLowerCase().includes(filters.busca.toLowerCase())) return false;
      return true;
    });
  },
  async getDemandById(id: string): Promise<Demand | undefined> {
    await mockDelay();
    return cache.find((d) => d.id === id);
  },
  async createDemand(payload: Omit<Demand, "id" | "protocolo" | "criadaEm" | "atualizadaEm">): Promise<Demand> {
    await mockDelay();
    const demand: Demand = {
      ...payload,
      id: newId(),
      protocolo: `URB-${Math.floor(Math.random() * 90000 + 10000)}`,
      criadaEm: new Date().toISOString(),
      atualizadaEm: new Date().toISOString(),
    };
    cache = [demand, ...cache];
    saveDemands(cache);
    return demand;
  },
  async updateDemandStatus(id: string, status: Demand["status"], observacaoGestor?: string): Promise<Demand | undefined> {
    await mockDelay();
    cache = cache.map((d) =>
      d.id === id
        ? {
            ...d,
            status,
            observacaoGestor: observacaoGestor ?? d.observacaoGestor,
            atualizadaEm: new Date().toISOString(),
            historico: [
              ...d.historico,
              {
                id: newId(),
                status,
                descricao: observacaoGestor ?? "Atualização de status",
                data: new Date().toISOString(),
                autor: "Gestor",
              },
            ],
          }
        : d
    );
    const updated = cache.find((d) => d.id === id);
    saveDemands(cache);
    return updated;
  },
  async getMetrics(): Promise<MetricsSummary> {
    await mockDelay();
    const porStatus: Record<string, number> = {};
    const porCategoria: Record<string, number> = {};
    cache.forEach((d) => {
      porStatus[d.status] = (porStatus[d.status] ?? 0) + 1;
      porCategoria[d.categoria] = (porCategoria[d.categoria] ?? 0) + 1;
    });
    return {
      total: cache.length,
      porStatus,
      porCategoria,
      tempoMedioAtendimentoDias: 4.2,
    };
  },
  async login(email: string): Promise<{ user: User; token: string }> {
    await mockDelay();
    let user = mockUsers.find((u) => u.email === email);
    if (!user) {
      const role = detectRoleFromEmail(email);
      user = {
        id: newId(),
        nome: role === "gestor" ? "Gestor Demo" : "Cidadão Demo",
        email,
        role,
      };
      mockUsers.push(user);
    }
    return { user, token: newId() };
  },
  async register(nome: string, email: string, telefone?: string) {
    await mockDelay();
    const role = detectRoleFromEmail(email);
    const user: User = { id: newId(), nome, email, telefone, role };
    mockUsers.push(user);
    return { user, token: newId() };
  },
};
