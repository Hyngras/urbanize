"use client";

import { Box, Button, Flex, HStack, Icon, Text } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { useAuthStore } from "@/store/authStore";

export function AppNavbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const authenticatedLinks = user?.role === "gestor"
    ? [
        { href: "/gestor", label: "Painel do gestor" },
        { href: "/demandas", label: "Todas as demandas" },
      ]
    : [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/demandas", label: "Minhas demandas" },
        { href: "/demandas/nova", label: "Nova demanda" },
      ];

  return (
    <Box as="header" bg="white" borderBottom="1px solid" borderColor="gray.100" px={4} py={3} position="sticky" top={0} zIndex={10}>
      <Flex align="center" justify="space-between" maxW="1200px" mx="auto" gap={3} flexWrap="wrap">
        <Flex align="center" gap={2}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <Image 
              src="/logo-urbanize.png" 
              alt="Urbanize Logo"
              width={35}      
              height={35}
              priority        
            />
            <Box as="span" fontWeight="bold" fontSize="xl" color="#14436f">
              Urbanize
            </Box>
          </Link>
        </Flex>

        {mounted && user && (
          <HStack spacing={2} flex={1} justify="center" display={{ base: "none", md: "flex" }}>
            {authenticatedLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Button
                  key={link.href}
                  as={Link}
                  href={link.href}
                  size="sm"
                  variant={isActive ? "solid" : "ghost"}
                  colorScheme={isActive ? "brand" : "gray"}
                >
                  {link.label}
                </Button>
              );
            })}
          </HStack>
        )}

        {mounted && user && (
          <HStack spacing={3}>
            <Box textAlign="right" display={{ base: "none", sm: "block" }}>
              <Text fontWeight="semibold" lineHeight="short" fontSize="sm">
                {user.nome}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {user.role === "gestor" ? "Gestor" : "Cidadão"}
              </Text>
            </Box>
            <Button size="sm" variant="outline" onClick={handleLogout} leftIcon={<Icon as={FaSignOutAlt} />}>
              Sair
            </Button>
          </HStack>
        )}

        {mounted && user && (
          <HStack spacing={2} w="full" display={{ base: "flex", md: "none" }} overflowX="auto" pt={2}>
            {authenticatedLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Button
                  key={link.href}
                  as={Link}
                  href={link.href}
                  size="sm"
                  variant={isActive ? "solid" : "ghost"}
                  colorScheme={isActive ? "brand" : "gray"}
                  flexShrink={0}
                >
                  {link.label}
                </Button>
              );
            })}
          </HStack>
        )}

        {mounted && !user && (
          <HStack spacing={3}>
            <Button as={Link} href="/login" size="sm" variant="ghost">
              Entrar
            </Button>
            <Button as={Link} href="/cadastro" size="sm" colorScheme="brand">
              Criar conta
            </Button>
          </HStack>
        )}
      </Flex>
    </Box>
  );
}
