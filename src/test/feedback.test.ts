const request = require("supertest");
import { app, prisma } from "../server";

const idFeedback = "3278a41c-8cb4-4fb9-b944-0422b40a8815";
let atribuicao = "Site";
let feedback = "Muito massa";

describe("Testando feedbacks", () => {
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
    it('Deve retornar status 400 se nada for cadastrado', async () => {
        const res = await request(app)
            .post('/feedback')
            .send({});
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error", 'dados inválidos');
    });
    it('Deve retornar status 500 em caso de erro interno', async () => {
        // Simulando um erro interno no servidor
        jest.spyOn(prisma.item, 'create').mockRejectedValueOnce(new Error('Erro interno'));
        const res = await request(app).post(`/feedback/`).send({
            "idFeedback": `${idFeedback}`,
            "atribuicao": `${atribuicao}`,
            "feedback": `${feedback}`
        });
        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty("error", "ocorreu um erro ao cadastrar a imagem");
    });
});


describe("Testar rota para pegar id pelos dados", () => {
  it("Deve retornar um id do feedback correspondente", async () => {
    const res = await request(app).get(`/search/feedback?atribuicao=${atribuicao}&feedback=${feedback}`)
    expect(res.statusCode).toBe(200);
    expect(res.body.idFeedback).toBe(`${idFeedback}`);
  });
});


describe("Testar rota get de 1 feedback", () => {
    it("Deve responder um feedback", async () => {
        const res = await request(app).get(`/feedback/${idFeedback}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.atribuicao).toBe(`${atribuicao}`);
        expect(res.body.feedback).toBe(`${feedback}`);
    });
    it('Deve retornar status 404 para um feedback inexistente', async () => {
        let idFeedbackk = "341c-8cb4-4fb9";
        const res = await request(app).get(`/feedback/${idFeedbackk}`); 
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error', 'Feedback não encontrado.');
    });
    it('Deve retornar status 500 em caso de erro interno', async () => {
        // Simulando um erro interno no servidor
        jest.spyOn(prisma.feedback, 'findUnique').mockRejectedValueOnce(new Error('Erro interno'));
        const res = await request(app).get(`/feedback/${idFeedback}`);
        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty('error', 'ocorreu um erro ao procurar o feedback');
    });
});


describe("Testar rota get de listar todos os feedbacks", () => {
    it("Deve listar todos os feedbacks", async () => {
        const res = await request(app).get("/feedback");
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });
    it('Deve retornar status 500 em caso de erro interno', async () => {
        // Simulando um erro interno no servidor
        jest.spyOn(prisma.feedback, 'findMany').mockRejectedValueOnce(new Error('Erro interno'));
        const res = await request(app).get(`/feedback`);
        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty('error', 'ocorreu um erro ao procurar os feedbacks');
    });
});


atribuicao = "Jogo"
feedback = "Muito legal"


describe("Testar rota de atualizar feedback", () => {
    it("Deve atualizar o feedback solicitado", async () => {
        const res = await request(app).put(`/feedback/${idFeedback}`).send({
            "atribuicao": `${atribuicao}`,
            "feedback": `${feedback}`
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.atribuicao).toBe(`${atribuicao}`);
        expect(res.body.feedback).toBe(`${feedback}`);
    });
    it('Deve retornar status 404 para um feedback inexistente', async () => {
        let idFeedbackk = "341c-8cb4-4fb9";
        const res = await request(app).put(`/feedback/${idFeedbackk}`)
        .send({
            "atribuicao": `${atribuicao}`,
            "feedback": `${feedback}`
        });
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error', 'Feedback não encontrado.');
    });
    it('Deve retornar status 400 se nada for modificado', async () => {
        const res = await request(app).put(`/feedback/${idFeedback}`).send({});
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Nada foi modificado');
    });
    it('Deve retornar status 500 em caso de erro interno', async () => {
        // Simulando um erro interno no servidor
        jest.spyOn(prisma.feedback, 'update').mockRejectedValueOnce(new Error('Erro interno'));
        const res = await request(app).put(`/feedback/${idFeedback}`).send({
            "atribuicao": `${atribuicao}`,
            "feedback": `${feedback}`
        });
        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty('error', 'occoreu um erro ao atualizar o feedback');
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
    it('Deve retornar status 404 para um feedback inexistente', async () => {
        let idFeedbackk = "341c-8cb4-4fb9";
        const res = await request(app).delete(`/feedback/${idFeedbackk}`); 
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error', 'Feedback não encontrado.');
    });
    it('Deve retornar status 500 em caso de erro interno', async () => {
        // Simulando um erro interno no servidor
        jest.spyOn(prisma.feedback, 'findUnique').mockRejectedValueOnce(new Error('Erro interno'));
        const res = await request(app).delete(`/feedback/${idFeedback}`);
        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty('error', 'occoreu um erro ao deletar o feedback');
    });
});
})
