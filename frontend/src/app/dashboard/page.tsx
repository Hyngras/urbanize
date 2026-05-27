"use client";

import { RoleProtectedRoute } from "@/components/auth/RoleProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { DemandCard } from "@/components/demandas/DemandCard";
import { useMetrics } from "@/hooks/useMetrics";
import { useDemandStore } from "@/store/demandStore";
import { useAuth } from "@/hooks/useAuth";
import {
  Box,
  Button,
  Circle,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import Link from "next/link";
import {
  FiBarChart2,
  FiClock,
  FiCheckCircle,
  FiTrendingUp,
  FiPlus,
  FiArrowRight,
  FiInbox,
  FiActivity,
} from "react-icons/fi";

export default function DashboardPage() {
  const { metrics } = useMetrics();
  const { demands, fetchDemands } = useDemandStore();
  const { user } = useAuth();
  const myDemands = demands.filter((d) => d.emailSolicitante === user?.email);

  useEffect(() => {
    fetchDemands();
  }, [fetchDemands]);

  return (
    <RoleProtectedRoute allowedRoles={["cidadao"]}>
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
              Painel ativo
            </Text>
          </HStack>
          <Heading size="lg" color="gray.800">Dashboard</Heading>
          <Text color="gray.500" fontSize="sm">Resumo das suas solicitações</Text>
        </VStack>
        <Button
          as={Link}
          href="/demandas/nova"
          colorScheme="brand"
          leftIcon={<FiPlus />}
          shadow="sm"
          _hover={{ shadow: "md", transform: "translateY(-1px)" }}
          transition="all 0.2s"
        >
          Nova demanda
        </Button>
      </Flex>

      {/* Métricas */}
      <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={4} mb={8}>
        <MetricsCard label="Total" value={metrics?.total ?? 0} icon={FiBarChart2} accentColor="brand" />
        <MetricsCard label="Em atendimento" value={metrics?.porStatus?.em_atendimento ?? 0} icon={FiActivity} accentColor="orange" />
        <MetricsCard label="Resolvidas" value={metrics?.porStatus?.resolvida ?? 0} icon={FiCheckCircle} accentColor="green" />
        <MetricsCard label="Tempo médio" value={`${metrics?.tempoMedioAtendimentoDias ?? 0} dias`} icon={FiClock} accentColor="purple" />
      </Grid>

      {/* Últimas demandas */}
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
              <Text fontWeight="semibold" fontSize="sm" color="gray.800">Últimas demandas</Text>
              <Text fontSize="xs" color="gray.500">Solicitações mais recentes</Text>
            </Box>
          </HStack>
          <Button
            as={Link}
            href="/demandas"
            variant="ghost"
            size="sm"
            color="brand.500"
            rightIcon={<FiArrowRight />}
            _hover={{ bg: "brand.50" }}
          >
            Ver todas
          </Button>
        </Flex>
        <Box px={6} py={4}>
          <Stack spacing={3}>
            {myDemands.slice(0, 4).map((d) => (
              <DemandCard key={d.id} demand={d} />
            ))}
            {myDemands.length === 0 && (
              <Flex direction="column" align="center" py={10} gap={3}>
                <Circle size="48px" bg="gray.100" color="gray.400">
                  <Icon as={FiInbox} boxSize={5} />
                </Circle>
                <Text color="gray.400" fontSize="sm">Nenhuma demanda recente.</Text>
              </Flex>
            )}
          </Stack>
        </Box>
      </Box>
    </AppLayout>
    </RoleProtectedRoute>
  );
}
