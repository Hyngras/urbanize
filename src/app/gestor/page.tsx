"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { DemandCard } from "@/components/demandas/DemandCard";
import { useMetrics } from "@/hooks/useMetrics";
import { useDemandStore } from "@/store/demandStore";
import {
  Box,
  Button,
  Circle,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  Select,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FiBarChart2,
  FiSearch,
  FiSend,
  FiActivity,
  FiCpu,
  FiCheckCircle,
  FiExternalLink,
  FiShield,
  FiInbox,
} from "react-icons/fi";

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
      {/* Header */}
      <Flex
        justify="space-between"
        align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        gap={4}
        mb={8}
      >
        <VStack align="start" spacing={1}>
          <HStack spacing={2}>
            <Circle size="8px" bg="green.400" />
            <Text fontSize="xs" color="gray.400" fontWeight="semibold" textTransform="uppercase" letterSpacing="wider">
              Modo gestor
            </Text>
          </HStack>
          <HStack spacing={2}>
            <Icon as={FiShield} color="brand.500" boxSize={5} />
            <Heading size="lg" color="gray.800">Painel do Gestor</Heading>
          </HStack>
          <Text color="gray.500" fontSize="sm">Monitore, priorize e encaminhe demandas</Text>
        </VStack>
      </Flex>

      {/* Métricas */}
      <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={4} mb={8}>
        <MetricsCard label="Total" value={metrics?.total ?? 0} icon={FiBarChart2} accentColor="brand" />
        <MetricsCard label="Em análise" value={metrics?.porStatus?.em_analise ?? 0} icon={FiSearch} accentColor="yellow" />
        <MetricsCard label="Encaminhadas" value={metrics?.porStatus?.encaminhada ?? 0} icon={FiSend} accentColor="cyan" />
        <MetricsCard label="Em atendimento" value={metrics?.porStatus?.em_atendimento ?? 0} icon={FiActivity} accentColor="orange" />
      </Grid>

      {/* Fila recente */}
      <Box
        bg="white"
        rounded="xl"
        border="1px solid"
        borderColor="gray.100"
        shadow="sm"
        overflow="hidden"
        mb={5}
      >
        <Flex
          justify="space-between"
          align="center"
          px={6}
          py={4}
          borderBottom="1px solid"
          borderColor="gray.50"
          bg="gray.50"
        >
          <HStack spacing={3}>
            <Circle size="36px" bg="brand.50" color="brand.500">
              <Icon as={FiInbox} boxSize={4} />
            </Circle>
            <Box>
              <Text fontWeight="semibold" fontSize="sm" color="gray.800">Fila recente</Text>
              <Text fontSize="xs" color="gray.500">Filtre por status para refinar</Text>
            </Box>
          </HStack>
          <Select
            maxW="200px"
            size="sm"
            value={status}
            onChange={(e) => handleStatus(e.target.value)}
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            rounded="lg"
            _hover={{ borderColor: "gray.300" }}
            _focus={{ borderColor: "brand.400", boxShadow: "0 0 0 1px var(--chakra-colors-brand-400)" }}
          >
            <option value="">Todos</option>
            <option value="registrada">Registrada</option>
            <option value="em_analise">Em análise</option>
            <option value="encaminhada">Encaminhada</option>
            <option value="em_atendimento">Em atendimento</option>
            <option value="resolvida">Resolvida</option>
            <option value="cancelada">Cancelada</option>
          </Select>
        </Flex>
        <Box px={6} py={4}>
          <Stack spacing={3}>
            {demands.slice(0, 5).map((d) => (
              <DemandCard key={d.id} demand={d} />
            ))}
            {demands.length === 0 && (
              <Flex direction="column" align="center" py={10} gap={3}>
                <Circle size="48px" bg="gray.100" color="gray.400">
                  <Icon as={FiInbox} boxSize={5} />
                </Circle>
                <Text color="gray.400" fontSize="sm">Nenhuma demanda encontrada.</Text>
              </Flex>
            )}
          </Stack>
        </Box>
      </Box>

      {/* Triagem automática */}
      <Box
        bg="white"
        rounded="xl"
        border="1px solid"
        borderColor="gray.100"
        shadow="sm"
        overflow="hidden"
      >
        <Flex
          justify="space-between"
          align={{ base: "start", md: "center" }}
          px={6}
          py={4}
          borderBottom="1px solid"
          borderColor="gray.50"
          bg="gray.50"
          gap={3}
          direction={{ base: "column", md: "row" }}
        >
          <HStack spacing={3}>
            <Circle size="36px" bg="purple.50" color="purple.500">
              <Icon as={FiCpu} boxSize={4} />
            </Circle>
            <Box>
              <Text fontWeight="semibold" fontSize="sm" color="gray.800">Triagem Inteligente</Text>
              <Text fontSize="xs" color="gray.500">Sugestões da IA para revisão do gestor</Text>
            </Box>
          </HStack>
          {triageQueue.length > 0 && (
            <HStack
              bg="purple.50"
              color="purple.600"
              px={3}
              py={1}
              rounded="full"
              fontSize="xs"
              fontWeight="bold"
            >
              <Circle size="6px" bg="purple.400" />
              <Text>{triageQueue.length} pendente{triageQueue.length > 1 ? "s" : ""}</Text>
            </HStack>
          )}
        </Flex>
        <Box px={6} py={4}>
          {triageQueue.length === 0 ? (
            <Flex direction="column" align="center" py={10} gap={3}>
              <Circle size="48px" bg="green.50" color="green.400">
                <Icon as={FiCheckCircle} boxSize={5} />
              </Circle>
              <Text color="gray.500" fontSize="sm">Nenhuma demanda em análise no momento.</Text>
              <Text color="gray.400" fontSize="xs">Tudo em dia!</Text>
            </Flex>
          ) : (
            <Stack spacing={3}>
              {triageQueue.map((d) => (
                <Box
                  key={d.id}
                  p={5}
                  border="1px solid"
                  borderColor="gray.100"
                  rounded="xl"
                  bg="gray.50"
                  _hover={{ borderColor: "purple.200", shadow: "sm" }}
                  transition="all 0.2s"
                >
                  <Flex
                    justify="space-between"
                    align={{ base: "start", md: "center" }}
                    gap={4}
                    direction={{ base: "column", md: "row" }}
                  >
                    <Stack spacing={2} flex={1}>
                      <Text fontSize="xs" color="gray.400" fontWeight="semibold" textTransform="uppercase" letterSpacing="wide">
                        {d.protocolo}
                      </Text>
                      <Heading size="sm" color="gray.800">{d.titulo}</Heading>
                      <HStack spacing={4} flexWrap="wrap">
                        <Box>
                          <Text fontSize="xs" color="gray.400">Órgão sugerido</Text>
                          <Text fontSize="sm" fontWeight="medium" color="gray.700">
                            {d.sugestaoEncaminhamento ?? "(não informado)"}
                          </Text>
                        </Box>
                        <Box>
                          <Text fontSize="xs" color="gray.400">Confiança</Text>
                          <HStack spacing={2}>
                            <Box w="60px" bg="gray.200" rounded="full" h="6px" overflow="hidden">
                              <Box
                                bg="purple.400"
                                h="full"
                                w={`${Math.round((d.scoreTriagem ?? 0.7) * 100)}%`}
                                rounded="full"
                              />
                            </Box>
                            <Text fontSize="sm" fontWeight="bold" color="purple.500">
                              {Math.round((d.scoreTriagem ?? 0.7) * 100)}%
                            </Text>
                          </HStack>
                        </Box>
                      </HStack>
                    </Stack>
                    <HStack spacing={2} flexShrink={0}>
                      <Button
                        size="sm"
                        colorScheme="brand"
                        leftIcon={<FiCheckCircle />}
                        onClick={() => handleAccept(d.id, d.sugestaoEncaminhamento ?? "Aceito triagem")}
                        shadow="sm"
                        _hover={{ shadow: "md", transform: "translateY(-1px)" }}
                        transition="all 0.2s"
                      >
                        Aceitar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        as={Link}
                        href={`/demandas/${d.id}`}
                        rightIcon={<FiExternalLink />}
                      >
                        Revisar
                      </Button>
                    </HStack>
                  </Flex>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      </Box>
    </AppLayout>
  );
}
