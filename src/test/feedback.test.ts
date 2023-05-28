const request = require("supertest");
import { app, server } from "../server";

afterAll(() => {
  server.close();
})

describe("Testar rota get de feedback", () => {
  it("Deve responder o método get", async () => {
    const res = await request(app).get("/feedback");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

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