const request = require("supertest");
import { app, server } from "../server";

const idItem = "d29d380b-99b4-48aa-93cf-3695570cf511";
let imagemIdImagem = "64517b59-ed1c-415b-8212-8c4d6ff755a2";
let nome = "Ak-47";
let descricao = "Metralhadora";

describe("Testar rota post de itens", () => {
  it("Deve criar um item", async () => {
    const res = await request(app).post("/item").send({
      "idItem": `${idItem}`,
      "imagemIdImagem": `${imagemIdImagem}`,
      "nome": `${nome}`,
      "descricao": `${descricao}`
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.idItem).toBe(`${idItem}`);
    expect(res.body.imagemIdImagem).toBe(`${imagemIdImagem}`);
    expect(res.body.nome).toBe(`${nome}`);
    expect(res.body.descricao).toBe(`${descricao}`);
  });
});


describe("Testar rota get de 1 item", () => {
  it("Deve responder um item", async () => {
    const res = await request(app).get(`/item/${idItem}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.imagemIdImagem).toBe(`${imagemIdImagem}`);
    expect(res.body.nome).toBe(`${nome}`);
    expect(res.body.descricao).toBe(`${descricao}`);
  });
});

describe("Testar rota get de listar todos os itens", () => {
  it("Deve listar todos os itens", async () => {
    const res = await request(app).get("/item");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe("Testar rota de atualizar item", () => {
  it("Deve atualizar o item solicitado", async () => {
    imagemIdImagem = "857b3062-bb7a-458d-8587-d0e4e2c13f6e";
    nome = "Handgun";
    descricao = "Pistola";
    const res = await request(app).put(`/item/${idItem}`).send({
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

describe("Testar rota de deletar item", () => {
  it("Deve deletar o item solicitado", async () => {
    const res = await request(app).delete(`/item/${idItem}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.idItem).toBe(`${idItem}`);
    expect(res.body.imagemIdImagem).toBe(`${imagemIdImagem}`);
    expect(res.body.nome).toBe(`${nome}`);
    expect(res.body.descricao).toBe(`${descricao}`);
  });
});

server.close();