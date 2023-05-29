import z from "zod";

export const FeedbackSchema = z.object({
idFeedback: z.string().optional(),
atribuicao: z.string()
    .min(1, { message: "Sua atribuicao pracisa conter ao menos 1 caractere" })
    .max(100, { message: "Sua atribuicao tem que ter menos de 100 caracteres" }),
feedback: z.string()
    .min(1, { message: "Seu feedback pracisa conter ao menos 1 caractere" })
    .max(500, { message: "Seu feedback tem que ter menos de 500 caracteres" }),
});