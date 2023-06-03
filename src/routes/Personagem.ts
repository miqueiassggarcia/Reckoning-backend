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

      try{
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
      //console.error('ocorreu um erro:', error);
      return response.status(500).json({"error": 'ocorreu um erro ao cadastrar personagem'});
    }
    }catch(error){
      //console.error('ocorreu um erro:', error);
      return response.status(400).json({"error": 'Dados invalidos.'});
    }
});

  // Rota para pegar personagem
  app.get("/personagem/:id", async (request, response) => {
    try{
      const idPersonagens = request.params.id;

      const personagem = await prisma.personagem.findUnique({
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
        return response.status(404).json({ "error": 'Personagem não encontrado.' });
      }
      return response.json(personagem);
    }catch(error){
      //console.error('ocorreu um erro:', error);
      return response.status(500).json({"error": 'ocorreu um erro ao buscar personagem'});
    }
  });

  // Rota para pegar id de personagem
  app.get("/search/personagem", async (request, response) => {
    const imagemIdimagem = request.query.imagemIdImagem;
    const nome = request.query.nome;
    const descricao = request.query.descricao;

    if(!imagemIdimagem || !nome || !descricao) {
      response.status(400).json({"message": "Dados incompletos ou formato incompativel"})
    } else {
      if(typeof(imagemIdimagem) == "string" && typeof(nome) == "string" && typeof(descricao) == "string") {
        try{
          const personagemID = await prisma.personagem.findFirst({
            select: {
              idPersonagem: true
            },
            where: {
              imagemIdImagem: imagemIdimagem,
              nome: nome,
              descricao: descricao
            }
          });

          if (!personagemID) {
            return response.status(404).json({ "error": 'Personagem não encontrado.' });
          }
          return response.json(personagemID);
        }catch(error){
          //console.error('ocorreu um erro:', error);
          return response.status(500).json({"error": 'ocorreu um erro ao procurar o personagem'});
        }
      }
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
      return response.status(200).json(personagens);
    }catch(error){
      //console.error('ocorreu um erro:', error);
      return response.status(500).json({"error": 'ocorreu um erro ao buscar personagens'});
    }
  });
  
  // Rota para deletar personagem
  app.delete("/personagem/:id", async (request, response) => {
    try{
      const idPersonagem = request.params.id;

      const personagemExiste = await prisma.personagem.findUnique({
        where: {
          idPersonagem: idPersonagem
        }
      });
      if (personagemExiste) {
        const personagem = await prisma.personagem.delete({
          where:{
            idPersonagem: idPersonagem
          }
        });
        return response.status(200).json(personagem);
      }
      else{
        return response.status(404).json({ "error": 'Personagem não encontrado.' });
      }
    }catch(error){
      //console.error('ocorreu um erro:', error);
      return response.status(500).json({"error": 'ocorreu um erro ao deletar personagem'});
    }
  });

  // Rota para atualizar imagem
  app.put("/personagem/:id", async (request, response) => {
    try{
      const { descricao, imagemIdImagem, nome } = PersonagemSchema.partial().parse(request.body);

      if(descricao || imagemIdImagem || nome) {
        const idPersonagem = request.params.id;

        const novoPersonagem = await prisma.personagem.findUnique({
          where: {
            idPersonagem: idPersonagem
          }
        });
        if (novoPersonagem) {
          const personagem = await prisma.personagem.update({
            where: {
              idPersonagem: idPersonagem
            },
            data: {
              imagemIdImagem: imagemIdImagem,
              descricao: descricao,
              nome: nome
            }
          });
          return response.status(200).json(personagem);
        } else {
          return response.status(404).json({ "error": 'Personagem não encontrado.' });
        }
      } else {
        return response.status(400).json({"error": "Nada foi modificado"})
      }
    }catch(error){
      //console.error('ocorreu um erro:', error);
      return response.status(500).json({"error": 'ocorreu um erro ao atualizar personagem'});
    }
  });
}
