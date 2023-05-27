/*
  Warnings:

  - You are about to drop the column `itemIdItem` on the `Imagem` table. All the data in the column will be lost.
  - You are about to drop the column `personagemIdPersonagem` on the `Imagem` table. All the data in the column will be lost.
  - Added the required column `imagemIdImagem` to the `Personagem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagemIdImagem` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Personagem" (
    "idPersonagem" TEXT NOT NULL PRIMARY KEY,
    "imagemIdImagem" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    CONSTRAINT "Personagem_imagemIdImagem_fkey" FOREIGN KEY ("imagemIdImagem") REFERENCES "Imagem" ("idImagem") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Personagem" ("descricao", "idPersonagem", "nome") SELECT "descricao", "idPersonagem", "nome" FROM "Personagem";
DROP TABLE "Personagem";
ALTER TABLE "new_Personagem" RENAME TO "Personagem";
CREATE TABLE "new_Imagem" (
    "idImagem" TEXT NOT NULL PRIMARY KEY,
    "imagem" TEXT NOT NULL
);
INSERT INTO "new_Imagem" ("idImagem", "imagem") SELECT "idImagem", "imagem" FROM "Imagem";
DROP TABLE "Imagem";
ALTER TABLE "new_Imagem" RENAME TO "Imagem";
CREATE TABLE "new_Item" (
    "idItem" TEXT NOT NULL PRIMARY KEY,
    "imagemIdImagem" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    CONSTRAINT "Item_imagemIdImagem_fkey" FOREIGN KEY ("imagemIdImagem") REFERENCES "Imagem" ("idImagem") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("descricao", "idItem", "nome") SELECT "descricao", "idItem", "nome" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
