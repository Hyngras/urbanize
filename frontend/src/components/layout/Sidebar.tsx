"use client";

import { Box, Button, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/demandas", label: "Demandas" },
  { href: "/demandas/nova", label: "Nova demanda" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <Box as="nav" w={{ base: "full", md: 64 }} bg="white" borderRight="1px solid" borderColor="gray.100" p={4}>
      <Text fontWeight="semibold" color="gray.500" mb={3}>
        Navegação
      </Text>
      <Stack spacing={2}>
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Button
              key={link.href}
              as={Link}
              href={link.href}
              variant={isActive ? "solid" : "ghost"}
              colorScheme="brand"
              justifyContent="flex-start"
            >
              {link.label}
            </Button>
          );
        })}
      </Stack>
    </Box>
  );
}
