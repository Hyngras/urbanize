import { Box, Circle, Flex, Icon, Stat, StatHelpText, StatLabel, StatNumber } from "@chakra-ui/react";
import { IconType } from "react-icons";

export function MetricsCard({
  label,
  value,
  help,
  icon,
  accentColor = "brand",
}: {
  label: string;
  value: number | string;
  help?: string;
  icon?: IconType;
  accentColor?: string;
}) {
  return (
    <Box
      bg="white"
      p={5}
      rounded="xl"
      border="1px solid"
      borderColor="gray.100"
      shadow="sm"
      _hover={{ shadow: "md", borderColor: `${accentColor}.200` }}
      transition="all 0.25s"
    >
      <Flex align="start" gap={3}>
        {icon && (
          <Circle size="40px" bg={`${accentColor}.50`} color={`${accentColor}.500`} flexShrink={0}>
            <Icon as={icon} boxSize={4} />
          </Circle>
        )}
        <Stat>
          <StatLabel fontSize="xs" fontWeight="semibold" color="gray.500" textTransform="uppercase" letterSpacing="wide">
            {label}
          </StatLabel>
          <StatNumber fontSize="2xl" fontWeight="bold" color="gray.800">{value}</StatNumber>
          {help && <StatHelpText fontSize="xs" color="gray.400" mb={0}>{help}</StatHelpText>}
        </Stat>
      </Flex>
    </Box>
  );
}
