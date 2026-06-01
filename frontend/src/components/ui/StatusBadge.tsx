import { Badge } from "@chakra-ui/react";
import { statusColor, statusLabel } from "@/utils/statusLabel";
import { DemandStatus } from "@/types/demand";

export function StatusBadge({ status }: { status: DemandStatus }) {
  return (
    <Badge colorScheme={statusColor[status]} rounded="full" px={3} py={1} textTransform="none">
      {statusLabel[status]}
    </Badge>
  );
}
