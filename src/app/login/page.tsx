"use client";

import { AppNavbar } from "@/components/layout/AppNavbar";
import { AppFooter } from "@/components/layout/AppFooter";
import { useAuth } from "@/hooks/useAuth";
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Stack, Text, useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login, loading, user } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("cidadao@urbanize.com");
  const [senha, setSenha] = useState("demo");

  useEffect(() => {
    if (user) {
      const destination = user.role === "gestor" ? "/gestor" : "/dashboard";
      router.push(destination);
    }
  }, [user, router]);

  const handleSubmit = async () => {
    try {
      await login(email);
      toast({ title: "Login realizado com sucesso!", status: "success", duration: 2000 });
    } catch {
      toast({ title: "Erro ao fazer login", status: "error" });
    }
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <AppNavbar />
      <Flex align="center" justify="center" py={12} px={4}>
        <Box bg="white" p={8} rounded="lg" border="1px solid" borderColor="gray.100" maxW="md" w="full">
          <Heading mb={2}>Entrar</Heading>
          <Text mb={6} color="gray.600">Use um email mock: cidadao@urbanize.com ou gestor@urbanize.com</Text>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
            </FormControl>
            <FormControl>
              <FormLabel>Senha</FormLabel>
              <Input value={senha} onChange={(e) => setSenha(e.target.value)} type="password" />
            </FormControl>
            <Button colorScheme="brand" onClick={handleSubmit} isLoading={loading}>Entrar</Button>
            <Button as={Link} href="/cadastro" variant="ghost">Criar conta</Button>
          </Stack>
        </Box>
      </Flex>
      <AppFooter />
    </Box>
  );
}
