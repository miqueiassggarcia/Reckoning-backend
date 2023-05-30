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
    it('Deve retornar status 400 se nada for cadastrado', async () => {
        const res = await request(app)
            .post('/imagem')
            .send({});
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Nada foi cadastrado');
    });
});


describe("Testar rota get de uma imagem", () => {
    it("Deve responder uma imagem", async () => {
        const res = await request(app).get(`/imagem/${idImagem}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.imagem).toBe(`${imagem}`);
    });
    it('Deve retornar status 404 para uma imagem inexistente', async () => {
        let idImagemm = "341c-8cb4-4fb9";
        const res = await request(app).get(`/imagem/${idImagemm}`); 
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error', 'imagem não encontrada.');
        });
    it('Deve retornar status 500 em caso de erro interno', async () => {
        // Simulando um erro interno no servidor
        jest.spyOn(prisma.imagem, 'findUniqueOrThrow').mockRejectedValueOnce(new Error('Erro interno'));
        const res = await request(app).get(`/imagem/${idImagem}`);
        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty('error', 'occoreu um erro ao procurar imagem');
    });
});


describe("Testar rota get de listar todas as imagens", () => {
    it("Deve listar todas as imagens", async () => {
        const res = await request(app).get("/imagem");
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });
    it('Deve retornar status 500 em caso de erro interno', async () => {
        // Simulando um erro interno no servidor
        jest.spyOn(prisma.imagem, 'findMany').mockRejectedValueOnce(new Error('Erro interno'));
        const res = await request(app).get(`/imagem`);
        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty('error', 'occoreu um erro ao procurar imagem');
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
    it('Deve retornar status 404 para uma imagem inexistente', async () => {
        let idImagemm = "341c-8cb4-4fb9";
        const res = await request(app).put(`/imagem/${idImagemm}`); 
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error', 'imagem não encontrada.');
    });
    it('Deve retornar status 400 se nada for modificado', async () => {
        const res = await request(app).put(`/imagem/${idImagem}`).send({});
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Nada foi modificado');
    });
    it('Deve retornar status 500 em caso de erro interno', async () => {
        // Simulando um erro interno no servidor
        jest.spyOn(prisma.imagem, 'update').mockRejectedValueOnce(new Error('Erro interno'));
        const res = await request(app).put(`/imagem/${idImagem}`);
        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty('error', 'occoreu um erro ao atualizar imagem');
    });
});


describe("Testar rota de deletar a imagem", () => {
    it("Deve deletar a imagem solicitada", async () => {
        const res = await request(app).delete(`/imagem/${idImagem}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.idImagem).toBe(`${idImagem}`);
        expect(res.body.imagem).toBe(`${imagem}`);
    });
    it('Deve retornar status 404 para um imagem inexistente', async () => {
        let idImagemm= "341c-8cb4-4fb9";
        const res = await request(app).delete(`/imagem/${idImagemm}`); 
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error', 'imagem não encontrada.');
    });
    it('Deve retornar status 500 em caso de erro interno', async () => {
        // Simulando um erro interno no servidor
        jest.spyOn(prisma.imagem, 'delete').mockRejectedValueOnce(new Error('Erro interno'));
        const res = await request(app).delete(`/imagem/${idImagem}`);
        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty('error', 'occoreu um erro ao deletar imagem');
    });
});
