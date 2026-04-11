import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { Demand } from "@/types/demand";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { formatDate } from "@/utils/formatDate";
import { categoryLabel } from "@/utils/categoryLabel";
import { formatLocation } from "@/utils/locationLabel";

export function DemandCard({ demand }: { demand: Demand }) {
  return (
    <Box
      as={Link}
      href={`/demandas/${demand.id}`}
      p={5}
      rounded="lg"
      bg="white"
      border="1px solid"
      borderColor="gray.100"
      shadow="xs"
      _hover={{ shadow: "md" }}
      transition="all 0.2s"
    >
      <Flex justify="space-between" align={{ base: "flex-start", md: "center" }} gap={3} wrap="wrap">
        <Stack spacing={1} minW={0} flex={1}>
          <Text fontSize="sm" color="gray.500">Protocolo {demand.protocolo}</Text>
          <Heading size="md" noOfLines={1}>{demand.titulo}</Heading>
          <Text color="gray.600" noOfLines={2}>{demand.descricao}</Text>
          <Text fontSize="sm" color="gray.500">{formatLocation(demand.endereco)}</Text>
        </Stack>
        <Stack align="flex-end" spacing={2}>
          <StatusBadge status={demand.status} />
          <PriorityBadge priority={demand.prioridade} />
          <Text fontSize="sm" color="gray.500">{categoryLabel[demand.categoria]}</Text>
          <Text fontSize="sm" color="gray.500">{formatDate(demand.criadaEm)}</Text>
        </Stack>
      </Flex>
    </Box>
  );
}
