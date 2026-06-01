import { Button, Flex, Heading, HStack, Text } from "@chakra-ui/react";
import Link from "next/link";

interface Props {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function PageHeader({ title, subtitle, ctaLabel, ctaHref }: Props) {
  return (
    <Flex justify="space-between" align={{ base: "flex-start", md: "center" }} gap={3} mb={4} direction={{ base: "column", md: "row" }}>
      <div>
        <Heading size="lg">{title}</Heading>
        {subtitle && <Text color="gray.600">{subtitle}</Text>}
      </div>
      {ctaLabel && ctaHref && (
        <HStack>
          <Button as={Link} href={ctaHref} colorScheme="brand">
            {ctaLabel}
          </Button>
        </HStack>
      )}
    </Flex>
  );
}
