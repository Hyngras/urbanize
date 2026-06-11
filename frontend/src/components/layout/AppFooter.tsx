import { Box, Flex, Text, Stack } from "@chakra-ui/react";

export function AppFooter() {
  return (
    <Box as="footer" bg="gray.900" color="gray.100" py={8} mt={10}>
      <Flex maxW="1200px" mx="auto" px={4} justify="center">
        <Stack spacing={1} textAlign="center" align="center">
          <Text fontWeight="bold">Urbanize</Text>
          <Text color="gray.400">Transparência e agilidade na gestão urbana.</Text>
        </Stack>
      </Flex>
    </Box>
  );
}
