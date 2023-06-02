import { PrismaClient } from "@prisma/client";
import { Express } from "express";
import CryptoJS from "crypto-js";
import { singinSchema, singupSchema } from "../validation/Login";

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
          response.status(409).json({"error": "email já usado, não é possível criar o usuário"})
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

  // Rota para validar usuário
  app.post("/singin", async (request, response) => {
    const { email, password } = singinSchema.parse(request.body);

    try {
      const usuario = await prisma.usuario.findUnique({
        select: {
          hash: true
        },
        where: {
          email: email
        }
      })

      if(usuario) {
        if(usuario.hash === CryptoJS.SHA256(password).toString()) {
          return response.json({ "validate": true })
        } else {
          return response.status(401).json({ "validate": false })
        }
      } else {
        response.status(404).json({"error": "Usuário não encontrado"});
      }
    } catch(error) {
      //console.error("ocorreu um erro:", error);
      response.status(500).json({"error": "ocorreu um erro ao encontrar usuário"})
    }
  })

  // Rota de deletar usuário
  app.delete("/usuario/:id", async (request, response) => {
    try{
      const idUsuario = request.params.id;

      const usuarioExiste = await prisma.usuario.findUnique({
        where: {
          idUsuario: idUsuario
        }
      });

      if (usuarioExiste) {
        const usuario = await prisma.usuario.delete({
          select: {
            idUsuario: true,
            nome: true,
            email: true
          },
          where:{
            idUsuario: idUsuario
          }
        });

        return response.status(200).json(usuario);
      }
      else{
        return response.status(404).json({ "error": 'usuário não encontrado.' });
      }
    }catch(error){
      //console.error('ocorreu um erro:', error);
      return response.status(500).json({"error": 'ocorreu um erro ao deletar usuário'});
    }
  });

//   // Rota para atualizar imagem
//   app.put("/personagem/:id", async (request, response) => {
//     try{
//       const { descricao, imagemIdImagem, nome } = PersonagemSchema.partial().parse(request.body);

//       if(descricao || imagemIdImagem || nome) {
//         const idPersonagem = request.params.id;

//         const novoPersonagem = await prisma.personagem.findUnique({
//           where: {
//             idPersonagem: idPersonagem
//           }
//         });
//         if (novoPersonagem) {
//           const personagem = await prisma.personagem.update({
//             where: {
//               idPersonagem: idPersonagem
//             },
//             data: {
//               imagemIdImagem: imagemIdImagem,
//               descricao: descricao,
//               nome: nome
//             }
//           });
//           return response.status(200).json(personagem);
//         }
//         if(!novoPersonagem){
//           return response.status(404).json({ "error": 'Personagem não encontrado.' });
//         }
//       } else {
//         return response.status(400).json({"error": "Nada foi modificado"})
//       }
//     }catch(error){
//       //console.error('ocorreu um erro:', error);
//       return response.status(500).json({"error": 'ocorreu um erro ao atualizar personagem'});
//     }
//   });
}