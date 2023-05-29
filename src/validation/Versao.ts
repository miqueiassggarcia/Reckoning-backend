import z from "zod";

export const VersaoSchema = z.object({
    idVersao: z.string().optional(),
    nome: z.string()
        .min(1, { message: "Seu nome pracisa conter ao menos 1 caractere" })
        .max(50, { message: "Seu nome tem que ter menos de 50 caracteres" }),
    descricao: z.string()
        .min(1, { message: "Sua descricao pracisa conter ao menos 1 caractere" })
        .max(300, { message: "Sua descricao tem que ter menos de 300 caracteres" }),
    data: z.string().refine((value) => {
        // Use a regular expression to validate the format
        const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
        return regex.test(value);
      }, 'Invalid date and time format').optional(),
    arquivo: z.string()
        .min(1, { message: "Seu arquivo pracisa conter ao menos 1 caractere" })
        .max(300, { message: "Seu arquivo tem que ter menos de 300 caracteres" })
});