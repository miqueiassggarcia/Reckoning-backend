import { PrismaClient } from "@prisma/client";
import { Express } from "express"
import { FeedbackSchema } from "../validation/Feedback";

module.exports = (app: Express, prisma: PrismaClient) => {
  // Rota para cadastro de um feedback
  app.post("/feedback", async (request, response) => {
    try {
      const {
        idFeedback,
        atribuicao,
        feedback,
      } = FeedbackSchema.parse(request.body);

      const feedbacks = await prisma.feedback.create({
        data: {
          idFeedback: idFeedback,
          atribuicao: atribuicao,
          feedback: feedback
        }
      });
      return response.status(201).json(feedbacks);
    }catch(error){
      console.error('ocorreu um erro:', error);
      return response.status(400).json({error: 'occoreu um erro ao cadastrar o feedback'});
    }
  });


  // Rota para pegar feedback
  app.get("/feedback/:id", async (request, response) => {
    try{
      const idFeedback = request.params.id;

      const feedback = await prisma.feedback.findUniqueOrThrow({
        select: {
          atribuicao: true,
          feedback: true
        },
        where: {
          idFeedback: idFeedback
        }
      });
      if (!feedback) {
        return response.status(404).json({ error: 'Feedback não encontrado.' });
      }
      return response.json(feedback);
    }catch(error){
      console.error('ocorreu um erro:', error);
      return response.status(500).json({error: 'occoreu um erro ao procurar o feedback'});
    }
  });


  // Rota para pegar id de feedback
  app.get("/search/feedback", async (request, response) => {
    const atribuicao = request.query.atribuicao;
    const feedback = request.query.feedback;

    if(!atribuicao || !feedback) {
      response.status(400).json({"message": "Dados não encontrados"})
    } else {
      if(typeof(atribuicao) == "string" && typeof(feedback) == "string") {
        try{
          const feedbackID = await prisma.feedback.findFirstOrThrow({
            select: {
              idFeedback: true
            },
            where: {
              atribuicao: atribuicao,
              feedback: feedback
            }
          });

          if (!feedbackID) {
            return response.status(404).json({ error: 'Feedback não encontrado.' });
          }
          return response.json(feedbackID);
        }catch(error){
          console.error('ocorreu um erro:', error);
          return response.status(500).json({error: 'occoreu um erro ao procurar o feedback'});
        }
      } else {
        response.status(400).json({"message": "Formato de dados incompativel"})
      }
    }
  });


  // Rota para pegar todos os feedbacks
  app.get("/feedback/", async (request, response) => {
    try{
      const feedbacks = await prisma.feedback.findMany({
        select: {
          atribuicao: true,
          feedback: true
        }
      });
      return response.status(200).json(feedbacks);
    }catch(error){
      console.error('ocorreu um erro:', error);
      return response.status(500).json({error: 'occoreu um erro ao procurar os feedbacks'});
    }
  });


  // Rota para deletar feedback
  app.delete("/feedback/:id", async (request, response) => {
    try{
      const idFeedback = request.params.id;

      const feedback = await prisma.feedback.delete({
        where: {
          idFeedback: idFeedback
        }
      });
      if (!feedback) {
        return response.status(404).json({ error: 'Feedback não encontrado.' });
      }
      return response.status(200).json(feedback);
    }catch(error){
      console.error('ocorreu um erro:', error);
      return response.status(500).json({error: 'occoreu um erro ao deletar o feedback'});
    }
  });


  // Rota para atualizar feedback
  app.put("/feedback/:id", async (request, response) => {
    try{
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
        });
        if (!feedback) {
          return response.status(404).json({ error: 'Feedback não encontrado.' });
        }
        return response.status(200).json(novoFeedback);
      } else {
        return response.status(400).json({"message": "Nada foi modificado"})
      }
    }catch(error){
      console.error('ocorreu um erro:', error);
      return response.status(500).json({error: 'occoreu um erro ao atualizar o feedback'});
    }
  });
}
