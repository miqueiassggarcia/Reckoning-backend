-- CreateTable
CREATE TABLE "Item" (
    "idItem" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Imagem" (
    "idImagem" TEXT NOT NULL PRIMARY KEY,
    "personagemIdPersonagem" TEXT NOT NULL,
    "itemIdItem" TEXT NOT NULL,
    "imagem" TEXT NOT NULL,
    CONSTRAINT "Imagem_personagemIdPersonagem_fkey" FOREIGN KEY ("personagemIdPersonagem") REFERENCES "Personagem" ("idPersonagem") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Imagem_itemIdItem_fkey" FOREIGN KEY ("itemIdItem") REFERENCES "Item" ("idItem") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Imagem" ("idImagem", "imagem", "itemIdItem", "personagemIdPersonagem") SELECT "idImagem", "imagem", "itemIdItem", "personagemIdPersonagem" FROM "Imagem";
DROP TABLE "Imagem";
ALTER TABLE "new_Imagem" RENAME TO "Imagem";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
