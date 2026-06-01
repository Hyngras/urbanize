"use client";

import { Box, Button, Flex, HStack, IconButton, Link as ChakraLink, useDisclosure, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";
import { FiMenu, FiX } from "react-icons/fi";
import { usePathname } from "next/navigation";

const linksByCitizen = [
  { href: "/dashboard", label: "Meu Dashboard" },
  { href: "/demandas", label: "Minhas Demandas" },
  { href: "/demandas/nova", label: "Nova Demanda" },
];

const linksByManager = [
  { href: "/gestor", label: "Painel do Gestor" },
  { href: "/demandas", label: "Todas as Demandas" },
];

export function AppNavbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, logout } = useAuthStore();
  const pathname = usePathname();

  const links = user?.role === "gestor" ? linksByManager : linksByCitizen;

  return (
    <Box as="header" bg="white" borderBottom="1px solid" borderColor="gray.100" px={4} py={3} position="sticky" top={0} zIndex={10}>
      <Flex align="center" justify="space-between" maxW="1200px" mx="auto" gap={3}>
        
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

        <HStack display={{ base: "none", md: "flex" }} spacing={8}>
          {links.map((link) => {
            const isActive = pathname === link.href;

            return (
              <ChakraLink
                key={link.href}
                as={Link}
                href={link.href}
                fontWeight="semibold"
                fontSize="sm"
                transition="all 0.2s"
                color={isActive ? "#14436f" : "gray.500"}
                position="relative"
                _hover={{
                  color: "#2596be",
                  textDecoration: "none",
                }}
                _after={isActive ? {
                  content: '""',
                  position: "absolute",
                  bottom: "-4px",
                  left: "0",
                  width: "100%",
                  height: "2px",
                  bg: "#2596be",
                  borderRadius: "full"
                } : undefined}
              >
                {link.label}
              </ChakraLink>
            );
          })}
        </HStack>

        <HStack spacing={3}>
          {user ? (
            <>
              <Text fontSize="sm" color="gray.600" display={{ base: "none", md: "block" }}>
                {user.nome} ({user.role === "gestor" ? "Gestor" : "Cidadão"})
              </Text>
              <Button size="sm" variant="outline" colorScheme="brand" onClick={logout}>
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} href="/login" size="sm" variant="ghost">
                Entrar
              </Button>
              <Button as={Link} href="/cadastro" size="sm" colorScheme="brand">
                Criar conta
              </Button>
            </>
          )}
          <IconButton
            aria-label="Menu"
            icon={isOpen ? <FiX /> : <FiMenu />}
            display={{ base: "inline-flex", md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
        </HStack>
      </Flex>

      {isOpen && (
        <Box display={{ md: "none" }} mt={3}>
          <Stack spacing={2}>
            {links.map((link) => (
              <Button key={link.href} as={Link} href={link.href} variant="ghost" justifyContent="flex-start">
                {link.label}
              </Button>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}