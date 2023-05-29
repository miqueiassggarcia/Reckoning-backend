import { PrismaClient } from "@prisma/client";
import { Express } from "express"
import { PersonagemSchema } from "../validation/Personagem";

module.exports = (app: Express, prisma: PrismaClient) => {
  // Rota para inserção de personagens
  app.post("/personagem", async (request, response) => {
    try{
      const {
        idPersonagem,
        imagemIdImagem,
        nome,
        descricao
      } = PersonagemSchema.parse(request.body);

      const personagem = await prisma.personagem.create({
        data: {
          idPersonagem: idPersonagem,
          imagemIdImagem: imagemIdImagem,
          nome: nome,
          descricao: descricao
        }
      });
      return response.status(201).json(personagem);
    }catch(error){
      console.error('ocorreu um erro:', error);
      return response.status(400).json({error: 'occoreu um erro ao cadastrar o personagem'});
    }
});

  // Rota para pegar personagem
  app.get("/personagem/:id", async (request, response) => {
    try{
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
      });
      if (!personagem) {
        return response.status(404).json({ error: 'Personagem não encontrado.' });
      }
      return response.json(personagem);
    }catch(error){
      console.error('ocorreu um erro:', error);
      return response.status(500).json({error: 'occoreu um erro ao buscar personagem'});
    }
  });

  // Rota para pegar todos os personagens
  app.get("/personagem/", async (request, response) => {
    try{
      const personagens = await prisma.personagem.findMany({
        select: {
          imagemIdImagem: true,
          nome: true,
          descricao: true
        }
      });
      return response.json(personagens);
    }catch(error){
      console.error('ocorreu um erro:', error);
      return response.status(500).json({error: 'occoreu um erro ao buscar personagens'});
    }
  });
  
  // Rota para deletar personagem
  app.delete("/personagem/:id", async (request, response) => {
    try{
      const idPersonagem = request.params.id;

      const personagem = await prisma.personagem.delete({
        where: {
          idPersonagem: idPersonagem
        }
      });
      if (!personagem) {
        return response.status(404).json({ error: 'Personagem não encontrado.' });
      }
      return response.json(personagem);
    }catch(error){
      console.error('ocorreu um erro:', error);
      return response.status(500).json({error: 'occoreu um erro ao deletar personagem'});
    }
  });

  // Rota para atualizar imagem
  app.put("/personagem/:id", async (request, response) => {
    try{
      const { descricao, imagemIdImagem, nome } = PersonagemSchema.partial().parse(request.body);

      if(descricao || imagemIdImagem || nome) {
        const idPersonagem = request.params.id;

        const novoPersonagem = await prisma.personagem.update({
          where: {
            idPersonagem: idPersonagem
          },
          data: {
            imagemIdImagem: imagemIdImagem,
            descricao: descricao,
            nome: nome
          }
        });
        if (!novoPersonagem) {
          return response.status(404).json({ error: 'Personagem não encontrado.' });
        }
        return response.json(novoPersonagem);
      } else {
        return response.status(400).json({"message": "Nada foi modificado"})
      }
    }catch(error){
      console.error('ocorreu um erro:', error);
      return response.status(500).json({error: 'occoreu um erro ao atualizar personagem'});
    }
  });
}
