import { Box, Stat, StatHelpText, StatLabel, StatNumber } from "@chakra-ui/react";

export function MetricsCard({ label, value, help }: { label: string; value: number | string; help?: string }) {
  return (
    <Box bg="white" p={4} rounded="lg" border="1px solid" borderColor="gray.100" shadow="sm">
      <Stat>
        <StatLabel>{label}</StatLabel>
        <StatNumber>{value}</StatNumber>
        {help && <StatHelpText>{help}</StatHelpText>}
      </Stat>
    </Box>
  );
}
