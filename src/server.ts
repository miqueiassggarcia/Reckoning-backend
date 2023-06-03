import express from "express";
import { PrismaClient } from "@prisma/client"

export const app = express();
app.use(express.json());

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV !== 'test' ? ['query'] : [],
  datasources: {
    db: {
      url: process.env.NODE_ENV === 'test' ? 'file:../src/database/dbTest.sqlite' : 'file:../src/database/db.sqlite',
    }
  }
});

require("./routes/Versao")(app, prisma)
require("./routes/Feedback")(app, prisma)
require("./routes/Imagem")(app, prisma)
require("./routes/Item")(app, prisma)
require("./routes/Personagem")(app, prisma)
require("./routes/Login")(app, prisma)

if (process.env.NODE_ENV !== 'test') {
  app.listen(3333, () => console.log(`Listening on port ${3333}`))
}