-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Versao" (
    "idVersao" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "arquivo" TEXT NOT NULL
);
INSERT INTO "new_Versao" ("arquivo", "data", "descricao", "idVersao", "nome") SELECT "arquivo", "data", "descricao", "idVersao", "nome" FROM "Versao";
DROP TABLE "Versao";
ALTER TABLE "new_Versao" RENAME TO "Versao";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
