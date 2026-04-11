"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { DemandCard } from "@/components/demandas/DemandCard";
import { PageHeader } from "@/components/common/PageHeader";
import { useMetrics } from "@/hooks/useMetrics";
import { useDemandStore } from "@/store/demandStore";
import { Box, Button, Flex, Grid, Heading, Select, Stack, Text, useToast } from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function GestorPage() {
  const { metrics } = useMetrics();
  const { demands, fetchDemands, filters, setFilters, updateDemandStatus } = useDemandStore();
  const toast = useToast();
  const [status, setStatus] = useState(filters.status ?? "");

  useEffect(() => {
    fetchDemands(filters);
  }, [filters, fetchDemands]);

  const triageQueue = useMemo(
    () => demands.filter((d) => d.status === "em_analise"),
    [demands]
  );

  const handleAccept = async (id: string, suggested?: string) => {
    await updateDemandStatus(id, "encaminhada", suggested ?? "Aceito triagem");
    toast({ title: "Triagem aceita e encaminhada", status: "success" });
  };

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

      <Box bg="white" p={4} rounded="lg" border="1px solid" borderColor="gray.100">
        <Flex justify="space-between" align={{ base: "flex-start", md: "center" }} mb={3} gap={3} direction={{ base: "column", md: "row" }}>
          <Heading size="sm">Triagem automática (mock)</Heading>
          <Text color="gray.500">Sugestões vindas da triagem inteligente para revisão do gestor.</Text>
        </Flex>
        {triageQueue.length === 0 ? (
          <Text color="gray.500">Nenhuma demanda em análise no momento.</Text>
        ) : (
          <Stack spacing={3}>
            {triageQueue.map((d) => (
              <Box key={d.id} p={4} border="1px solid" borderColor="gray.100" rounded="md" bg="gray.50">
                <Flex justify="space-between" align={{ base: "flex-start", md: "center" }} gap={3} direction={{ base: "column", md: "row" }}>
                  <Box>
                    <Text fontSize="sm" color="gray.500">Protocolo {d.protocolo}</Text>
                    <Heading size="sm" mb={1}>{d.titulo}</Heading>
                    <Text color="gray.600" mb={1}>Sugestão de órgão: {d.sugestaoEncaminhamento ?? "(não informado)"}</Text>
                    <Text color="gray.600">Confiança mock: {Math.round((d.scoreTriagem ?? 0.7) * 100)}%</Text>
                  </Box>
                  <Flex gap={2} wrap="wrap">
                    <Button size="sm" colorScheme="brand" onClick={() => handleAccept(d.id, d.sugestaoEncaminhamento ?? "Aceito triagem")}>Aceitar sugestão</Button>
                    <Button size="sm" variant="outline" as={Link} href={`/demandas/${d.id}`}>Revisar/editar</Button>
                  </Flex>
                </Flex>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </AppLayout>
  );
}
