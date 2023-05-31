import z from "zod";

export const singupSchema = z.object({
  idUsuario: z.string().optional(),
  nome: z.string()
    .min(5, {message: "O seu nome precisa ter mais de 5 caracteres"})
    .max(30, {message: "O seu nome precisa ter até 30 caracteres"}),
  email: z.string().email({message: "Seu email não contém um formato válido"})
    .min(4, {message: "Seu endereço de email deve ter ao menos 4 caracteres"})
    .max(255, {message: "Seu endereço de email deve ter menos de 256 caracteres"}),
  password: z.string()
    .min(4, {message: "Sua senha deve ter ao menos 4 caracteres"})
    .max(255, {message: "Sua senha deve ter menos de 256 caracteres"})
})