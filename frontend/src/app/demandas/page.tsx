"use client";

import { RoleProtectedRoute } from "@/components/auth/RoleProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { DemandCard } from "@/components/demandas/DemandCard";
import { DemandFilters } from "@/components/demandas/DemandFilters";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { useDemands } from "@/hooks/useDemands";
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
  Text,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";
import { FiPlus, FiList } from "react-icons/fi";

export default function DemandListPage() {
  const { demands, loading, error } = useDemands();
  const { user } = useAuth();
  const visibleDemands = demands;

  return (
    <RoleProtectedRoute allowedRoles={["cidadao", "gestor"]}>
    <AppLayout>
      {/* Header */}
      <Flex
        justify="space-between"
        align={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        gap={4}
        mb={6}
      >
        <VStack align="start" spacing={1}>
          <HStack spacing={2}>
            <Icon as={FiList} color="brand.500" boxSize={5} />
            <Heading size="lg" color="gray.800">{user?.role === "gestor" ? "Todas as Demandas" : "Minhas Demandas"}</Heading>
          </HStack>
          <Text color="gray.500" fontSize="sm">
            {user?.role === "gestor" ? "Visualize e filtre as solicitações da cidade" : "Visualize e filtre as suas solicitações"}
          </Text>
        </VStack>
        {user?.role === "cidadao" && (
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
        )}
      </Flex>

      <DemandFilters />

      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}
      {!loading && !error && visibleDemands.length === 0 && (
        <EmptyState
          message="Nenhuma demanda encontrada"
          actionLabel={user?.role === "cidadao" ? "Criar demanda" : undefined}
          actionHref={user?.role === "cidadao" ? "/demandas/nova" : undefined}
        />
      )}
      {!loading && !error && visibleDemands.length > 0 && (
        <>
          <Text fontSize="xs" color="gray.400" fontWeight="semibold" mb={3} textTransform="uppercase" letterSpacing="wider">
            {visibleDemands.length} {visibleDemands.length === 1 ? "resultado" : "resultados"}
          </Text>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
            {visibleDemands.map((demand) => (
              <DemandCard key={demand.id} demand={demand} />
            ))}
          </Grid>
        </>
      )}
    </AppLayout>
    </RoleProtectedRoute>
  );
}
