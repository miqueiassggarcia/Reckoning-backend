const request = require("supertest");
import { app, server } from "../server";

afterAll(() => {
  server.close();
})

const idFeedback = "15a6381e-7d7d-406a-a244-334ed3967d3d";
let atribuicao = "Site";
let feedback = "Muito massa";

describe("Testar rota post de feedback", () => {
  it("Deve criar um feedback", async () => {
    const res = await request(app).post("/feedback").send({
      "idFeedback": `${idFeedback}`,
      "atribuicao": `${atribuicao}`,
      "feedback": `${feedback}`
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.idFeedback).toBe(`${idFeedback}`);
    expect(res.body.atribuicao).toBe(`${atribuicao}`);
    expect(res.body.feedback).toBe(`${feedback}`);
  });
});


describe("Testar rota get de 1 feedback", () => {
  it("Deve responder um feedback", async () => {
    const res = await request(app).get(`/feedback/${idFeedback}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.atribuicao).toBe(`${atribuicao}`);
    expect(res.body.feedback).toBe(`${feedback}`);
  });
});

describe("Testar rota get de listar todos os feedbacks", () => {
  it("Deve listar todos os feedbacks", async () => {
    const res = await request(app).get("/feedback");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe("Testar rota de atualizar feedback", () => {
  it("Deve atualizar o feedback solicitado", async () => {
    const res = await request(app).put(`/feedback/${idFeedback}`).send({
      "atribuicao": "Jogo",
      "feedback": "Muito legal"
    });
    atribuicao = "Jogo"
    feedback = "Muito legal"
    expect(res.statusCode).toBe(200);
    expect(res.body.atribuicao).toBe(`${atribuicao}`);
    expect(res.body.feedback).toBe(`${feedback}`);
  });
});

describe("Testar rota de deletar feedback", () => {
  it("Deve deletar o feedback solicitado", async () => {
    const res = await request(app).delete(`/feedback/${idFeedback}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.idFeedback).toBe(`${idFeedback}`);
    expect(res.body.atribuicao).toBe(`${atribuicao}`);
    expect(res.body.feedback).toBe(`${feedback}`);
  });
});