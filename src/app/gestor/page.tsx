"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { DemandCard } from "@/components/demandas/DemandCard";
import { PageHeader } from "@/components/common/PageHeader";
import { useMetrics } from "@/hooks/useMetrics";
import { useDemandStore } from "@/store/demandStore";
import { Box, Grid, Heading, Select, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function GestorPage() {
  const { metrics } = useMetrics();
  const { demands, fetchDemands, filters, setFilters } = useDemandStore();
  const [status, setStatus] = useState(filters.status ?? "");

  useEffect(() => {
    fetchDemands(filters);
  }, [filters, fetchDemands]);

  const handleStatus = (value: string) => {
    setStatus(value);
    setFilters({ ...filters, status: value || undefined });
  };

  return (
    <AppLayout>
      <PageHeader title="Painel do Gestor" subtitle="Monitore e priorize as demandas" />
      <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={4} mb={6}>
        <MetricsCard label="Total" value={metrics?.total ?? 0} />
        <MetricsCard label="Em análise" value={metrics?.porStatus?.em_analise ?? 0} />
        <MetricsCard label="Encaminhadas" value={metrics?.porStatus?.encaminhada ?? 0} />
        <MetricsCard label="Em atendimento" value={metrics?.porStatus?.em_atendimento ?? 0} />
      </Grid>

      <Box bg="white" p={4} rounded="lg" border="1px solid" borderColor="gray.100" mb={4}>
        <Heading size="sm" mb={2}>Fila recente</Heading>
        <Select maxW="220px" value={status} onChange={(e) => handleStatus(e.target.value)} mb={3}>
          <option value="">Todos</option>
          <option value="registrada">Registrada</option>
          <option value="em_analise">Em análise</option>
          <option value="encaminhada">Encaminhada</option>
          <option value="em_atendimento">Em atendimento</option>
          <option value="resolvida">Resolvida</option>
          <option value="cancelada">Cancelada</option>
        </Select>
        <Stack spacing={3}>
          {demands.slice(0, 5).map((d) => (
            <DemandCard key={d.id} demand={d} />
          ))}
        </Stack>
      </Box>
    </AppLayout>
  );
}
