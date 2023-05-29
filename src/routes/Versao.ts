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
    return response.status(400).json({error: 'occoreu um erro ao cadastrar a versão'});
  }
});

  // Rota para pegar versao
  app.get("/versao/:id", async (request, response) => {
    try{
      const idVersao = request.params.id;

      const versao = await prisma.versao.findUniqueOrThrow({
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
      return response.json(versao);
    }catch(error){
      console.error('ocorreu um erro:', error);
      return response.status(500).json({error: 'occoreu um erro ao buscar as versões'});
    }
});

  // Rota para deletar versao
  app.delete("/versao/:id", async (request, response) => {
    try{
      const idVersao = request.params.id;

      const versao = await prisma.versao.delete({
        where: {
          idVersao: idVersao
        }
      });
      if (!versao) {
        return response.status(404).json({ error: 'Versão não encontrado.' });
      }
      return response.status(200).json(versao);
    }catch(error){
      console.error('ocorreu um erro:', error);
      return response.status(500).json({error: 'occoreu um erro ao deletar a versão'});
    }
});

  // Rota para atualizar versao
  app.put("/versao/:id", async (request, response) => {
    try{
      const {nome, arquivo, descricao, data} = VersaoSchema.partial().parse(request.body);

      if(nome || arquivo || descricao || data) {
        const idVersao = request.params.id;

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
        });
        if (!versao) {
          return response.status(404).json({ error: 'Versão não encontrada.' });
        }
        return response.json(versao);
      } else {
        return response.status(400).json({"message": "Nada foi modificado"})
      }
    }catch(error){
      console.error('ocorreu um erro:', error);
      return response.status(500).json({error: 'occoreu um erro ao modificar a versão'});
    }
});
}
