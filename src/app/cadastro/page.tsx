"use client";

import { AppNavbar } from "@/components/layout/AppNavbar";
import { AppFooter } from "@/components/layout/AppFooter";
import { useAuth } from "@/hooks/useAuth";
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Select, Stack, Text, useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CadastroPage() {
  const { register, loading, user } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState<"cidadao" | "gestor">("cidadao");

  useEffect(() => {
    if (user) {
      const destination = user.role === "gestor" ? "/gestor" : "/dashboard";
      router.push(destination);
    }
  }, [user, router]);

  const handleSubmit = async () => {
    try {
      await register(nome, email, senha, telefone, role);
      toast({ title: "Conta criada com sucesso!", status: "success", duration: 2000 });
    } catch {
      toast({ title: "Erro ao criar conta", status: "error" });
    }
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <AppNavbar />
      <Flex align="center" justify="center" py={12} px={4}>
        <Box bg="white" p={8} rounded="lg" border="1px solid" borderColor="gray.100" maxW="md" w="full">
          <Heading mb={2}>Criar conta</Heading>
          <Text mb={6} color="gray.600">Cadastre-se como cidadão ou gestor público para acessar a plataforma.</Text>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Nome</FormLabel>
              <Input value={nome} onChange={(e) => setNome(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Telefone</FormLabel>
              <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Senha</FormLabel>
              <Input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Perfil</FormLabel>
              <Select value={role} onChange={(e) => setRole(e.target.value as "cidadao" | "gestor")}>
                <option value="cidadao">Cidadão</option>
                <option value="gestor">Gestor público</option>
              </Select>
            </FormControl>
            <Button colorScheme="brand" onClick={handleSubmit} isLoading={loading}>Criar conta</Button>
            <Button as={Link} href="/login" variant="ghost">Já tenho conta</Button>
          </Stack>
        </Box>
      </Flex>
      <AppFooter />
    </Box>
  );
}
