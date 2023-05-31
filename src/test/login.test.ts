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
  });


  describe("Testar rota get de usuario", () => {
    it("Deve retornar o usuario correspondente", async () => {
        const res = await request(app).get(`/usuario/${idUsuario}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.nome).toBe(`${nome}`);
        expect(res.body.email).toBe(`${email}`);
        expect(res.body.hash).toBe(`${CryptoJS.SHA256(password).toString()}`);
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
  });
});