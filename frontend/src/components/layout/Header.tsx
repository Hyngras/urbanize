"use client";

import { Box, Button, Flex, Heading, HStack, Icon, Text } from "@chakra-ui/react";
import { useAuthStore } from "@/store/authStore";
import { FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";

export function Header() {
  const { user, logout } = useAuthStore();

  return (
    <Flex
      as="header"
      h="64px"
      align="center"
      justify="space-between"
      px={6}
      borderBottom="1px solid"
      borderColor="gray.100"
      bg="white"
    >
      <Heading size="md" color="brand.600">
        <Link href="/">Urbanize</Link>
      </Heading>
      <HStack spacing={4}>
        <Box textAlign="right">
          <Text fontWeight="semibold" lineHeight="short">
            {user?.nome ?? "Visitante"}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {user?.role === "gestor" ? "Gestor" : user ? "Cidadão" : "Não autenticado"}
          </Text>
        </Box>
        <Button size="sm" variant="outline" onClick={logout} leftIcon={<Icon as={FaSignOutAlt} />}>
          Sair
        </Button>
      </HStack>
    </Flex>
  );
}
