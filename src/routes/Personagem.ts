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
  
  // Rota para deletar personagem
  app.delete("/personagem/:id", async (request, response) => {
    const idPersonagem = request.params.id;

    const personagem = await prisma.personagem.delete({
      where: {
        idPersonagem: idPersonagem
      }
    })

    return response.json(personagem);
  });

  // Rota para atualizar imagem
  app.put("/item/:id", async (request, response) => {
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
      })

      return response.json(novoPersonagem);
    } else {
      return response.json({"message": "Nada foi modificado"})
    }
  });
}
