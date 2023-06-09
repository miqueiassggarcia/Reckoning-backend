const request = require("supertest");
import { app, prisma } from "../server";

const idPersonagem = "32f2b3e4-01eb-452f-a36f-0c3cd796ecaf";
let imagemIdImagem = "64517b59-ed1c-415b-8212-8c4d6ff755a2";
let nome = "João da bike";
let descricao = "Aquele ali ó";

describe("Testando personagens", () => {
    describe("Testar rota post de personagem", () => {
        it("Deve criar um personagem", async () => {
            const res = await request(app).post("/personagem").send({
                "idPersonagem": `${idPersonagem}`,
                "imagemIdImagem": `${imagemIdImagem}`,
                "nome": `${nome}`,
                "descricao": `${descricao}`
            });
            expect(res.statusCode).toBe(201);
            expect(res.body.idPersonagem).toBe(`${idPersonagem}`);
            expect(res.body.imagemIdImagem).toBe(`${imagemIdImagem}`);
            expect(res.body.nome).toBe(`${nome}`);
            expect(res.body.descricao).toBe(`${descricao}`);
        });
        it('Deve retornar status 400 se nada for cadastrado', async () => {
            const res = await request(app)
                .post('/personagem')
                .send({});
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error', 'Dados invalidos.');
        });
        it('Deve retornar status 500 em caso de erro interno', async () => {
            // Simulando um erro interno no servidor
            jest.spyOn(prisma.personagem, 'create').mockRejectedValueOnce(new Error('Erro interno'));
            const res = await request(app).post(`/personagem/`)
            .send({
                "imagemIdImagem": `${imagemIdImagem}`,
                "nome": `${nome}`,
                "descricao": `${descricao}`
            });
            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('error', 'ocorreu um erro ao cadastrar personagem');
        });
    });


    describe("Testar rota para pegar id pelos dados", () => {
    it("Deve retornar um id do personagem correspondente", async () => {
        const res = await request(app).get(`/search/personagem?imagemIdImagem=${imagemIdImagem}&nome=${nome}&descricao=${descricao}`)
        expect(res.statusCode).toBe(200);
        expect(res.body.idPersonagem).toBe(`${idPersonagem}`);
    });
    it('Deve retornar status 400 se for enviado dados incorretos', async () => {
        const res = await request(app).get(`/search/personagem?imagemIdImagem=${imagemIdImagem}&nome=144descricao=${descricao}`)
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Dados incompletos ou formato incompativel');
    });
    it('Deve retornar status 404 para uma versão inexistente', async () => {
        let nomee = "Inexistente"
        const res = await request(app).get(`/search/personagem?imagemIdImagem=${imagemIdImagem}&nome=${nomee}&descricao=${descricao}`) 
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error', 'Personagem não encontrado.');
    });
    it('Deve retornar status 500 em caso de erro interno', async () => {
        // Simulando um erro interno no servidor
        jest.spyOn(prisma.personagem, 'findFirst').mockRejectedValueOnce(new Error('Erro interno'));
        const res = await request(app).get(`/search/personagem?imagemIdImagem=${imagemIdImagem}&nome=${nome}&descricao=${descricao}`)
        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty('error', 'ocorreu um erro ao procurar o personagem');
    });
    });


    describe("Testar rota get de 1 personagem", () => {
        it("Deve responder um personagem", async () => {
            const res = await request(app).get(`/personagem/${idPersonagem}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.imagemIdImagem).toBe(`${imagemIdImagem}`);
            expect(res.body.nome).toBe(`${nome}`);
            expect(res.body.descricao).toBe(`${descricao}`);
        });
        it('Deve retornar status 404 para um personagem inexistente', async () => {
            let idPersonagemm = "341c-8cb4-4fb9";
            const res = await request(app).get(`/personagem/${idPersonagemm}`); 
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('error', 'Personagem não encontrado.');
            });
        it('Deve retornar status 500 em caso de erro interno', async () => {
            // Simulando um erro interno no servidor
            jest.spyOn(prisma.personagem, 'findUnique').mockRejectedValueOnce(new Error('Erro interno'));
            const res = await request(app).get(`/personagem/${idPersonagem}`);
            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('error', 'ocorreu um erro ao buscar personagem');
        });
    });


    describe("Testar rota get de listar todos os personagens", () => {
        it("Deve listar todos os personagens", async () => {
            const res = await request(app).get("/personagem");
            expect(res.statusCode).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);
        });
        it('Deve retornar status 500 em caso de erro interno', async () => {
            // Simulando um erro interno no servidor
            jest.spyOn(prisma.personagem, 'findMany').mockRejectedValueOnce(new Error('Erro interno'));
            const res = await request(app).get(`/personagem`);
            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('error', 'ocorreu um erro ao buscar personagens');
        });
    });


    imagemIdImagem = "857b3062-bb7a-458d-8587-d0e4e2c13f6e";
    nome = "Luizin";
    descricao = "Apenas luizin";


    describe("Testar rota de atualizar personagem", () => {
        it("Deve atualizar o personagem solicitado", async () => {
            const res = await request(app).put(`/personagem/${idPersonagem}`).send({
                "imagemIdImagem": `${imagemIdImagem}`,
                "nome": `${nome}`,
                "descricao": `${descricao}`
            });
            expect(res.statusCode).toBe(200);
            expect(res.body.imagemIdImagem).toBe(`${imagemIdImagem}`);
            expect(res.body.nome).toBe(`${nome}`);
            expect(res.body.descricao).toBe(`${descricao}`);
        });
        it('Deve retornar status 404 para um personagem inexistente', async () => {
            let idPersonagemm = "341c-8cb4-4fb9";
            const res = await request(app).put(`/personagem/${idPersonagemm}`)
            .send({
                "imagemIdImagem": `${imagemIdImagem}`,
                "nome": `${nome}`,
                "descricao": `${descricao}`
            }); 
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('error', 'Personagem não encontrado.');
        });
        it('Deve retornar status 400 se nada for modificado', async () => {
            const res = await request(app).put(`/personagem/${idPersonagem}`).send({});
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error', 'Nada foi modificado');
        });
        it('Deve retornar status 500 em caso de erro interno', async () => {
            // Simulando um erro interno no servidor
            jest.spyOn(prisma.personagem, 'findUnique').mockRejectedValueOnce(new Error('Erro interno'));
            const res = await request(app).put(`/personagem/${idPersonagem}`)
            .send({
                "imagemIdImagem": `${imagemIdImagem}`,
                "nome": `${nome}`,
                "descricao": `${descricao}`
            });
            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('error', 'ocorreu um erro ao atualizar personagem');
        });
    });


    describe("Testar rota de deletar personagem", () => {
        it("Deve deletar o personagem solicitado", async () => {
            const res = await request(app).delete(`/personagem/${idPersonagem}`);
            expect(res.statusCode).toBe(200);
            expect(res.body.idPersonagem).toBe(`${idPersonagem}`);
            expect(res.body.imagemIdImagem).toBe(`${imagemIdImagem}`);
            expect(res.body.nome).toBe(`${nome}`);
            expect(res.body.descricao).toBe(`${descricao}`);
        });
        it('Deve retornar status 404 para um personagem inexistente', async () => {
            let idPersonagemm= "341c-8cb4-4fb9";
            const res = await request(app).delete(`/personagem/${idPersonagemm}`); 
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('error', 'Personagem não encontrado.');
        });
        it('Deve retornar status 500 em caso de erro interno', async () => {
            // Simulando um erro interno no servidor
            jest.spyOn(prisma.personagem, 'findUnique').mockRejectedValueOnce(new Error('Erro interno'));
            const res = await request(app).delete(`/personagem/${idPersonagem}`);
            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('error', 'ocorreu um erro ao deletar personagem');
        });
    });
})
