"use client";

import { Box, Button, Flex, HStack } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";

export function AppNavbar() {
  const { user } = useAuthStore();

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

        {!user && (
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
