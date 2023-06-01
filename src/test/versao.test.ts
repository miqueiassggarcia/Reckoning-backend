const request = require("supertest");
import { number } from "zod";
import { app, prisma } from "../server"; 

const currentDateTime = new Date();
const idVersao = "3cdd9c6f-23f7-4841-9c3b-066b08043af5";
let nome = "Update do boss";
let descricao = "Adiciona um novo boss na fase final";
let data = currentDateTime.toISOString();
let arquivo = "https://reckoning-version1.1.2"

describe("Testando versões", () => {
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
        it('Deve retornar status 400 se nada for cadastrado', async () => {
            const res = await request(app)
                .post('/versao')
                .send({});
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error', 'Dados invalidos.');
        });
        it('Deve retornar status 500 em caso de erro interno', async () => {
            // Simulando um erro interno no servidor
            jest.spyOn(prisma.versao, 'create').mockRejectedValueOnce(new Error('Erro interno'));
            const res = await request(app).post(`/versao/`)
            .send({
                "nome": `${nome}`,
                "descricao": `${descricao}`,
                "data": `${data}`,
                "arquivo": `${arquivo}`
            });
            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('error', 'ocorreu um erro ao cadastrar versão');
        });
    });


    describe("Testar rota para pegar id pelos dados", () => {
    it("Deve retornar um id da versao correspondente", async () => {
        const res = await request(app).get(`/search/versao?nome=${nome}&descricao=${descricao}&data=${data}&arquivo=${arquivo}`)
        expect(res.statusCode).toBe(200);
        expect(res.body.idVersao).toBe(`${idVersao}`);
    });
    it('Deve retornar status 404 para uma versão inexistente', async () => {
        let nomee = "Inexistente"
        const res = await request(app).get(`/search/versao?nome=${nomee}&descricao=${descricao}&data=${data}&arquivo=${arquivo}`); 
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error', 'Versão não encontrada.');
    });
    it('Deve retornar status 500 em caso de erro interno', async () => {
        // Simulando um erro interno no servidor
        jest.spyOn(prisma.versao, 'findFirst').mockRejectedValueOnce(new Error('Erro interno'));
        const res = await request(app).get(`/search/versao?nome=${nome}&descricao=${descricao}&data=${data}&arquivo=${arquivo}`); 
        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty('error', 'ocorreu um erro ao procurar a versão');
    });
    it('Deve retornar status 400 se for enviado dados incorretos', async () => {
        const res = await request(app).get(`/search/versao?nome=descricao=${descricao}&data=${data}&arquivo=${arquivo}`);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Dados imcompletos ou formato incompativel');
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
        it('Deve retornar status 404 para uma versão inexistente', async () => {
            let idVersaoo = "341c-8cb4-4fb9";
            const res = await request(app).get(`/versao/${idVersaoo}`); 
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('error', 'Versão não encontrado.');
            });
        it('Deve retornar status 500 em caso de erro interno', async () => {
            // Simulando um erro interno no servidor
            jest.spyOn(prisma.versao, 'findUnique').mockRejectedValueOnce(new Error('Erro interno'));
            const res = await request(app).get(`/versao/${idVersao}`);
            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('error', 'occoreu um erro ao buscar a versão');
        });
    });


    describe("Testar rota get de listar as versoes", () => {
        it("Deve listar todas as versoes", async () => {
            const res = await request(app).get("/versao");
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);
        });
        it('Deve retornar status 500 em caso de erro interno', async () => {
            // Simulando um erro interno no servidor
            jest.spyOn(prisma.versao, 'findMany').mockRejectedValueOnce(new Error('Erro interno'));
            const res = await request(app).get(`/versao`);
            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('error', 'ocorreu um erro ao buscar as versões');
        });
    });


    nome = "Update do boss aranha"
    descricao = "Adiciona um boss aranha na fase final"
    data = currentDateTime.toISOString();
    arquivo = "https://reckoning-version1.1.2"


    describe("Testar rota de atualizar a versao", () => {
        it("Deve atualizar a versao", async () => {
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
        it('Deve retornar status 404 para uma versão inexistente', async () => {
            let idVersaoo = "341c-8cb4-4fb9";
            const res = await request(app).put(`/versao/${idVersaoo}`)
            .send({
                "nome": `${nome}`,
                "descricao": `${descricao}`,
                "data": `${data}`,
                "arquivo": `${arquivo}`
            }); 
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('error', 'Versão não encontrado.');
        });
        it('Deve retornar status 400 se nada for modificado', async () => {
            const res = await request(app)
            .put(`/versao/${idVersao}`)
            .send({});
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message', 'Nada foi modificado');
        });
        it('Deve retornar status 500 em caso de erro interno', async () => {
            // Simulando um erro interno no servidor
            jest.spyOn(prisma.versao, 'update').mockRejectedValueOnce(new Error('Erro interno'));
            const res = await request(app).put(`/versao/${idVersao}`)
            .send({
                "nome": `${nome}`,
                "descricao": `${descricao}`,
                "data": `${data}`,
                "arquivo": `${arquivo}`
            });
            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('error', 'ocorreu um erro ao modificar a versão');
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
        it('Deve retornar status 404 para uma versão inexistente', async () => {
            let idVersaoo = "341c-8cb4-4fb9";
            const res = await request(app).delete(`/versao/${idVersaoo}`); 
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('error', 'Versão não encontrada.');
        });
        it('Deve retornar status 500 em caso de erro interno', async () => {
            // Simulando um erro interno no servidor
            jest.spyOn(prisma.versao, 'findUnique').mockRejectedValueOnce(new Error('Erro interno'));
            const res = await request(app).delete(`/versao/${idVersao}`);
            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('error', 'ocorreu um erro ao deletar a versão');
        });
    });
})
