import { Demand, DemandCategory, DemandPriority, DemandStatus } from "@/types/demand";
import { User } from "@/types/user";
import { addDays } from "date-fns";
import { newId } from "@/utils/uuid";

const now = new Date();

const makeDemand = (partial: Partial<Demand>): Demand => ({
  id: newId(),
  protocolo: `URB-${Math.floor(Math.random() * 90000 + 10000)}`,
  titulo: "Demanda",
  descricao: "",
  categoria: "outros",
  prioridade: "media",
  status: "registrada",
  nomeSolicitante: "Cidadão",
  emailSolicitante: "cidadao@urbanize.com",
  telefoneSolicitante: "",
  endereco: {
    endereco: "Rua Exemplo, 123",
    bairro: "Centro",
    cidade: "Recife",
  },
  origem: "cidadao",
  criadaEm: now.toISOString(),
  atualizadaEm: now.toISOString(),
  historico: [],
  ...partial,
});

export const mockDemands: Demand[] = [
  makeDemand({
    titulo: "Poste apagado na Av. Boa Viagem",
    descricao: "Poste em frente ao número 900 está apagado há 3 dias.",
    categoria: "iluminacao_publica",
    prioridade: "media",
    status: "em_analise",
    endereco: {
      endereco: "Av. Boa Viagem, 900",
      bairro: "Boa Viagem",
      cidade: "Recife",
    },
    historico: [
      { id: newId(), status: "registrada", descricao: "Registrada pelo cidadão", data: addDays(now, -2).toISOString(), autor: "Cidadão" },
      { id: newId(), status: "em_analise", descricao: "Triagem inicial", data: addDays(now, -1).toISOString(), autor: "Sistema" },
    ],
    scoreTriagem: 0.72,
    sugestaoEncaminhamento: "Iluminação Urbana",
  }),
  makeDemand({
    titulo: "Buraco em via principal",
    descricao: "Buraco grande antes do semáforo, risco de acidente.",
    categoria: "vias_publicas",
    prioridade: "alta",
    status: "em_atendimento",
    endereco: {
      endereco: "Av. Agamenon Magalhães",
      bairro: "Derby",
      cidade: "Recife",
    },
    historico: [
      { id: newId(), status: "registrada", descricao: "Registrada", data: addDays(now, -5).toISOString(), autor: "Cidadão" },
      { id: newId(), status: "encaminhada", descricao: "Encaminhada para obras", data: addDays(now, -4).toISOString(), autor: "Sistema" },
      { id: newId(), status: "em_atendimento", descricao: "Equipe em deslocamento", data: addDays(now, -1).toISOString(), autor: "Gestor" },
    ],
    scoreTriagem: 0.86,
    sugestaoEncaminhamento: "Secretaria de Obras",
  }),
  makeDemand({
    titulo: "Coleta de lixo atrasada",
    descricao: "Coleta não passa há 2 dias na rua.",
    categoria: "coleta_de_lixo" as DemandCategory,
    prioridade: "baixa" as DemandPriority,
    status: "resolvida" as DemandStatus,
    endereco: {
      endereco: "Rua da Aurora, 300",
      bairro: "Santo Amaro",
      cidade: "Recife",
    },
    historico: [
      { id: newId(), status: "registrada", descricao: "Registrada", data: addDays(now, -7).toISOString(), autor: "Cidadão" },
      { id: newId(), status: "encaminhada", descricao: "Encaminhada para coleta", data: addDays(now, -6).toISOString(), autor: "Sistema" },
      { id: newId(), status: "em_atendimento", descricao: "Rota ajustada", data: addDays(now, -4).toISOString(), autor: "Gestor" },
      { id: newId(), status: "resolvida", descricao: "Coleta realizada", data: addDays(now, -2).toISOString(), autor: "Operação" },
    ],
  }),
];

export const mockUsers: User[] = [
  { id: newId(), nome: "Gestor Demo", email: "gestor@urbanize.com", role: "gestor" },
  { id: newId(), nome: "Cidadão Demo", email: "cidadao@urbanize.com", role: "cidadao" },
];
