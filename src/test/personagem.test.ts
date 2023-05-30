const request = require("supertest");
import { app } from "../server";

const idPersonagem = "32f2b3e4-01eb-452f-a36f-0c3cd796ecaf";
let imagemIdImagem = "64517b59-ed1c-415b-8212-8c4d6ff755a2";
let nome = "João da bike";
let descricao = "Aquele ali ó";

describe("Testar rota post de personagem", () => {
  it("Deve criar um personagem", async () => {
    const res = await request(app).post("/personagem").send({
      "idPersonagem": `${idPersonagem}`,
      "imagemIdImagem": `${imagemIdImagem}`,
      "nome": `${nome}`,
      "descricao": `${descricao}`
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.idPersonagem).toBe(`${idPersonagem}`);
    expect(res.body.imagemIdImagem).toBe(`${imagemIdImagem}`);
    expect(res.body.nome).toBe(`${nome}`);
    expect(res.body.descricao).toBe(`${descricao}`);
  });
});


describe("Testar rota get de 1 personagem", () => {
  it("Deve responder um personagem", async () => {
    const res = await request(app).get(`/personagem/${idPersonagem}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.imagemIdImagem).toBe(`${imagemIdImagem}`);
    expect(res.body.nome).toBe(`${nome}`);
    expect(res.body.descricao).toBe(`${descricao}`);
  });
});


describe("Testar rota get de listar todos os personagens", () => {
  it("Deve listar todos os personagens", async () => {
    const res = await request(app).get("/personagem");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});


imagemIdImagem = "857b3062-bb7a-458d-8587-d0e4e2c13f6e";
nome = "Luizin";
descricao = "Apenas luizin";


describe("Testar rota de atualizar personagem", () => {
  it("Deve atualizar o personagem solicitado", async () => {
    const res = await request(app).put(`/personagem/${idPersonagem}`).send({
      "imagemIdImagem": `${imagemIdImagem}`,
      "nome": `${nome}`,
      "descricao": `${descricao}`
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.imagemIdImagem).toBe(`${imagemIdImagem}`);
    expect(res.body.nome).toBe(`${nome}`);
    expect(res.body.descricao).toBe(`${descricao}`);
  });
});


describe("Testar rota de deletar personagem", () => {
  it("Deve deletar o personagem solicitado", async () => {
    const res = await request(app).delete(`/personagem/${idPersonagem}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.idPersonagem).toBe(`${idPersonagem}`);
    expect(res.body.imagemIdImagem).toBe(`${imagemIdImagem}`);
    expect(res.body.nome).toBe(`${nome}`);
    expect(res.body.descricao).toBe(`${descricao}`);
  });
});