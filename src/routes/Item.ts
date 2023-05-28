import { PrismaClient } from "@prisma/client";
import { Express } from "express"
import { ItensSchema } from "../validation/Itens";

module.exports = (app: Express, prisma: PrismaClient) => {
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
  
  // Rota para deletar Item
  app.delete("/item/:id", async (request, response) => {
    const idItem = request.params.id;

    const item = await prisma.item.delete({
      where: {
        idItem: idItem
      }
    })

    return response.json(item);
  });
}
