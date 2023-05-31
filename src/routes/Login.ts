import { PrismaClient } from "@prisma/client";
import { Express } from "express";
import CryptoJS from "crypto-js";
import { singupSchema } from "../validation/Login";

module.exports = (app: Express, prisma: PrismaClient) => {
  // Rota de cadastro de usuário
  app.post("/singup", async (request, response) => {
    try {
      const {idUsuario, nome, email, password} = singupSchema.parse(request.body);

      try {
        const usuarioExiste = await prisma.usuario.findUnique({
          where: {
            email: email
          }
        });

        if(!usuarioExiste) {
          const words = CryptoJS.SHA256(password);
          const hash = words.toString();

          try { 
            const usuario = await prisma.usuario.create({
              data: {
                idUsuario: idUsuario,
                nome: nome,
                email: email,
                hash: hash
              }
            });

            return response.status(201).json(usuario)
          } catch(error) {
            //console.error("ocorreu um erro ao cadastrar usuário:", error);
            response.status(500).json({"error": "ocorreu um erro ao cadastrar usuário"})
          }
        } else {
          //console.error("Usuário já existe")
          response.status(409).json({"error": "Email já usado, não é possível criar o usuário"})
        }
      } catch(error) {
        //console.error("ocorreu um erro ao cadastrar usuário:", error);
        response.status(500).json({"error": "ocorreu um erro ao cadastrar usuário"})
      }
    } catch (error) {
      //console.error("ocorreu um erro ao cadastrar usuário:", error);
      response.status(400).json({"error": "dados inválidos"})
    }
  })

  // Rota de pegar dados de usuário por id
  app.get("/usuario/:id", async (request, response) => {
    try {
      const idUsuario = request.params.id;

      const usuario = await prisma.usuario.findUnique({
        select: {
          nome: true,
          email: true,
          hash: true
        },
        where: {
          idUsuario: idUsuario
        }
      })
      
      if(!usuario) {
        response.status(404).json({"error": "Usuário não encontrado"});
      }

      response.json(usuario);
    } catch(error) {
      //console.error("ocorreu um erro:", error);
      response.status(500).json({"error": "ocorreu um erro ao encontrar usuário"})
    }
  })
}