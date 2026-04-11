"use client";

import { Box, Flex } from "@chakra-ui/react";
import { AppNavbar } from "./AppNavbar";
import { AppFooter } from "./AppFooter";
import { ReactNode } from "react";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Box minH="100vh" bg="gray.50">
      <AppNavbar />
      <Box as="main" maxW="1200px" mx="auto" px={4} py={6}>
        {children}
      </Box>
      <AppFooter />
    </Box>
  );
}
