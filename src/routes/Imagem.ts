import { PrismaClient } from "@prisma/client";
import { Express } from "express"
import { ImagemSchema } from "../validation/Imagem";

module.exports = (app: Express, prisma: PrismaClient) => {
  // Rota para inserção de Imagem
  app.post("/imagem", async (request, response) => {
    try{
      const {
        idImagem,
        imagem
      } = ImagemSchema.parse(request.body);

      const novaImagem = await prisma.imagem.create({
        data: {
          idImagem: idImagem,
          imagem: imagem
        }
      });

      return response.status(201).json(novaImagem);
    }catch(error){
      console.error('ocorreu um erro:', error);
      return response.status(400).json({error: 'occoreu um erro ao inserir imagem'});
    }
});

  // Rota para pegar imagem
  app.get("/imagem/:id", async (request, response) => {
    try{
      const idImagem = request.params.id;

      const imagem = await prisma.imagem.findUniqueOrThrow({
        select: {
          imagem: true
        },
        where: {
          idImagem: idImagem
        }
      });
      if (!imagem) {
        return response.status(404).json({ error: 'imagem não encontrada.' });
      }
      return response.json(imagem);
    }catch(error){
      console.error('ocorreu um erro:', error);
      return response.status(500).json({error: 'occoreu um erro ao buscar imagem'});
    }
});

// Rota para pegar todas as Imagens
  app.get("/imagem/", async (request, response) => {
    try{
      const imagem = await prisma.imagem.findMany({
        select: {
          imagem: true
        }
      });
      return response.json(imagem);
    }catch(error){
      console.error('ocorreu um erro:', error);
      return response.status(500).json({error: 'occoreu um erro ao buscar imagens'});
    }
});

  // Rota para deletar imagem
  app.delete("/imagem/:id", async (request, response) => {
    try{
      const idImagem = request.params.id;

      const imagem = await prisma.imagem.delete({
        where: {
          idImagem: idImagem
        }
      });
      if (!imagem) {
        return response.status(404).json({ error: 'imagem não encontrada.' });
      }
      return response.json(imagem);
    }catch(error){
      console.error('ocorreu um erro:', error);
      return response.status(500).json({error: 'occoreu um erro ao deletar imagem'});
    }
});

  // Rota para atualizar imagem
  app.put("/imagem/:id", async (request, response) => {
    try{
    const {idImagem, imagem} = ImagemSchema.partial().parse(request.body);

    if(idImagem || imagem) {
      const idImagem = request.params.id;

      const novaImagem = await prisma.imagem.update({
        where: {
          idImagem: idImagem
        },
        data: {
          imagem: imagem
        }
      });
      if (!imagem) {
        return response.status(404).json({ error: 'imagem não encontrada.' });
      }
      return response.json(novaImagem);
    } else {
      return response.status(400).json({"message": "Nada foi modificado"})
    }
  }catch(error){
    console.error('ocorreu um erro:', error);
    return response.status(500).json({error: 'occoreu um erro ao modificar imagem'});
  }
  });
}
