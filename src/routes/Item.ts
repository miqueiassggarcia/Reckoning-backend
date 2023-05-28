import { PrismaClient } from "@prisma/client";
import { Express } from "express"
import { ItensSchema } from "../validation/Itens";

module.exports = (app: Express, prisma: PrismaClient) => {
  // Rota para inserção de itens
  app.post("/item", async (request, response) => {
    const {
      imagemIdImagem,
      nome,
      descricao
    } = ItensSchema.parse(request.body)

    const novoItem = await prisma.item.create({
      data: {
        imagemIdImagem: imagemIdImagem,
        nome: nome,
        descricao: descricao
      }
    })

    return response.status(201).json(novoItem);
  });

  // Rota para pegar item
  app.get("/item/:id", async (request, response) => {
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
  app.get("/item/", async (request, response) => {
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

  // Rota para atualizar imagem
  app.put("/item/:id", async (request, response) => {
    const { descricao, imagemIdImagem, nome } = ItensSchema.partial().parse(request.body);

    if(descricao || imagemIdImagem || nome) {
      const idItem = request.params.id;

      const novoItem = await prisma.item.update({
        where: {
          idItem: idItem
        },
        data: {
          descricao: descricao,
          imagemIdImagem: imagemIdImagem,
          nome: nome
        }
      })

      return response.json(novoItem);
    } else {
      return response.json({"message": "Nada foi modificado"})
    }
  });
}
