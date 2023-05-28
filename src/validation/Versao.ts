import z from "zod";

export const VersaoSchema = z.object({
    nome: z.string()
        .min(1, { message: "Seu nome pracisa conter ao menos 1 caractere" })
        .max(50, { message: "Seu nome tem que ter menos de 50 caracteres" }),
    descricao: z.string()
        .min(1, { message: "Sua descricao pracisa conter ao menos 1 caractere" })
        .max(300, { message: "Sua descricao tem que ter menos de 300 caracteres" }),
    arquivo: z.string()
        .min(1, { message: "Seu arquivo pracisa conter ao menos 1 caractere" })
        .max(300, { message: "Seu arquivo tem que ter menos de 300 caracteres" })
});