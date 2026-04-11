"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { DemandTimeline } from "@/components/demandas/DemandTimeline";
import { useDemandStore } from "@/store/demandStore";
import { formatDate } from "@/utils/formatDate";
import { categoryLabel } from "@/utils/categoryLabel";
import { formatLocation } from "@/utils/locationLabel";
import { Box, Button, Flex, Grid, Heading, Stack, Text, Textarea, useToast } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DemandDetailPage() {
  const params = useParams<{ id: string }>();
  const toast = useToast();
  const { selected, fetchDemandById, updateDemandStatus, loading } = useDemandStore();
  const [observacao, setObservacao] = useState("");

  useEffect(() => {
    if (params?.id) fetchDemandById(params.id);
  }, [params?.id, fetchDemandById]);

  if (!selected) {
    return (
      <AppLayout>
        <Text>Carregando demanda...</Text>
      </AppLayout>
    );
  }

  const handleAdvance = async () => {
    await updateDemandStatus(selected.id, "encaminhada", observacao || "Atualização" );
    toast({ title: "Status atualizado", status: "success" });
  };

  return (
    <AppLayout>
      <Flex justify="space-between" align={{ base: "flex-start", md: "center" }} mb={4} gap={3}>
        <Box>
          <Text color="gray.500">Protocolo {selected.protocolo}</Text>
          <Heading>{selected.titulo}</Heading>
          <Text color="gray.600">Registrada em {formatDate(selected.criadaEm)}</Text>
        </Box>
        <Stack align="flex-end" spacing={2}>
          <StatusBadge status={selected.status} />
          <PriorityBadge priority={selected.prioridade} />
        </Stack>
      </Flex>

      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
        <Stack spacing={4}>
          <Box bg="white" p={5} rounded="lg" border="1px solid" borderColor="gray.100">
            <Heading size="sm" mb={2}>Descrição</Heading>
            <Text color="gray.700">{selected.descricao}</Text>
          </Box>
          <Box bg="white" p={5} rounded="lg" border="1px solid" borderColor="gray.100">
            <Heading size="sm" mb={2}>Localização</Heading>
            <Text color="gray.700">{formatLocation(selected.endereco)}</Text>
          </Box>
          <Box bg="white" p={5} rounded="lg" border="1px solid" borderColor="gray.100">
            <Heading size="sm" mb={3}>Histórico</Heading>
            <DemandTimeline history={selected.historico} />
          </Box>
        </Stack>

        <Stack spacing={4}>
          <Box bg="white" p={5} rounded="lg" border="1px solid" borderColor="gray.100">
            <Heading size="sm" mb={2}>Triagem automática (mock)</Heading>
            <Text>Categoria sugerida: {categoryLabel[selected.categoria]}</Text>
            <Text>Órgão sugerido: {selected.sugestaoEncaminhamento ?? "—"}</Text>
            <Text>Confiança: {Math.round((selected.scoreTriagem ?? 0.72) * 100)}%</Text>
          </Box>
          <Box bg="white" p={5} rounded="lg" border="1px solid" borderColor="gray.100">
            <Heading size="sm" mb={2}>Ação do gestor</Heading>
            <Textarea value={observacao} onChange={(e) => setObservacao(e.target.value)} placeholder="Observação ou despacho" mb={3} />
            <Button colorScheme="brand" onClick={handleAdvance} isLoading={loading}>
              Encaminhar
            </Button>
          </Box>
        </Stack>
      </Grid>
    </AppLayout>
  );
}
