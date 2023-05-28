import { PrismaClient } from "@prisma/client";
import { Express } from "express"
import { PersonagemSchema } from "../validation/Personagem";

module.exports = (app: Express, prisma: PrismaClient) => {
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
}