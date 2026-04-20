"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { DemandCard } from "@/components/demandas/DemandCard";
import { DemandFilters } from "@/components/demandas/DemandFilters";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingState } from "@/components/feedback/LoadingState";
import { useDemands } from "@/hooks/useDemands";
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

  return (
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
            <Heading size="lg" color="gray.800">Demandas</Heading>
          </HStack>
          <Text color="gray.500" fontSize="sm">Visualize e filtre as solicitações</Text>
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

      <DemandFilters />

      {loading && <LoadingState />}
      {error && <ErrorState message={error} />}
      {!loading && !error && demands.length === 0 && (
        <EmptyState message="Nenhuma demanda encontrada" actionLabel="Criar demanda" actionHref="/demandas/nova" />
      )}
      {!loading && !error && demands.length > 0 && (
        <>
          <Text fontSize="xs" color="gray.400" fontWeight="semibold" mb={3} textTransform="uppercase" letterSpacing="wider">
            {demands.length} {demands.length === 1 ? "resultado" : "resultados"}
          </Text>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
            {demands.map((demand) => (
              <DemandCard key={demand.id} demand={demand} />
            ))}
          </Grid>
        </>
      )}
    </AppLayout>
  );
}
