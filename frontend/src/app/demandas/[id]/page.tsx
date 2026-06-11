"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { DemandTimeline } from "@/components/demandas/DemandTimeline";
import { useDemandStore } from "@/store/demandStore";
import { formatDate } from "@/utils/formatDate";
import { formatLocation } from "@/utils/locationLabel";
import { statusLabel } from "@/utils/statusLabel";
import { DemandStatus } from "@/types/demand";
import { Box, Button, Flex, Grid, Heading, SimpleGrid, Stack, Text, Textarea, useToast } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RoleProtectedRoute } from "@/components/auth/RoleProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

const statusActions: Array<{ status: DemandStatus; label: string; colorScheme: string; description: string }> = [
  {
    status: "em_analise",
    label: "Enviar para análise",
    colorScheme: "orange",
    description: "Coloca a demanda novamente na fila de triagem/análise.",
  },
  {
    status: "encaminhada",
    label: "Encaminhar",
    colorScheme: "brand",
    description: "Encaminha a demanda ao órgão responsável.",
  },
  {
    status: "em_atendimento",
    label: "Iniciar atendimento",
    colorScheme: "cyan",
    description: "Indica que o órgão responsável iniciou o atendimento.",
  },
  {
    status: "resolvida",
    label: "Marcar como resolvida",
    colorScheme: "green",
    description: "Finaliza a demanda como resolvida.",
  },
  {
    status: "cancelada",
    label: "Cancelar demanda",
    colorScheme: "red",
    description: "Cancela a demanda e encerra o fluxo.",
  },
];

export default function DemandDetailPage() {
  const params = useParams<{ id: string }>();
  const toast = useToast();
  const { selected, fetchDemandById, updateDemandStatus, loading } = useDemandStore();
  const [observacao, setObservacao] = useState("");

  const { user } = useAuth();

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

  const handleStatusChange = async (status: DemandStatus) => {
    await updateDemandStatus(
      selected.id,
      status,
      observacao || `Status alterado para ${statusLabel[status]}`
    );
    toast({ title: `Demanda marcada como ${statusLabel[status].toLowerCase()}`, status: "success" });
  };

  return (
    <RoleProtectedRoute allowedRoles={["cidadao", "gestor"]}>
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

      <Grid templateColumns={{ base: "1fr", lg: user?.role === "gestor" ? "2fr 1fr" : "1fr" }} gap={6}>
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
          {user?.role === "gestor" && (
            <Box bg="white" p={5} rounded="lg" border="1px solid" borderColor="gray.100">
              <Heading size="sm" mb={2}>Ação do gestor</Heading>
              <Text color="gray.500" fontSize="sm" mb={3}>
                Status atual: <Text as="span" fontWeight="semibold" color="gray.700">{statusLabel[selected.status]}</Text>
              </Text>
              <Textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Observação ou despacho"
                mb={4}
              />
              <SimpleGrid columns={1} spacing={3}>
                {statusActions.map((action) => {
                  const isCurrentStatus = selected.status === action.status;

                  return (
                    <Button
                      key={action.status}
                      colorScheme={action.colorScheme}
                      variant={isCurrentStatus ? "solid" : "outline"}
                      onClick={() => handleStatusChange(action.status)}
                      isLoading={loading}
                      isDisabled={isCurrentStatus}
                      title={action.description}
                      w="full"
                      minH="44px"
                      h="auto"
                      whiteSpace="normal"
                      textAlign="center"
                      py={3}
                    >
                      {isCurrentStatus ? `Atual: ${statusLabel[action.status]}` : action.label}
                    </Button>
                  );
                })}
              </SimpleGrid>
            </Box>
          )}
        </Stack>
      </Grid>
    </AppLayout>
    </RoleProtectedRoute>
  );
}
