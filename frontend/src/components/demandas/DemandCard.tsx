import { Box, Flex, Heading, HStack, Icon, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { Demand } from "@/types/demand";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { formatDate } from "@/utils/formatDate";
import { categoryLabel } from "@/utils/categoryLabel";
import { formatLocation } from "@/utils/locationLabel";
import { FiMapPin, FiCalendar, FiTag } from "react-icons/fi";

export function DemandCard({ demand }: { demand: Demand }) {
  return (
    <Box
      as={Link}
      href={`/demandas/${demand.id}`}
      p={5}
      rounded="xl"
      bg="white"
      border="1px solid"
      borderColor="gray.100"
      shadow="sm"
      _hover={{ shadow: "lg", borderColor: "brand.200", transform: "translateY(-2px)" }}
      transition="all 0.25s"
      display="block"
    >
      <Flex justify="space-between" align="start" gap={4} direction={{ base: "column", md: "row" }}>
        <Stack spacing={2} minW={0} flex={1}>
          <HStack spacing={2}>
            <Text fontSize="xs" color="gray.400" fontWeight="semibold" letterSpacing="wide" textTransform="uppercase">
              {demand.protocolo}
            </Text>
            <PriorityBadge priority={demand.prioridade} />
          </HStack>
          <Heading size="md" noOfLines={1} color="gray.800">{demand.titulo}</Heading>
          <Text color="gray.500" noOfLines={2} fontSize="sm" lineHeight="tall">{demand.descricao}</Text>
          <HStack spacing={4} pt={1} flexWrap="wrap">
            <HStack spacing={1} color="gray.400" fontSize="xs">
              <Icon as={FiMapPin} boxSize={3} />
              <Text>{formatLocation(demand.endereco)}</Text>
            </HStack>
            <HStack spacing={1} color="gray.400" fontSize="xs">
              <Icon as={FiTag} boxSize={3} />
              <Text>{categoryLabel[demand.categoria]}</Text>
            </HStack>
            <HStack spacing={1} color="gray.400" fontSize="xs">
              <Icon as={FiCalendar} boxSize={3} />
              <Text>{formatDate(demand.criadaEm)}</Text>
            </HStack>
          </HStack>
        </Stack>
        <Box flexShrink={0} pt={{ base: 0, md: 1 }}>
          <StatusBadge status={demand.status} />
        </Box>
      </Flex>
    </Box>
  );
}
