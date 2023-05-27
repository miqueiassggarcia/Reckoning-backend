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
app.post("/Versao", async (request, response) => {
  const {
    idVersao,
    nome,
    descricao,
    data,
    arquivo
  } = VersaoSchema.parse(request.body);

  const versao = await prisma.versao.create({
    data: {
      idVersao: idVersao,
      nome: nome,
      descricao: descricao,
      data: data,
      arquivo: arquivo
    }
  });

  return response.status(201).json(versao);
});

// Rota para cadastro de um feedback
app.post("/Feedback", async (request, response) => {
  const {
    idFeedback,
    atribuicao,
    feedback,
  } = FeedbackSchema.parse(request.body);

  const feedbacks = await prisma.feedback.create({
    data: {
      idFeedback: idFeedback,
      atribuicao: atribuicao,
      feedback: feedback
    }
  });

  return response.status(201).json(feedbacks);
});

// Rota para inserção de Imagem
app.post("/Imagem", async (request, response) => {
  const {
    idImagem,
    personagemIdPersonagem,
    itemIdItem,
    Imagem
  } = ImagemSchema.parse(request.body);

  const imagens = await prisma.imagem.create({
    data: {
      idImagem: idImagem,
      personagemIdPersonagem: personagemIdPersonagem,
      itemIdItem: itemIdItem,
      imagem: Imagem
    }
  });

  return response.status(201).json(imagens);
});
