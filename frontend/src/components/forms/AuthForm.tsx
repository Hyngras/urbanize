"use client";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

interface Props {
  mode: "login" | "register";
}

export function AuthForm({ mode }: Props) {
  const toast = useToast();
  const { login, register, loading } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"cidadao" | "gestor">("cidadao");

  const handleSubmit = async () => {
    try {
      if (mode === "login") {
        await login(email, password);
        toast({ title: "Login realizado", status: "success" });
      } else {
        await register(name, email, password, undefined, role);
        toast({ title: "Cadastro realizado", status: "success" });
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Erro ao autenticar", status: "error" });
    }
  };

  return (
    <Box bg="white" p={6} rounded="lg" border="1px solid" borderColor="gray.100" shadow="sm">
      <Stack spacing={4}>
        {mode === "register" && (
          <FormControl isRequired>
            <FormLabel>Nome</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Maria Silva" />
          </FormControl>
        )}
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@email.com" />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Senha</FormLabel>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" />
        </FormControl>
        {mode === "register" && (
          <FormControl>
            <FormLabel>Perfil</FormLabel>
            <Select value={role} onChange={(e) => setRole(e.target.value as "cidadao" | "gestor") }>
              <option value="cidadao">Cidadão</option>
              <option value="gestor">Gestor público</option>
            </Select>
          </FormControl>
        )}
        <Button colorScheme="brand" onClick={handleSubmit} isLoading={loading}>
          {mode === "login" ? "Entrar" : "Criar conta"}
        </Button>
        <Text fontSize="sm" color="gray.500">
          Autenticação real com JWT, cookies HTTP-only e perfis de usuário.
        </Text>
      </Stack>
    </Box>
  );
}
