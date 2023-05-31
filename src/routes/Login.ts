import { PrismaClient } from "@prisma/client";
import { Express } from "express";
import { singupSchema } from "../validation/Login";

module.exports = (app: Express, prisma: PrismaClient) => {
  app.post("/singup", async (request, response) => {
    try {
    const {idUsuario, nome, email, password} = singupSchema.parse(request.body);
    
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
          //console.error("ocorreu um erro ao cadastrar usuário", error);
          response.status(500).json({"error": "ocorreu um erro ao cadastrar usuário"})
        }
      } else {
        //console.error("Usuário já existe")
        response.status(409).json({"error": "Email já usado, não é possível criar o usuário"})
      }
    } catch(error) {
      //console.error("ocorreu um erro ao cadastrar usuário", error);
      response.status(500).json({"error": "ocorreu um erro ao cadastrar usuário"})
    }
  })
}