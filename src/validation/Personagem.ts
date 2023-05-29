import z from "zod";

export const PersonagemSchema = z.object({
    idPersonagem: z.string().optional(),
    imagemIdImagem: z.string()
    .min(32, { message: "O id da imagem está fora do intervalo mínimo" })
    .max(300, { message: "O id da imagem está fora do intervalo máximo" }),
nome: z.string()
    .min(1, {message: "O nome precisa conter ao menos 1 caractere"})
    .max(300, {message: "O nome precisa conter menos de 300 caracteres"}),
descricao: z.string()
    .min(1, {message: "A descrição precisa conter ao menos 1 caractere"})
    .max(500, {message: "A descrição precisa ter menos de 500 caracteres"})
});