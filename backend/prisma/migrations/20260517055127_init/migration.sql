-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "senhaHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'cidadao',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Demand" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "protocolo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "categoria" TEXT NOT NULL DEFAULT 'outros',
    "prioridade" TEXT NOT NULL DEFAULT 'media',
    "status" TEXT NOT NULL DEFAULT 'registrada',
    "nomeSolicitante" TEXT NOT NULL,
    "emailSolicitante" TEXT NOT NULL,
    "telefoneSolicitante" TEXT,
    "endereco" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "referencia" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "origem" TEXT NOT NULL DEFAULT 'cidadao',
    "orgaoResponsavel" TEXT,
    "imagemUrl" TEXT,
    "observacaoGestor" TEXT,
    "scoreTriagem" REAL,
    "sugestaoEncaminhamento" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    CONSTRAINT "Demand_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DemandHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "demandId" TEXT NOT NULL,
    CONSTRAINT "DemandHistory_demandId_fkey" FOREIGN KEY ("demandId") REFERENCES "Demand" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MetricsSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "total" INTEGER NOT NULL,
    "porStatusJson" TEXT NOT NULL,
    "porCategoriaJson" TEXT NOT NULL,
    "tempoMedioAtendimentoDias" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Demand_protocolo_key" ON "Demand"("protocolo");

-- CreateIndex
CREATE INDEX "Demand_status_idx" ON "Demand"("status");

-- CreateIndex
CREATE INDEX "Demand_categoria_idx" ON "Demand"("categoria");

-- CreateIndex
CREATE INDEX "Demand_bairro_idx" ON "Demand"("bairro");

-- CreateIndex
CREATE INDEX "Demand_userId_idx" ON "Demand"("userId");

-- CreateIndex
CREATE INDEX "DemandHistory_demandId_idx" ON "DemandHistory"("demandId");
