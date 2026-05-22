import { Box, Flex, Text, Link as ChakraLink, Stack } from "@chakra-ui/react";
import Link from "next/link";

export function AppFooter() {
  return (
    <Box as="footer" bg="gray.900" color="gray.100" py={8} mt={10}>
      <Flex direction={{ base: "column", md: "row" }} maxW="1200px" mx="auto" px={4} justify="space-between" gap={4}>
        <Stack spacing={1}>
          <Text fontWeight="bold">Urbanize</Text>
          <Text color="gray.400">Transparência e agilidade na gestão urbana.</Text>
        </Stack>
        <Stack spacing={1}>
          <ChakraLink as={Link} href="/demandas" color="gray.200">Demandas</ChakraLink>

        </Stack>
        <Stack spacing={1}>
          <Text color="gray.400">Triagem inteligente pronta para integrar com IA.</Text>
          <Text color="gray.400">Versão acadêmica — Avaliação 1.</Text>
        </Stack>
      </Flex>
    </Box>
  );
}
