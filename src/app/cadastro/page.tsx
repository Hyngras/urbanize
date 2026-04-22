"use client";

import { AppNavbar } from "@/components/layout/AppNavbar";
import { AppFooter } from "@/components/layout/AppFooter";
import { useAuth } from "@/hooks/useAuth";
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Stack, Text, useToast } from "@chakra-ui/react";
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

  useEffect(() => {
    if (user) {
      const destination = user.role === "gestor" ? "/gestor" : "/dashboard";
      router.push(destination);
    }
  }, [user, router]);

  const handleSubmit = async () => {
    try {
      await register(nome, email, telefone);
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
          <Text mb={6} color="gray.600">Cadastre-se como cidadão para registrar demandas.</Text>
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
            <Button colorScheme="brand" onClick={handleSubmit} isLoading={loading}>Criar conta</Button>
            <Button as={Link} href="/login" variant="ghost">Já tenho conta</Button>
          </Stack>
        </Box>
      </Flex>
      <AppFooter />
    </Box>
  );
}
