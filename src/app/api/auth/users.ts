import { User } from "@/types/user";
import { randomUUID } from "crypto";

let users: User[] = [
  { id: randomUUID(), nome: "Gestor Demo", email: "gestor@urbanize.com", role: "gestor" },
  { id: randomUUID(), nome: "Cidadão Demo", email: "cidadao@urbanize.com", role: "cidadao" },
];

export function getUserByEmail(email: string) {
  return users.find((u) => u.email === email);
}

export function createUser(user: Omit<User, "id">) {
  const newUser: User = { ...user, id: randomUUID() };
  users = [...users, newUser];
  return newUser;
}

export function listUsers() {
  return users;
}
