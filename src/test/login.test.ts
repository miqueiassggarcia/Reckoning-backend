const request = require("supertest");
import { app, prisma } from "../server";
import CryptoJS from "crypto-js";

const idUsuario = "d29d380b-77b4-48aa-93cf-3695570cf511";
let nome = "Fábio";
let email = "fabiofabio@gmail.com"
let password = "fabio123";

describe("Testando login", () => {
  describe("Testar rota post de usuario", () => {
    it("Deve criar um usuario", async () => {
        const res = await request(app).post("/singup").send({
            "idUsuario": `${idUsuario}`,
            "nome": `${nome}`,
            "email": `${email}`,
            "password": `${password}`
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.idUsuario).toBe(`${idUsuario}`);
        expect(res.body.nome).toBe(`${nome}`);
        expect(res.body.email).toBe(`${email}`);
    });
    it('Deve retornar status 400 se nada for cadastrado', async () => {
      const res = await request(app)
          .post('/singup')
          .send({});
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error", 'dados inválidos');
    });
    it('Deve retornar status 500 em caso de erro interno', async () => {
      // Simulando um erro interno no servidor
      jest.spyOn(prisma.usuario, 'findUnique').mockRejectedValueOnce(new Error('Erro interno'));
      const res = await request(app).post(`/singup/`).send({
          "idUsuario": `${idUsuario}`,
          "nome": `${nome}`,
          "email": `${email}`,
          "password": `${password}`
      });
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "ocorreu um erro ao cadastrar usuário");
    });
    it('Deve retornar status 409 se nada o email já existir em outro cadastro', async () => {
      const res = await request(app)
          .post('/singup')
          .send({
            "idUsuario": `${idUsuario}`,
            "nome": `${nome}`,
            "email": `${email}`,
            "password": `${password}`
          });
      expect(res.statusCode).toBe(409);
      expect(res.body).toHaveProperty("error", 'email já usado, não é possível criar o usuário');
    });
    it('Deve retornar status 500 em caso de erro interno', async () => {
      // Simulando um erro interno no servidor
      jest.spyOn(prisma.usuario, 'create').mockRejectedValueOnce(new Error('Erro interno'));
      const res = await request(app).post(`/singup/`).send({
          "idUsuario": `${idUsuario}`,
          "nome": `${nome}`,
          "email": `fabio${email}`,
          "password": `${password}`
      });
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "ocorreu um erro ao cadastrar usuário");
    });
  });


  describe("Testar rota get de usuario", () => {
    it("Deve retornar o usuario correspondente", async () => {
        const res = await request(app).get(`/usuario/${idUsuario}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.nome).toBe(`${nome}`);
        expect(res.body.email).toBe(`${email}`);
        expect(res.body.hash).toBe(`${CryptoJS.SHA256(password).toString()}`);
    });
    it("Deve retornar erro de usuário não encontrado", async () => {
      const res = await request(app).get(`/usuario/${idUsuario}+a`);
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("error", "usuário não encontrado");
    });
    it('Deve retornar status 500 em caso de erro interno', async () => {
      // Simulando um erro interno no servidor
      jest.spyOn(prisma.usuario, 'findUnique').mockRejectedValueOnce(new Error('Erro interno'));
      const res = await request(app).get(`/usuario/${idUsuario}`);
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "ocorreu um erro ao encontrar usuário");
    });
  });


  describe("Testar rota de validar usuario", () => {
    it("Deve retornar se o usuário está validado", async () => {
        const res = await request(app).post(`/singin`).send({
          "email": `${email}`,
          "password": `${password}`
      });
        expect(res.statusCode).toBe(200);
        expect(res.body.validate).toBe(true);
    });
    it("Deve retornar status 400, dados inválidos", async () => {
      const res = await request(app).post(`/singin`).send({
        "email": `abcd`,
        "password": `abcd`
    });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("error", "Dados inválidos")
  });
    it('Deve retornar status 500 em caso de erro interno', async () => {
      // Simulando um erro interno no servidor
      jest.spyOn(prisma.usuario, 'findUnique').mockRejectedValueOnce(new Error('Erro interno'));
      const res = await request(app).post(`/singin`).send({
        "email": `${email}`,
        "password": `${password}`
      });
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "ocorreu um erro ao validar usuário");
    });
    it("Deve retornar que o usuário não existe", async () => {
      const res = await request(app).post(`/singin`).send({
        "email": `${email}fdisja`,
        "password": `${password}`
    });
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("error", "Usuário não encontrado");
    });
    it("Deve retornar que o usuário não existe", async () => {
      const res = await request(app).post(`/singin`).send({
        "email": `${email}`,
        "password": `${password}fdsjiafj`
    });
      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("validate", false);
    });
  });


  describe("Testar rota de deletar usuário", () => {
    it("Deve deletar o usuário solicitado", async () => {
        const res = await request(app).delete(`/usuario/${idUsuario}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.idUsuario).toBe(`${idUsuario}`);
        expect(res.body.nome).toBe(`${nome}`);
        expect(res.body.email).toBe(`${email}`);
    });
    it("Deve retornar que o usuário não existe", async () => {
      const res = await request(app).delete(`/usuario/${idUsuario}`);
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("error", 'usuário não encontrado.');
    });
    it('Deve retornar status 500 em caso de erro interno', async () => {
      // Simulando um erro interno no servidor
      jest.spyOn(prisma.usuario, 'findUnique').mockRejectedValueOnce(new Error('Erro interno'));
      const res = await request(app).delete(`/usuario/${idUsuario}`);
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("error", "ocorreu um erro ao deletar usuário");
    });
  });
});