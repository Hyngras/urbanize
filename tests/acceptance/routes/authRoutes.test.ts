import request from "supertest";
import { app } from "@/server/app";

describe("Auth Routes - Login", () => {
  it("deve retornar sucesso para credenciais válidas", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "cidadao@urbanize.com", senha: "demo" });

    expect(response.status).toBe(200);
    expect(response.body.user.email).toBe("cidadao@urbanize.com");
    expect(response.body.token).toBeDefined();
  });

  it("deve retornar erro para credenciais inválidas", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ email: "invalido@urbanize.com", senha: "senhaerrada" });

    expect(response.status).toBe(401);
    expect(response.body.error.message).toBe("Email ou senha inválidos");
  });
});

describe("Auth Routes - Register", () => {
    it("deve registrar um novo usuário com sucesso", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          nome: "Novo Usuário",
          email: "novo@urbanize.com",
          senha: "senha123",
          telefone: "123456789",
        });
  
      expect(response.status).toBe(201);
      expect(response.body.user.email).toBe("novo@urbanize.com");
      expect(response.body.token).toBeDefined();
    });
  });