const request = require("supertest");
import { app, server } from "../server";

afterAll(() => {
  server.close();
})

describe("Testar rota post de feedback", () => {
  it("Deve criar um feedback", async () => {
    const res = await request(app).post("/feedback").send({
      "atribuicao": "teste",
      "feedback": "descricaojdfosajdfoa"
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.atribuicao).toBe("teste");
    expect(res.body.feedback).toBe("descricaojdfosajdfoa");
  });
});

describe("Testar rota get de 1 feedback", () => {
  it("Deve responder um feedback", async () => {
    const res = await request(app).get("/feedback/d29d380b-99b4-48aa-93cf-3695570cf511");
    expect(res.statusCode).toBe(200);
    expect(res.body.atribuicao).toBeDefined();
    expect(res.body.feedback).toBeDefined();
  });
});

describe("Testar rota get de listar todos os feedbacks", () => {
  it("Deve listar todos os feedbacks", async () => {
    const res = await request(app).get("/feedback");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

// describe("Testar rota de deletar feedback", () => {
//   it("Deve deletar o feedback solicitado", async () => {
//     const res = await request(app).delete("/feedback/055f9159-fe5e-4337-a36e-1542af64d558");
//     expect(res.statusCode).toBe(200);
//     expect(res.body.atribuicao).toBe("teste");
//     expect(res.body.feedback).toBe("descricaojdfosajdfoa");
//   });
// });

describe("Testar rota de deletar feedback", () => {
  it("Deve deletar o feedback solicitado", async () => {
    const res = await request(app).put("/feedback/15a6381e-7d7d-406a-a244-334ed3967d3d").send({
      "atribuicao": "teste1",
      "feedback": "descricaojdfosajdfoa1dfasdf"
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.atribuicao).toBe("teste1");
    expect(res.body.feedback).toBe("descricaojdfosajdfoa1dfasdf");
  });
});