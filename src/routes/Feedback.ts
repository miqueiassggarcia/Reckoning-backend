import { PrismaClient } from "@prisma/client";
import { Express } from "express"
import { FeedbackSchema } from "../validation/Feedback";

module.exports = (app: Express, prisma: PrismaClient) => {
  // Rota para cadastro de um feedback
  app.post("/feedback", async (request, response) => {
    const {
      atribuicao,
      feedback,
    } = FeedbackSchema.parse(request.body);

    const feedbacks = await prisma.feedback.create({
      data: {
        atribuicao: atribuicao,
        feedback: feedback
      }
    });

    return response.status(201).json(feedbacks);
  });

  // Rota para pegar feedback
  app.get("/feedback/:id", async (request, response) => {
    const idFeedback = request.params.id;

    const feedback = await prisma.feedback.findUniqueOrThrow({
      select: {
        atribuicao: true,
        feedback: true
      },
      where: {
        idFeedback: idFeedback
      }
    })

    return response.json(feedback);
  })


  // Rota para pegar todos os feedbacks
  app.get("/feedback/", async (request, response) => {
    const feedbacks = await prisma.feedback.findMany({
      select: {
        atribuicao: true,
        feedback: true
      }
    });

    return response.json(feedbacks);
  });

  // Rota para deletar feedback
  app.delete("/feedback/:id", async (request, response) => {
    const idFeedback = request.params.id;

    const feedback = await prisma.feedback.delete({
      where: {
        idFeedback: idFeedback
      }
    })

    return response.json(feedback);
  });

  // Rota para atualizar imagem
  app.put("/item/:id", async (request, response) => {
    const { atribuicao, feedback } = FeedbackSchema.partial().parse(request.body);

    if(atribuicao || feedback) {
      const idFeedback = request.params.id;

      const novoFeedback = await prisma.feedback.update({
        where: {
          idFeedback: idFeedback
        },
        data: {
          atribuicao: atribuicao,
          feedback: feedback
        }
      })

      return response.json(novoFeedback);
    } else {
      return response.json({"message": "Nada foi modificado"})
    }
  });
}