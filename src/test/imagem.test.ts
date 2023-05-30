const request = require("supertest");
import { app } from "../server";

const idImagem = "1664c23d-d9bc-4322-8cab-27a755d06dbc";
let imagem = "https://reckoning-image";

describe("Testar rota post de imagem", () => {
  it("Deve criar uma imagem", async () => {
    const res = await request(app).post("/imagem").send({
      "idImagem": `${idImagem}`,
      "imagem": `${imagem}`
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.idImagem).toBe(`${idImagem}`);
    expect(res.body.imagem).toBe(`${imagem}`);
  });
});


describe("Testar rota get de uma imagem", () => {
  it("Deve responder uma imagem", async () => {
    const res = await request(app).get(`/imagem/${idImagem}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.imagem).toBe(`${imagem}`);
  });
});


describe("Testar rota get de listar todas as imagens", () => {
  it("Deve listar todas as imagens", async () => {
    const res = await request(app).get("/imagem");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});


imagem = "https://Reckoning-image-home"


describe("Testar rota de atualizar a imagem", () => {
  it("Deve atualizar a imagem solicitada", async () => {
    const res = await request(app).put(`/imagem/${idImagem}`).send({
        "imagem": `${imagem}`
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.imagem).toBe(`${imagem}`);
  });
});


describe("Testar rota de deletar a imagem", () => {
  it("Deve deletar a imagem solicitada", async () => {
    const res = await request(app).delete(`/imagem/${idImagem}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.idImagem).toBe(`${idImagem}`);
    expect(res.body.imagem).toBe(`${imagem}`);
  });
});