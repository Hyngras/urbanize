import { Heading, Text, VStack } from "@chakra-ui/react";

export function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <VStack align="flex-start" spacing={1} mb={4}>
      <Heading size="md">{title}</Heading>
      {subtitle && <Text color="gray.600">{subtitle}</Text>}
    </VStack>
  );
}
