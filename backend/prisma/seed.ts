import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const users = [
  { nome: "Cidadão Demo", email: "cidadao@urbanize.com", role: "cidadao" as const },
  { nome: "Gestor Demo", email: "gestor@urbanize.com", role: "gestor" as const },
];

const demands = [
  {
    protocolo: "URB-10001",
    titulo: "Poste apagado na Av. Boa Viagem",
    descricao: "Poste em frente ao número 900 está apagado há 3 dias.",
    categoria: "iluminacao_publica" as const,
    prioridade: "media" as const,
    status: "em_analise" as const,
    endereco: "Av. Boa Viagem, 900",
    bairro: "Boa Viagem",
    cidade: "Recife",
    scoreTriagem: 0.72,
    sugestaoEncaminhamento: "Iluminação Urbana",
  },
  {
    protocolo: "URB-10002",
    titulo: "Buraco em via principal",
    descricao: "Buraco grande antes do semáforo, risco de acidente.",
    categoria: "vias_publicas" as const,
    prioridade: "alta" as const,
    status: "em_atendimento" as const,
    endereco: "Av. Agamenon Magalhães",
    bairro: "Derby",
    cidade: "Recife",
    scoreTriagem: 0.86,
    sugestaoEncaminhamento: "Secretaria de Obras",
  },
  {
    protocolo: "URB-10003",
    titulo: "Coleta de lixo atrasada",
    descricao: "Coleta não passa há 2 dias na rua.",
    categoria: "coleta_de_lixo" as const,
    prioridade: "baixa" as const,
    status: "resolvida" as const,
    endereco: "Rua da Aurora, 300",
    bairro: "Santo Amaro",
    cidade: "Recife",
    scoreTriagem: 0.78,
    sugestaoEncaminhamento: "Limpeza Urbana",
  },
];

async function main() {
  const senhaHash = await bcrypt.hash("demo", 10);
  const [citizen] = await Promise.all(
    users.map((user) =>
      prisma.user.upsert({
        where: { email: user.email },
        update: { nome: user.nome, role: user.role, senhaHash },
        create: { ...user, senhaHash },
      })
    )
  );

  for (const demand of demands) {
    await prisma.demand.upsert({
      where: { protocolo: demand.protocolo },
      update: demand,
      create: {
        ...demand,
        nomeSolicitante: citizen.nome,
        emailSolicitante: citizen.email,
        origem: "cidadao",
        user: { connect: { id: citizen.id } },
        historico: {
          create: [
            { status: "registrada", descricao: "Registrada pelo cidadão", autor: citizen.nome },
            { status: demand.status, descricao: "Status inicial da base de demonstração", autor: "Sistema" },
          ],
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Base de demonstração populada.");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
