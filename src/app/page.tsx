 "use client";

import { AppNavbar } from "@/components/layout/AppNavbar";
import { AppFooter } from "@/components/layout/AppFooter";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { Box, Button, Flex, Grid, Heading, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";

const steps = [
  { title: "Registre", desc: "Envie o problema urbano com localização e detalhes." },
  { title: "Triagem", desc: "Triagem automática sugere órgão responsável." },
  { title: "Acompanhe", desc: "Monitore status e histórico em tempo real." },
  { title: "Resolva", desc: "Gestores priorizam e concluem atendimentos." },
];

export default function Home() {
  return (
    <Box minH="100vh" bg="gray.50">
      <AppNavbar />
      <Box as="main">
        <Hero />
        <ComoFunciona />
        <Categorias />
        <Beneficios />
        <Estatisticas />
      </Box>
      <AppFooter />
    </Box>
  );
}

function Hero() {
  return (
    <Box bg="white" borderBottom="1px solid" borderColor="gray.100" py={16} px={4}>
      <Flex maxW="1200px" mx="auto" align="center" gap={10} wrap="wrap">
        <Stack spacing={4} flex={1}>
          <Text color="brand.600" fontWeight="semibold">Urbanize • Gestão de Demandas Urbanas</Text>
          <Heading size="2xl">Transparência e agilidade no atendimento das demandas urbanas.</Heading>
          <Text color="gray.600" fontSize="lg">
            Registre problemas urbanos, acompanhe o status e dê visibilidade ao atendimento. Triagem inteligente sugere o órgão correto.
          </Text>
          <Stack direction={{ base: "column", sm: "row" }} spacing={3}>
            <Button as={Link} href="/demandas/nova" colorScheme="brand" size="lg">Registrar demanda</Button>
            <Button as={Link} href="/gestor" variant="outline" size="lg">Painel do gestor</Button>
          </Stack>
        </Stack>
        <Box flex={1} bg="brand.50" p={8} rounded="2xl" border="1px solid" borderColor="brand.100">
          <Heading size="md" mb={3}>Triagem automática</Heading>
          <Text color="gray.600" mb={2}>Sugestão: Iluminação pública</Text>
          <Text color="gray.600" mb={2}>Órgão sugerido: Iluminação Urbana</Text>
          <Text color="gray.600">Confiança: 72%</Text>
          <Text color="gray.500" mt={4}>*Mock para demonstrar integração futura de IA.</Text>
        </Box>
      </Flex>
    </Box>
  );
}

function ComoFunciona() {
  return (
    <Box maxW="1200px" mx="auto" py={12} px={4}>
      <Heading size="lg" mb={4}>Como funciona</Heading>
      <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={4}>
        {steps.map((step) => (
          <Box key={step.title} bg="white" p={5} rounded="lg" border="1px solid" borderColor="gray.100" shadow="sm">
            <Heading size="md" mb={2}>{step.title}</Heading>
            <Text color="gray.600">{step.desc}</Text>
          </Box>
        ))}
      </Grid>
    </Box>
  );
}

function Categorias() {
  const cats = [
    "Iluminação pública",
    "Vias públicas",
    "Coleta de lixo",
    "Saneamento",
    "Fiscalização",
    "Zeladoria",
  ];
  return (
    <Box bg="white" py={12} px={4} borderY="1px solid" borderColor="gray.100">
      <Box maxW="1200px" mx="auto">
        <Heading size="lg" mb={4}>Categorias comuns</Heading>
        <Flex wrap="wrap" gap={3}>
          {cats.map((c) => (
            <Box key={c} px={4} py={2} border="1px solid" borderColor="gray.200" rounded="full" bg="gray.50">
              {c}
            </Box>
          ))}
        </Flex>
      </Box>
    </Box>
  );
}

function Beneficios() {
  const items = [
    { title: "Transparência", desc: "Cidadão acompanha cada passo." },
    { title: "Agilidade", desc: "Gestor prioriza e encaminha rapidamente." },
    { title: "Integração", desc: "Pronto para integrar com sistemas públicos." },
    { title: "Dados", desc: "Métricas para decisões baseadas em evidências." },
  ];
  return (
    <Box maxW="1200px" mx="auto" py={12} px={4}>
      <Heading size="lg" mb={4}>Benefícios</Heading>
      <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={4}>
        {items.map((item) => (
          <Box key={item.title} bg="white" p={5} rounded="lg" border="1px solid" borderColor="gray.100" shadow="sm">
            <Heading size="md" mb={2}>{item.title}</Heading>
            <Text color="gray.600">{item.desc}</Text>
          </Box>
        ))}
      </Grid>
    </Box>
  );
}

function Estatisticas() {
  return (
    <Box bg="gray.900" color="gray.100" py={12} px={4}>
      <Box maxW="1200px" mx="auto">
        <Heading size="lg" mb={4}>Indicadores (mock)</Heading>
        <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={4}>
          <MetricsCard label="Demandas registradas" value={312} help="Últimos 30 dias" />
          <MetricsCard label="Em atendimento" value={48} help="Equipes em rota" />
          <MetricsCard label="Resolvidas" value={189} help="SLA médio 4,2 dias" />
          <MetricsCard label="Satisfação" value="92%" help="Pesquisa mock" />
        </Grid>
      </Box>
    </Box>
  );
}
