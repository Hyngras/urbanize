import { api } from "@/services/api";

describe("API Service", () => {
  it("deve registrar um novo usuário com sucesso", async () => {
    const payload = { nome: "Novo Usuário", email: "novo@urbanize.com", senha: "senha123", telefone: "123456789" };

    const result = await api.register(payload.nome, payload.email, payload.senha, payload.telefone);

    expect(result.user.email).toBe(payload.email);
    expect(result.user.nome).toBe(payload.nome);
    expect(result.token).toBeDefined();
  });

  it("deve lançar um erro se o email já estiver registrado", async () => {
    const payload = { nome: "Usuário Existente", email: "cidadao@urbanize.com", senha: "demo" };

    await expect(api.register(payload.nome, payload.email, payload.senha)).rejects.toThrow();
  });
});