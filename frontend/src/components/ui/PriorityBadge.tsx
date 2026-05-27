import { Badge } from "@chakra-ui/react";
import { DemandPriority } from "@/types/demand";
import { priorityColor, priorityLabel } from "@/utils/priorityLabel";

export function PriorityBadge({ priority }: { priority: DemandPriority }) {
  return (
    <Badge colorScheme={priorityColor[priority]} rounded="full" px={3} py={1} textTransform="none">
      {priorityLabel[priority]}
    </Badge>
  );
}
