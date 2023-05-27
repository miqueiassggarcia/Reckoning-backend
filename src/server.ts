import express from "express";
import { PrismaClient } from "@prisma/client"

import { VersaoSchema } from "./validation/Versao";
import { FeedbackSchema } from "./validation/Feedback";
import { ImagemSchema } from "./validation/Imagem";

const app = express();
app.use(express.json());

const prisma = new PrismaClient({
  log:["query"]
});

// Rota para cadastro de uma nova versão
app.post("/versao", async (request, response) => {
  const {
    nome,
    descricao,
    arquivo
  } = VersaoSchema.parse(request.body);

  const versao = await prisma.versao.create({
    data: {
      nome: nome,
      descricao: descricao,
      arquivo: arquivo
    }
  });

  return response.status(201).json(versao);
});

// Rota para cadastro de um feedback
app.post("/feedback", async (request, response) => {
  const {
    atribuicao,
    feedback,
  } = FeedbackSchema.parse(request.body);

  const feedbacks = await prisma.feedback.create({
    data: {
      atribuicao: atribuicao,
      feedback: feedback
    }
  });

  return response.status(201).json(feedbacks);
});

// Rota para inserção de Imagem
app.post("/imagem", async (request, response) => {
  const {
    imagem
  } = ImagemSchema.parse(request.body);

  const imagens = await prisma.imagem.create({
    data: {
      imagem: imagem
    }
  });

  return response.status(201).json(imagens);
});

app.listen(3333)