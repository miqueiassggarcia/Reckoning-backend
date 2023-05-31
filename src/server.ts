import express from "express";
import { PrismaClient } from "@prisma/client"

export const app = express();
app.use(express.json());

export const prisma = new PrismaClient({
  log:["query"]
});

require("./routes/Versao")(app, prisma)
require("./routes/Feedback")(app, prisma)
require("./routes/Imagem")(app, prisma)
require("./routes/Item")(app, prisma)
require("./routes/Personagem")(app, prisma)

if (process.env.NODE_ENV !== 'test') {
  app.listen(3333, () => console.log(`Listening on port ${3333}`))
}