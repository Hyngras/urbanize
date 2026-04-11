"use client";

import { Box, Button, Flex, HStack, IconButton, Link as ChakraLink, useDisclosure } from "@chakra-ui/react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { FiMenu, FiX } from "react-icons/fi";

const links = [
  { href: "/demandas", label: "Demandas" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/gestor", label: "Painel do Gestor" },
];

export function AppNavbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, logout } = useAuthStore();

  return (
    <Box as="header" bg="white" borderBottom="1px solid" borderColor="gray.100" px={4} py={3} position="sticky" top={0} zIndex={10}>
      <Flex align="center" justify="space-between" maxW="1200px" mx="auto" gap={3}>
        <Flex align="center" gap={2}>
          <Button as={Link} href="/" variant="ghost" colorScheme="brand" fontWeight="bold" px={0}>
            Urbanize
          </Button>
        </Flex>
        <HStack display={{ base: "none", md: "flex" }} spacing={4}>
          {links.map((link) => (
            <ChakraLink key={link.href} as={Link} href={link.href} color="gray.700" fontWeight="medium">
              {link.label}
            </ChakraLink>
          ))}
        </HStack>
        <HStack spacing={3}>
          {user ? (
            <>
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
