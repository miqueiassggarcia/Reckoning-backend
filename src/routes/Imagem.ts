import { PrismaClient } from "@prisma/client";
import { Express } from "express"
import { ImagemSchema } from "../validation/Imagem";

module.exports = (app: Express, prisma: PrismaClient) => {
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
}