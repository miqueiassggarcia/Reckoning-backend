const request = require("supertest");
import { app, server } from "../server";

afterAll(() => {
  server.close();
})

const currentDateTime = new Date();
const idVersao = "15a6181e-7d7d-406a-a214-334ed1967d3d";
let nome = "Update do boss";
let descricao = "Adiciona um novo boss na fase final";
let data = currentDateTime.toISOString();
let arquivo = "https://reckoning-version1.1.2"

describe("Testar rota post de versao", () => {
  it("Deve criar uma versao", async () => {
    const res = await request(app).post("/versao").send({
      "idVersao": `${idVersao}`,
      "nome": `${nome}`,
      "descricao": `${descricao}`,
      "data": `${data}`,
      "arquivo": `${arquivo}`
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.idVersao).toBe(`${idVersao}`);
    expect(res.body.nome).toBe(`${nome}`);
    expect(res.body.descricao).toBe(`${descricao}`);
    expect(res.body.data).toBe(`${data}`);
    expect(res.body.arquivo).toBe(`${arquivo}`);
  });
});


describe("Testar rota get de uma versao", () => {
  it("Deve responder uma versao", async () => {
    const res = await request(app).get(`/versao/${idVersao}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.nome).toBe(`${nome}`);
    expect(res.body.descricao).toBe(`${descricao}`);
    expect(res.body.data).toBe(`${data}`);
    expect(res.body.arquivo).toBe(`${arquivo}`);
  });
});

describe("Testar rota get de listar as versoes", () => {
  it("Deve listar todas as versoes", async () => {
    const res = await request(app).get("/versao");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe("Testar rota de atualizar a versao", () => {
  it("Deve atualizar a versao", async () => {
    nome = "Update do boss aranha"
    descricao = "Adiciona um boss aranha na fase final"
    data = currentDateTime.toISOString();
    arquivo = "https://reckoning-version1.1.2"
    const res = await request(app).put(`/versao/${idVersao}`).send({
        "nome": `${nome}`,
        "descricao": `${descricao}`,
        "data": `${data}`,
        "arquivo": `${arquivo}`
    });


    expect(res.statusCode).toBe(200);
    expect(res.body.nome).toBe(`${nome}`);
    expect(res.body.descricao).toBe(`${descricao}`);
    expect(res.body.data).toBe(`${data}`);
    expect(res.body.arquivo).toBe(`${arquivo}`);
  });
});

describe("Testar rota de deletar feedback", () => {
  it("Deve deletar o feedback solicitado", async () => {
    const res = await request(app).delete(`/versao/${idVersao}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.idVersao).toBe(`${idVersao}`);
    expect(res.body.nome).toBe(`${nome}`);
    expect(res.body.descricao).toBe(`${descricao}`);
    expect(res.body.data).toBe(`${data}`);
    expect(res.body.arquivo).toBe(`${arquivo}`);
  });
});