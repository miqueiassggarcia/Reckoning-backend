import { PrismaClient } from "@prisma/client";
import { Express } from "express"
import { VersaoSchema } from "../validation/Versao";

module.exports = (app: Express, prisma: PrismaClient) => {
  // Rota para cadastro de uma nova versão
  app.post("/versao", async (request, response) => {
    try{
      const {
        idVersao,
        nome,
        descricao,
        data,
        arquivo
      } = VersaoSchema.parse(request.body);

      try{
        const versao = await prisma.versao.create({
        data: {
          idVersao: idVersao,
          nome: nome,
          descricao: descricao,
          data: data,
          arquivo: arquivo
        }
      });
      return response.status(201).json(versao);
    }catch(error){
      console.error('ocorreu um erro:', error);
      return response.status(500).json({"error": 'ocorreu um erro ao cadastrar versão'});
    }
    }catch(error){
    console.error('ocorreu um erro:', error);
    return response.status(400).json({"error": 'Dados invalidos.'});
  }
});

  // Rota para pegar versao
  app.get("/versao/:id", async (request, response) => {
    try{
      const idVersao = request.params.id;

      const versao = await prisma.versao.findUnique({
        select: {
          nome: true,
          descricao: true,
          data: true,
          arquivo: true
        },
        where: {
          idVersao: idVersao
        }
      });
      if (!versao) {
        return response.status(404).json({ error: 'Versão não encontrado.' });
      }
      return response.json(versao);
    }catch(error){
      console.error('ocorreu um erro:', error);
      return response.status(500).json({error: 'occoreu um erro ao buscar a versão'});
    }
});

  // Rota para pegar id de versao
  app.get("/search/versao", async (request, response) => {
    const nome = request.query.nome;
    const descricao = request.query.descricao;
    const data = request.query.data;
    const arquivo = request.query.arquivo;

    if(!nome || !descricao || !data || !arquivo) {
      response.status(400).json({"message": "Dados não encontrados"})
    } else {
      if(typeof(nome) == "string" && typeof(descricao) == "string" && typeof(data) == "string" && typeof(arquivo) == "string") {
        try{
          const versaoID = await prisma.versao.findFirstOrThrow({
            select: {
              idVersao: true
            },
            where: {
              nome: nome,
              descricao: descricao,
              data: data,
              arquivo: arquivo
            }
          });

          if (!versaoID) {
            return response.status(404).json({ error: 'Feedback não encontrado.' });
          }
          return response.json(versaoID);
        }catch(error){
          console.error('ocorreu um erro:', error);
          return response.status(500).json({error: 'occoreu um erro ao procurar a versão'});
        }
      } else {
        response.status(400).json({"message": "Formato de dados incompativel"})
      }
    }
  });
  
  // Rota para pegar todas as versões(acho que nem precisa)
  app.get("/versao/", async (request, response) => {
    try{
      const versao = await prisma.versao.findMany({
        select: {
          nome: true,
          descricao:true,
          data: true,
          arquivo: true
        }
      });
      return response.status(200).json(versao);
    }catch(error){
      console.error('ocorreu um erro:', error);
      return response.status(500).json({"error": 'ocorreu um erro ao buscar as versões'});
    }
});

  // Rota para deletar versao
  app.delete("/versao/:id", async (request, response) => {
    try{
      const idVersao = request.params.id;

      const versaoexiste = await prisma.versao.findUnique({
        where: {
          idVersao: idVersao
        }
      });
      if (versaoexiste) {
        const versao = await prisma.versao.delete({
          where: {
            idVersao: idVersao
          }
        });
        return response.status(200).json(versao);
      }
      else{
        return response.status(404).json({"error": 'Versão não encontrada.'})
      }
    }catch(error){
      console.error('ocorreu um erro:', error);
      return response.status(500).json({"error": 'ocorreu um erro ao deletar a versão'});
    }
});

  // Rota para atualizar versao
  app.put("/versao/:id", async (request, response) => {
    try{
      const {nome, arquivo, descricao, data} = VersaoSchema.partial().parse(request.body);
      if(nome || arquivo || descricao || data) {
        const idVersao = request.params.id;

        const versaoexiste = await prisma.versao.findUnique({
          where: {
            idVersao: idVersao
          }
        });
        if (versaoexiste) {
          const versao = await prisma.versao.update({
            where: {
              idVersao: idVersao
            },
            data: {
              nome: nome,
              arquivo: arquivo,
              data: data,
              descricao: descricao
            }
          })
          return response.status(200).json(versao);
        }
        if (!versaoexiste){
          return response.status(404).json({ "error": 'Versão não encontrado.' });
        }
      } else {
        return response.status(400).json({"message": "Nada foi modificado"})
      }
    }catch(error){
      console.error('ocorreu um erro:', error);
      return response.status(500).json({"error": 'ocorreu um erro ao modificar a versão'});
    }
});
}
