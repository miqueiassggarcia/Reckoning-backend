import z from "zod";

export const ImagemSchema = z.object({
    idImagem: z.string().optional(),
    imagem: z.string()
    .min(1, { message: "Sua Imagem pracisa conter ao menos 1 caractere" })
    .max(300, { message: "Sua Imagem tem que ter menos de 300 caracteres" }),
});