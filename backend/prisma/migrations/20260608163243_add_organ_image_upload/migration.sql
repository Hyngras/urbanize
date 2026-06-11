-- CreateTable
CREATE TABLE "Organ" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "whatsapp" TEXT,
    "site" TEXT,
    "categoriasJson" TEXT NOT NULL DEFAULT '[]'
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Demand" (
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
    "organId" TEXT,
    CONSTRAINT "Demand_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Demand_organId_fkey" FOREIGN KEY ("organId") REFERENCES "Organ" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Demand" ("bairro", "categoria", "cidade", "createdAt", "descricao", "emailSolicitante", "endereco", "id", "imagemUrl", "latitude", "longitude", "nomeSolicitante", "observacaoGestor", "orgaoResponsavel", "origem", "prioridade", "protocolo", "referencia", "scoreTriagem", "status", "sugestaoEncaminhamento", "telefoneSolicitante", "titulo", "updatedAt", "userId") SELECT "bairro", "categoria", "cidade", "createdAt", "descricao", "emailSolicitante", "endereco", "id", "imagemUrl", "latitude", "longitude", "nomeSolicitante", "observacaoGestor", "orgaoResponsavel", "origem", "prioridade", "protocolo", "referencia", "scoreTriagem", "status", "sugestaoEncaminhamento", "telefoneSolicitante", "titulo", "updatedAt", "userId" FROM "Demand";
DROP TABLE "Demand";
ALTER TABLE "new_Demand" RENAME TO "Demand";
CREATE UNIQUE INDEX "Demand_protocolo_key" ON "Demand"("protocolo");
CREATE INDEX "Demand_status_idx" ON "Demand"("status");
CREATE INDEX "Demand_categoria_idx" ON "Demand"("categoria");
CREATE INDEX "Demand_bairro_idx" ON "Demand"("bairro");
CREATE INDEX "Demand_userId_idx" ON "Demand"("userId");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "senhaHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'cidadao',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "organId" TEXT,
    CONSTRAINT "User_organId_fkey" FOREIGN KEY ("organId") REFERENCES "Organ" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("createdAt", "email", "id", "nome", "role", "senhaHash", "telefone", "updatedAt") SELECT "createdAt", "email", "id", "nome", "role", "senhaHash", "telefone", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Organ_nome_key" ON "Organ"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Organ_sigla_key" ON "Organ"("sigla");
