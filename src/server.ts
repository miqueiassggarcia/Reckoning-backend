import express, { request, response } from "express";
import { PrismaClient } from "@prisma/client"

import { VersaoSchema } from "./validation/Versao";
import { FeedbackSchema } from "./validation/Feedback";
import { ImagemSchema } from "./validation/Imagem";
import { ItensSchema } from "./validation/Itens";
import { PersonagemSchema } from "./validation/Personagem";

const app = express();
app.use(express.json());

const prisma = new PrismaClient({
  log:["query"]
});

require("./routes/Versao")(app, prisma)
require("./routes/Feedback")(app, prisma)
require("./routes/Imagem")(app, prisma)
require("./routes/Item")(app, prisma)
require("./routes/Personagem")(app, prisma)

app.listen(3333)