import { Box, Button, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";

export function EmptyState({ message, actionLabel, actionHref }: { message: string; actionLabel?: string; actionHref?: string }) {
  return (
    <Box bg="white" p={6} rounded="lg" border="1px solid" borderColor="gray.100" textAlign="center">
      <Text color="gray.600" mb={3}>{message}</Text>
      {actionLabel && actionHref && (
        <Button as={Link} href={actionHref} colorScheme="brand">
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
