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

      try {
        const novaImagem = await prisma.imagem.create({
          data: {
            idImagem: idImagem,
            imagem: imagem
          }
        });

        return response.status(201).json(novaImagem);
      } catch(error) {
        //console.error("ocorreu um erro:", error);
        return response.status(500).json({"error": "ocorreu um erro ao cadastrar a imagem"})
      }
    }catch(error){
      //console.error('ocorreu um erro:', error);
      return response.status(400).json({"error": 'dados inválidos'});
    }
});

  // Rota para pegar imagem
  app.get("/imagem/:id", async (request, response) => {
    try{
      const idImagem = request.params.id;

      const imagem = await prisma.imagem.findUnique({
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
      //console.error('ocorreu um erro:', error);
      return response.status(500).json({"error": 'ocorreu um erro ao buscar imagem'});
    }
});

// Rota para pegar id de imagem
app.get("/search/imagem", async (request, response) => {
  const imagem = request.query.imagem;

  if(!imagem) {
    response.status(400).json({"message": "Dados não encontrados"})
  } else {
    if(typeof(imagem) == "string") {
      try{
        const imagemID = await prisma.imagem.findFirstOrThrow({
          select: {
            idImagem: true
          },
          where: {
            imagem: imagem,
          }
        });

        if (!imagemID) {
          return response.status(404).json({ error: 'Feedback não encontrado.' });
        }
        return response.json(imagemID);
      }catch(error){
        //console.error('ocorreu um erro:', error);
        return response.status(500).json({error: 'occoreu um erro ao procurar a imagem'});
      }
    } else {
      response.status(400).json({"message": "Formato de dados incompativel"})
    }
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
      //console.error('ocorreu um erro:', error);
      return response.status(500).json({"error": 'occoreu um erro ao buscar imagens'});
    }
});

  // Rota para deletar imagem
  app.delete("/imagem/:id", async (request, response) => {
    try{
      const idImagem = request.params.id;

      const imagemExiste = await prisma.imagem.findUnique({
        where: {
          idImagem: idImagem
        }
      });
      
      if (imagemExiste) {
        const imagem = await prisma.imagem.delete({
          where: {
            idImagem: idImagem
          }
        })

        return response.json(imagem);
      } else {
        return response.status(404).json({ error: 'imagem não encontrada.' });
      }
    }catch(error){
      //console.error('ocorreu um erro:', error);
      return response.status(500).json({error: 'occoreu um erro ao deletar imagem'});
    }
});

  // Rota para atualizar imagem
  app.put("/imagem/:id", async (request, response) => {
    try{
    const {idImagem, imagem} = ImagemSchema.partial().parse(request.body);

    if(idImagem || imagem) {
      const idImagem = request.params.id;

      const imagemExiste = await prisma.imagem.findUnique({
        where: {
          idImagem: idImagem
        }
      });
      
      if (imagemExiste) {
        const novaImagem = await prisma.imagem.update({
          where: {
            idImagem: idImagem
          },
          data: {
            imagem: imagem
          }
        });
        return response.json(novaImagem);
      
      } else {
        return response.status(404).json({ "error": 'imagem não encontrada.' });
      }
    } else {
      return response.status(400).json({"message": "Nada foi modificado"})
    }
  }catch(error){
    //console.error('ocorreu um erro:', error);
    return response.status(500).json({"error": 'ocorreu um erro ao modificar imagem'});
  }
  });
}
