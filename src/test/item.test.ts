const request = require("supertest");
import { app, prisma } from "../server";

const idItem = "d29d380b-99b4-48aa-93cf-3695570cf511";
let imagemIdImagem = "64517b59-ed1c-415b-8212-8c4d6ff755a2";
let nome = "Ak-47";
let descricao = "Metralhadora";

describe("Testando itens", () => {
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
        it('Deve retornar status 400 se nada for cadastrado', async () => {
            const res = await request(app)
                .post('/item')
                .send({});
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty("error", 'dados inválidos');
        });
        it('Deve retornar status 500 em caso de erro interno', async () => {
            // Simulando um erro interno no servidor
            jest.spyOn(prisma.item, 'create').mockRejectedValueOnce(new Error('Erro interno'));
            const res = await request(app).post(`/item/`).send({
                "idItem": `${idItem}`,
                "imagemIdImagem": `${imagemIdImagem}`,
                "nome": `${nome}`,
                "descricao": `${descricao}`
            });
            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty("error", "ocorreu um erro ao cadastrar o item");
        });
    });


    describe("Testar rota para pegar id pelos dados", () => {
    it("Deve retornar um id do item correspondente", async () => {
        const res = await request(app).get(`/search/item?imagemIdImagem=${imagemIdImagem}&nome=${nome}&descricao=${descricao}`)
        expect(res.statusCode).toBe(200);
        expect(res.body.idItem).toBe(`${idItem}`);
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
        it('Deve retornar status 404 para uma item inexistente', async () => {
            let idItemm = "341c-8cb4-4fb9";
            const res = await request(app).get(`/item/${idItemm}`); 
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('error', 'item não encontrado.');
            });
        it('Deve retornar status 500 em caso de erro interno', async () => {
            // Simulando um erro interno no servidor
            jest.spyOn(prisma.item, 'findUnique').mockRejectedValueOnce(new Error('Erro interno'));
            const res = await request(app).get(`/item/${idItem}`);
            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('error', 'ocorreu um erro ao procurar o item');
        });
    });


    describe("Testar rota get de listar todos os itens", () => {
        it("Deve listar todos os itens", async () => {
            const res = await request(app).get("/item");
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);
        });
        it('Deve retornar status 500 em caso de erro interno', async () => {
            // Simulando um erro interno no servidor
            jest.spyOn(prisma.item, 'findMany').mockRejectedValueOnce(new Error('Erro interno'));
            const res = await request(app).get(`/item`);
            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('error', 'ocorreu um erro ao procurar os itens');
        });
    });


    imagemIdImagem = "857b3062-bb7a-458d-8587-d0e4e2c13f6e";
    nome = "Handgun";
    descricao = "Pistola";


    describe("Testar rota de atualizar item", () => {
        it("Deve atualizar o item solicitado", async () => {
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
            it('Deve retornar status 404 para uma item inexistente', async () => {
                let idItemm = "341c-8cb4-4fb9";
                const res = await request(app).put(`/item/${idItemm}`).send({
                    "imagemIdImagem": `${imagemIdImagem}`,
                    "nome": `${nome}`,
                    "descricao": `${descricao}`
                });; 
                expect(res.statusCode).toBe(404);
                expect(res.body).toHaveProperty('error', 'item não encontrado.');
            });
            it('Deve retornar status 400 se nada for modificado', async () => {
                const res = await request(app).put(`/item/${idItem}`).send({});
                expect(res.statusCode).toBe(400);
                expect(res.body).toHaveProperty('message', 'Nada foi modificado');
            });
            it('Deve retornar status 500 em caso de erro interno', async () => {
                // Simulando um erro interno no servidor
                jest.spyOn(prisma.item, 'findUnique').mockRejectedValueOnce(new Error('Erro interno'));
                const res = await request(app).put(`/item/${idItem}`).send({
                    "imagemIdImagem": `${imagemIdImagem}`,
                    "nome": `${nome}`,
                    "descricao": `${descricao}`
                });;
                expect(res.statusCode).toBe(500);
                expect(res.body).toHaveProperty('error', 'ocorreu um erro ao atualizar item');
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
        it('Deve retornar status 404 para um item inexistente', async () => {
            let idItemm= "341c-8cb4-4fb9";
            const res = await request(app).delete(`/item/${idItemm}`); 
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('error', 'item não encontrado.');
        });
        it('Deve retornar status 500 em caso de erro interno', async () => {
            // Simulando um erro interno no servidor
            jest.spyOn(prisma.item, 'findUnique').mockRejectedValueOnce(new Error('Erro interno'));
            const res = await request(app).delete(`/item/${idItem}`);
            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('error', 'ocorreu um erro ao deletar o item');
        });
    });
});