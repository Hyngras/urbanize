import { Box, Stack, Text, Badge, HStack } from "@chakra-ui/react";
import { DemandHistoryItem } from "@/types/demand";
import { formatDate } from "@/utils/formatDate";
import { statusColor, statusLabel } from "@/utils/statusLabel";

export function DemandTimeline({ history }: { history: DemandHistoryItem[] }) {
  return (
    <Stack spacing={3}>
      {history.map((item) => (
        <HStack key={item.id} align="flex-start" spacing={3}>
          <Badge colorScheme={statusColor[item.status]}>{statusLabel[item.status]}</Badge>
          <Box>
            <Text fontWeight="semibold">{item.descricao}</Text>
            <Text fontSize="sm" color="gray.500">{formatDate(item.data)} — {item.autor}</Text>
          </Box>
        </HStack>
      ))}
    </Stack>
  );
}
