"use client";

import { AppNavbar } from "@/components/layout/AppNavbar";
import { AppFooter } from "@/components/layout/AppFooter";
import { useAuth } from "@/hooks/useAuth";
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Stack, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";
import Link from "next/link";

export default function CadastroPage() {
  const { register, loading } = useAuth();
  const toast = useToast();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  const handleSubmit = async () => {
    await register(nome, email, telefone);
    toast({ title: "Conta criada (mock)", status: "success" });
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
