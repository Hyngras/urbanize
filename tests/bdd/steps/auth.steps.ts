import { Given, When, Then } from "@cucumber/cucumber";
import request from "supertest";
import { app } from "@/server/app";

let response: request.Response;

interface CustomWorld {
  email: string;
  senha: string;
}

Given(
  "que eu tenho um email {string} e senha {string}",
  function (this: CustomWorld, email: string, senha: string) {
    this.email = email;
    this.senha = senha;
  }
);

When(
  "eu envio uma requisição de login",
  async function (this: CustomWorld) {
    response = await request(app).post("/api/auth/login").send({
      email: this.email,
      senha: this.senha,
    });
  }
);

Then("eu devo receber um token de autenticação", function () {
  expect(response.status).toBe(200);
  expect(response.body.token).toBeDefined();
});

Then(
  "eu devo receber uma mensagem de erro {string}",
  function (message: string) {
    expect(response.status).toBe(401);
    expect(response.body.error.message).toBe(message);
  }
);