import { PrismaClient } from "@prisma/client";
import { Express } from "express"
import { ItensSchema } from "../validation/Itens";

module.exports = (app: Express, prisma: PrismaClient) => {
  // Rota para inserção de itens
  app.post("/item", async (request, response) => {
    try{
      const {
        idItem,
        imagemIdImagem,
        nome,
        descricao
      } = ItensSchema.parse(request.body)

      const novoItem = await prisma.item.create({
        data: {
          idItem: idItem,
          imagemIdImagem: imagemIdImagem,
          nome: nome,
          descricao: descricao
        }
      });
      return response.status(201).json(novoItem);
    }catch(error){
      console.error('ocorreu um erro:', error);
      return response.status(400).json({error: 'occoreu um erro ao cadastrar item'});
    }
});

  // Rota para pegar item
  app.get("/item/:id", async (request, response) => {
    try{
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
      });
      if (!item) {
        return response.status(404).json({ error: 'Item não encontrado.' });
      }
      return response.json(item);
    }catch(error){
      console.error('ocorreu um erro:', error);
      return response.status(500).json({error: 'occoreu um erro ao procurar o item'});
    }
  });

  // Rota para pegar todos os itens
  app.get("/item/", async (request, response) => {
    try{
      const itens = await prisma.item.findMany({
        select: {
          imagemIdImagem: true,
          nome: true,
          descricao: true
        }
      });
      return response.json(itens);
    }catch(error){
      console.error('ocorreu um erro:', error);
      return response.status(500).json({error: 'occoreu um erro ao procurar os itens'});
    }
});
  
  // Rota para deletar Item
  app.delete("/item/:id", async (request, response) => {
    try{
      const idItem = request.params.id;

      const item = await prisma.item.delete({
        where: {
          idItem: idItem
        }
      });
      if (!item) {
        return response.status(404).json({ error: 'Item não encontrado.' });
      }
      return response.json(item);
    }catch(error){
      console.error('ocorreu um erro:', error);
      return response.status(500).json({error: 'occoreu um erro ao deletar item'});
    }
  });

  // Rota para atualizar imagem
  app.put("/item/:id", async (request, response) => {
    try{
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
        });
        if (!novoItem) {
          return response.status(404).json({ error: 'Item não encontrado.' });
        }
        return response.json(novoItem);
      } else {
        return response.status(400).json({"message": "Nada foi modificado"})
      }
    }catch(error){
      console.error('ocorreu um erro:', error);
      return response.status(500).json({error: 'occoreu um erro ao modificar item'});
    }
});
}
