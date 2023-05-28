import { PrismaClient } from "@prisma/client";
import { Express } from "express"
import { ImagemSchema } from "../validation/Imagem";

module.exports = (app: Express, prisma: PrismaClient) => {
  // Rota para inserção de Imagem
  app.post("/imagem", async (request, response) => {
    const {
      imagem
    } = ImagemSchema.parse(request.body);

    const novaImagem = await prisma.imagem.create({
      data: {
        imagem: imagem
      }
    });

    return response.status(201).json(novaImagem);
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

// Rota para pegar todas as Imagens
  app.get("/imagem/", async (request, response) => {
    const imagem = await prisma.imagem.findMany({
      select: {
        imagem: true
      }
    });

    return response.json(imagem);
  });

  // Rota para deletar imagem
  app.delete("/imagem/:id", async (request, response) => {
    const idImagem = request.params.id;

    const imagem = await prisma.imagem.delete({
      where: {
        idImagem: idImagem
      }
    })

    return response.json(imagem);
  });

  // Rota para atualizar imagem
  app.put("/imagem/:id", async (request, response) => {
    const {imagem} = ImagemSchema.partial().parse(request.body);

    if(imagem) {
      const idImagem = request.params.id;

      const novaImagem = await prisma.imagem.update({
        where: {
          idImagem: idImagem
        },
        data: {
          imagem: imagem
        }
      })

      return response.json(novaImagem);
    } else {
      return response.json({"message": "Nada foi modificado"})
    }
  });
}
