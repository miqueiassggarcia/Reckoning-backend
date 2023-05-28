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

// Rota para pegar versao
app.get("/versao/:id", async (request, response) => {
  const idVersao = request.params.id;

  const versao = await prisma.versao.findUniqueOrThrow({
    select: {
      nome: true,
      descricao: true,
      data: true,
      arquivo: true
    },
    where: {
      idVersao: idVersao
    }
  })

  return response.json(versao);
})

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

// Rota para pegar feedback
app.get("/feedback/:id", async (request, response) => {
  const idFeedback = request.params.id;

  const feedback = await prisma.feedback.findUniqueOrThrow({
    select: {
      atribuicao: true,
      feedback: true
    },
    where: {
      idFeedback: idFeedback
    }
  })

  return response.json(feedback);
})


// Rota para pegar todos os feedbacks
app.get("/feedback/", async (request, response) => {
  const feedbacks = await prisma.feedback.findMany({
    select: {
      atribuicao: true,
      feedback: true
    }
  });

  return response.json(feedbacks);
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

// Rota para pegar imagem
app.get("/imagem/:id", async (request, response) => {
  const idImagem = request.params.id;

  const imagem = await prisma.imagem.findUniqueOrThrow({
    select: {
      imagem: true
    },
    where: {
      idImagem: idImagem
    }
  })

  return response.json(imagem);
})

// Rota para inserção de itens
app.post("/itens", async (request, response) => {
  const {
    imagemIdImagem,
    nome,
    descricao
  } = ItensSchema.parse(request.body)

  const item = await prisma.item.create({
    data: {
      imagemIdImagem: imagemIdImagem,
      nome: nome,
      descricao: descricao
    }
  })

  return response.status(201).json(item);
});

// Rota para pegar item
app.get("/itens/:id", async (request, response) => {
  const idItens = request.params.id;

  const item = await prisma.item.findUniqueOrThrow({
    select: {
      imagemIdImagem: true,
      nome: true,
      descricao: true
    },
    where: {
      idItem: idItens
    }
  })

  return response.json(item);
})

// Rota para pegar todos os itens
app.get("/itens/", async (request, response) => {
  const itens = await prisma.item.findMany({
    select: {
      imagemIdImagem: true,
      nome: true,
      descricao: true
    }
  });

  return response.json(itens);
});

// Rota para inserção de personagens
app.post("/personagens", async (request, response) => {
  const {
    imagemIdImagem,
    nome,
    descricao
  } = PersonagemSchema.parse(request.body);

  const personagem = await prisma.personagem.create({
    data: {
      imagemIdImagem: imagemIdImagem,
      nome: nome,
      descricao: descricao
    }
  })

  return response.status(201).json(personagem);
})

// Rota para pegar personagem
app.get("/personagens/:id", async (request, response) => {
  const idPersonagens = request.params.id;

  const personagem = await prisma.personagem.findUniqueOrThrow({
    select: {
      imagemIdImagem: true,
      nome: true,
      descricao: true
    },
    where: {
      idPersonagem: idPersonagens
    }
  })

  return response.json(personagem);
})

// Rota para pegar todos os personagens
app.get("/personagens/", async (request, response) => {
  const personagens = await prisma.personagem.findMany({
    select: {
      imagemIdImagem: true,
      nome: true,
      descricao: true
    }
  });

  return response.json(personagens);
});

app.listen(3333)