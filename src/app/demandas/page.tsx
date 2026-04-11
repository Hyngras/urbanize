"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { DemandCard } from "@/components/demandas/DemandCard";
import { DemandFilters } from "@/components/demandas/DemandFilters";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { useDemands } from "@/hooks/useDemands";
import { Grid } from "@chakra-ui/react";

export default function DemandListPage() {
  const { demands, loading, error } = useDemands();

  return (
    <AppLayout>
      <PageHeader title="Demandas" subtitle="Visualize e filtre as solicitações" ctaLabel="Nova demanda" ctaHref="/demandas/nova" />
      <DemandFilters />
      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}
      {!loading && !error && demands.length === 0 && (
        <EmptyState message="Nenhuma demanda encontrada" actionLabel="Criar demanda" actionHref="/demandas/nova" />
      )}
      {!loading && !error && demands.length > 0 && (
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
          {demands.map((demand) => (
            <DemandCard key={demand.id} demand={demand} />
          ))}
        </Grid>
      )}
    </AppLayout>
  );
}
