"use client";

import { AppNavbar } from "@/components/layout/AppNavbar";
import { AppFooter } from "@/components/layout/AppFooter";
import { useAuth } from "@/hooks/useAuth";
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Stack, useToast } from "@chakra-ui/react";
import { useState, useEffect, useRef, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

function getSafeNextPath(nextPath: string | null) {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return null;
  }

  return nextPath;
}

export default function LoginPage() {
  const { login, loading, user } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const submitInProgressRef = useRef(false);
  const [nextPath, setNextPath] = useState<string | null>(null);
  const [hasReadQuery, setHasReadQuery] = useState(false);
  const [email, setEmail] = useState("cidadao@urbanize.com");
  const [senha, setSenha] = useState("demo");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNextPath(getSafeNextPath(params.get("next")));
    setHasReadQuery(true);
  }, []);

  useEffect(() => {
    if (!hasReadQuery) return;

    if (user && !nextPath) {
      const destination = user.role === "gestor" ? "/gestor" : "/dashboard";
      router.push(destination);
    }
  }, [hasReadQuery, nextPath, user, router]);

  const handleSubmit = async (event?: FormEvent) => {
    event?.preventDefault();

    if (loading || submitInProgressRef.current) return;

    submitInProgressRef.current = true;

    try {
      await login(email, senha);
      toast({ title: "Login realizado com sucesso!", status: "success", duration: 2000 });
      const loggedUser = useAuthStore.getState().user;
      const destination = nextPath ?? (loggedUser?.role === "gestor" ? "/gestor" : "/dashboard");
      router.push(destination);
    } catch {
      toast({ title: "Email ou senha inválidos", status: "error" });
    } finally {
      submitInProgressRef.current = false;
    }
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <AppNavbar />
      <Flex align="center" justify="center" py={12} px={4}>
        <Box as="form" onSubmit={handleSubmit} bg="white" p={8} rounded="lg" border="1px solid" borderColor="gray.100" maxW="md" w="full">
          <Heading mb={2}>Entrar</Heading>
          <Stack spacing={4}>
            <FormControl isDisabled={loading}>
              <FormLabel>Email</FormLabel>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
            </FormControl>
            <FormControl isDisabled={loading}>
              <FormLabel>Senha</FormLabel>
              <Input value={senha} onChange={(e) => setSenha(e.target.value)} type="password" />
            </FormControl>
            <Button colorScheme="brand" type="submit" isLoading={loading} loadingText="Entrando..." isDisabled={loading}>Entrar</Button>
            <Button as={Link} href="/cadastro" variant="ghost" isDisabled={loading}>Criar conta</Button>
          </Stack>
        </Box>
      </Flex>
      <AppFooter />
    </Box>
  );
}
