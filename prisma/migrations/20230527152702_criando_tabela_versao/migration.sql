-- CreateTable
CREATE TABLE "Versao" (
    "idVersao" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "arquivo" TEXT NOT NULL
);
