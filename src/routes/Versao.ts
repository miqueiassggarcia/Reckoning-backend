import { PrismaClient } from "@prisma/client";
import { Express } from "express"
import { VersaoSchema } from "../validation/Versao";

module.exports = (app: Express, prisma: PrismaClient) => {
  // Rota para cadastro de uma nova versão
  app.post("/versao", async (request, response) => {
    const {
      nome,
      descricao,
      arquivo
    } = VersaoSchema.parse(request.body);

    const versao = await prisma.versao.create({
      data: {
        nome: nome,
        descricao: descricao,
        arquivo: arquivo
      }
    });

    return response.status(201).json(versao);
  });

  // Rota para pegar versao
  app.get("/versao/:id", async (request, response) => {
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

    return response.json(versao);
  })
}