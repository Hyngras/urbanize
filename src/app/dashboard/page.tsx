"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { DemandCard } from "@/components/demandas/DemandCard";
import { PageHeader } from "@/components/common/PageHeader";
import { useMetrics } from "@/hooks/useMetrics";
import { useDemandStore } from "@/store/demandStore";
import { Box, Grid, Heading, Stack, Text } from "@chakra-ui/react";
import { useEffect } from "react";

export default function DashboardPage() {
  const { metrics } = useMetrics();
  const { demands, fetchDemands } = useDemandStore();

  useEffect(() => {
    fetchDemands();
  }, [fetchDemands]);

  return (
    <AppLayout>
      <PageHeader title="Dashboard" subtitle="Resumo das suas solicitações" ctaLabel="Nova demanda" ctaHref="/demandas/nova" />
      <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={4} mb={6}>
        <MetricsCard label="Total" value={metrics?.total ?? 0} />
        <MetricsCard label="Em atendimento" value={metrics?.porStatus?.em_atendimento ?? 0} />
        <MetricsCard label="Resolvidas" value={metrics?.porStatus?.resolvida ?? 0} />
        <MetricsCard label="Tempo médio" value={`${metrics?.tempoMedioAtendimentoDias ?? 0} dias`} />
      </Grid>
      <Heading size="md" mb={3}>Últimas demandas</Heading>
      <Stack spacing={3}>
        {demands.slice(0, 4).map((d) => (
          <DemandCard key={d.id} demand={d} />
        ))}
        {demands.length === 0 && <Text color="gray.500">Nenhuma demanda recente.</Text>}
      </Stack>
    </AppLayout>
  );
}
