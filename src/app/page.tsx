 "use client";

import { AppNavbar } from "@/components/layout/AppNavbar";
import { AppFooter } from "@/components/layout/AppFooter";
import {
  Box,
  Button,
  Center,
  Circle,
  Flex,
  Grid,
  Heading,
  Icon,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FiEdit3,
  FiFilter,
  FiActivity,
  FiCheckCircle,
  FiEye,
  FiZap,
  FiLink,
  FiBarChart2,
  FiSun,
  FiTruck,
  FiTrash2,
  FiDroplet,
  FiShield,
  FiTool,
  FiCpu,
  FiArrowRight,
  FiMapPin,
  FiUsers,
  FiClock,
  FiThumbsUp,
} from "react-icons/fi";
import { IconType } from "react-icons";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const steps = [
  { title: "Registre", desc: "Envie o problema urbano com localização e detalhes.", icon: FiEdit3 },
  { title: "Triagem", desc: "Triagem automática sugere órgão responsável.", icon: FiFilter },
  { title: "Acompanhe", desc: "Monitore status e histórico em tempo real.", icon: FiActivity },
  { title: "Resolva", desc: "Gestores priorizam e concluem atendimentos.", icon: FiCheckCircle },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

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
        <CTA />
      </Box>
      <AppFooter />
    </Box>
  );
}

function Hero() {
  return (
    <Box
      position="relative"
      overflow="hidden"
      bgGradient="linear(135deg, brand.600 0%, brand.800 50%, brand.900 100%)"
      py={{ base: 16, md: 24 }}
      px={4}
    >
      {/* Decorative circles */}
      <Circle
        size="500px"
        bg="whiteAlpha.50"
        position="absolute"
        top="-200px"
        right="-100px"
      />
      <Circle
        size="300px"
        bg="whiteAlpha.50"
        position="absolute"
        bottom="-100px"
        left="-50px"
      />

      <Flex
        maxW="1200px"
        mx="auto"
        align="center"
        gap={{ base: 8, lg: 14 }}
        direction={{ base: "column", lg: "row" }}
        position="relative"
        zIndex={1}
      >
        <MotionBox
          flex={1}
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Stack spacing={5}>
            <Flex
              align="center"
              gap={2}
              bg="whiteAlpha.200"
              backdropFilter="blur(8px)"
              rounded="full"
              px={4}
              py={1.5}
              w="fit-content"
            >
              <Icon as={FiMapPin} color="white" boxSize={4} />
              <Text color="white" fontWeight="medium" fontSize="sm">
                Gestão de Demandas Urbanas
              </Text>
            </Flex>
            <Heading
              size="2xl"
              color="white"
              lineHeight="shorter"
              letterSpacing="-0.02em"
            >
              Transparência e agilidade para a sua cidade.
            </Heading>
            <Text color="whiteAlpha.800" fontSize="lg" maxW="520px" lineHeight="tall">
              Registre problemas urbanos, acompanhe o status em tempo real e dê visibilidade ao atendimento.
              Triagem inteligente sugere o órgão correto.
            </Text>
            <Stack direction={{ base: "column", sm: "row" }} spacing={3} pt={2}>
              <Button
                as={Link}
                href="/demandas/nova"
                size="lg"
                bg="white"
                color="brand.700"
                _hover={{ bg: "gray.100", transform: "translateY(-1px)" }}
                shadow="lg"
                rightIcon={<FiArrowRight />}
                transition="all 0.2s"
              >
                Registrar demanda
              </Button>
              <Button
                as={Link}
                href="/gestor"
                variant="outline"
                size="lg"
                color="white"
                borderColor="whiteAlpha.400"
                _hover={{ bg: "whiteAlpha.200", borderColor: "white" }}
                transition="all 0.2s"
              >
                Painel do gestor
              </Button>
            </Stack>
          </Stack>
        </MotionBox>

        <MotionBox
          flex={1}
          maxW="480px"
          w="full"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          <Box
            bg="whiteAlpha.100"
            backdropFilter="blur(16px)"
            p={7}
            rounded="2xl"
            border="1px solid"
            borderColor="whiteAlpha.200"
            shadow="2xl"
          >
            <Flex align="center" gap={2} mb={5}>
              <Icon as={FiCpu} color="brand.200" boxSize={5} />
              <Heading size="md" color="white">
                Triagem Inteligente
              </Heading>
            </Flex>
            <VStack align="stretch" spacing={3}>
              <Box bg="whiteAlpha.100" rounded="lg" p={3}>
                <Text color="whiteAlpha.600" fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wide">
                  Categoria detectada
                </Text>
                <Text color="white" fontWeight="semibold" mt={0.5}>Iluminação pública</Text>
              </Box>
              <Box bg="whiteAlpha.100" rounded="lg" p={3}>
                <Text color="whiteAlpha.600" fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wide">
                  Órgão sugerido
                </Text>
                <Text color="white" fontWeight="semibold" mt={0.5}>Secretaria de Iluminação Urbana</Text>
              </Box>
              <Box bg="whiteAlpha.100" rounded="lg" p={3}>
                <Text color="whiteAlpha.600" fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wide">
                  Nível de confiança
                </Text>
                <Flex align="center" gap={3} mt={1}>
                  <Box flex={1} bg="whiteAlpha.200" rounded="full" h="8px" overflow="hidden">
                    <Box bg="green.400" h="full" w="72%" rounded="full" />
                  </Box>
                  <Text color="green.300" fontWeight="bold" fontSize="sm">72%</Text>
                </Flex>
              </Box>
            </VStack>
            <Text color="whiteAlpha.400" fontSize="xs" mt={4} textAlign="center">
              Demonstração de integração futura com IA
            </Text>
          </Box>
        </MotionBox>
      </Flex>
    </Box>
  );
}

function ComoFunciona() {
  return (
    <Box py={{ base: 14, md: 20 }} px={4}>
      <Box maxW="1200px" mx="auto">
        <MotionBox
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
        >
          <VStack spacing={2} mb={10} textAlign="center">
            <MotionBox variants={fadeUp} custom={0}>
              <Text color="brand.500" fontWeight="bold" fontSize="sm" textTransform="uppercase" letterSpacing="wider">
                Passo a passo
              </Text>
            </MotionBox>
            <MotionBox variants={fadeUp} custom={1}>
              <Heading size="xl">Como funciona</Heading>
            </MotionBox>
            <MotionBox variants={fadeUp} custom={2}>
              <Text color="gray.500" maxW="600px" fontSize="lg">
                Em quatro etapas simples, sua demanda é registrada, triada e encaminhada ao órgão correto.
              </Text>
            </MotionBox>
          </VStack>

          <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={6}>
            {steps.map((step, i) => (
              <MotionBox key={step.title} variants={fadeUp} custom={i + 3}>
                <Box
                  bg="white"
                  p={6}
                  rounded="xl"
                  border="1px solid"
                  borderColor="gray.100"
                  shadow="sm"
                  _hover={{ shadow: "md", borderColor: "brand.200", transform: "translateY(-4px)" }}
                  transition="all 0.3s"
                  textAlign="center"
                  position="relative"
                >
                  <Center mb={4}>
                    <Circle size="56px" bg="brand.50" color="brand.500">
                      <Icon as={step.icon} boxSize={6} />
                    </Circle>
                  </Center>
                  <Text
                    position="absolute"
                    top={3}
                    right={4}
                    fontSize="xs"
                    fontWeight="bold"
                    color="brand.300"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </Text>
                  <Heading size="md" mb={2}>{step.title}</Heading>
                  <Text color="gray.500" fontSize="sm">{step.desc}</Text>
                </Box>
              </MotionBox>
            ))}
          </Grid>
        </MotionBox>
      </Box>
    </Box>
  );
}

function Categorias() {
  const cats: { label: string; icon: IconType; color: string }[] = [
    { label: "Iluminação pública", icon: FiSun, color: "yellow" },
    { label: "Vias públicas", icon: FiTruck, color: "orange" },
    { label: "Coleta de lixo", icon: FiTrash2, color: "green" },
    { label: "Saneamento", icon: FiDroplet, color: "cyan" },
    { label: "Fiscalização", icon: FiShield, color: "red" },
    { label: "Zeladoria", icon: FiTool, color: "purple" },
  ];
  return (
    <Box bg="white" py={{ base: 14, md: 20 }} px={4} borderY="1px solid" borderColor="gray.100">
      <Box maxW="1200px" mx="auto">
        <MotionBox
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
        >
          <VStack spacing={2} mb={10} textAlign="center">
            <MotionBox variants={fadeUp} custom={0}>
              <Text color="brand.500" fontWeight="bold" fontSize="sm" textTransform="uppercase" letterSpacing="wider">
                Áreas de atuação
              </Text>
            </MotionBox>
            <MotionBox variants={fadeUp} custom={1}>
              <Heading size="xl">Categorias comuns</Heading>
            </MotionBox>
          </VStack>

          <Grid
            templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(6, 1fr)" }}
            gap={4}
          >
            {cats.map((c, i) => (
              <MotionBox key={c.label} variants={fadeUp} custom={i + 2}>
                <VStack
                  p={5}
                  rounded="xl"
                  border="1px solid"
                  borderColor="gray.100"
                  bg="gray.50"
                  spacing={3}
                  _hover={{ borderColor: `${c.color}.300`, bg: `${c.color}.50`, transform: "translateY(-2px)" }}
                  transition="all 0.25s"
                  cursor="default"
                >
                  <Circle size="44px" bg={`${c.color}.100`} color={`${c.color}.600`}>
                    <Icon as={c.icon} boxSize={5} />
                  </Circle>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700" textAlign="center">
                    {c.label}
                  </Text>
                </VStack>
              </MotionBox>
            ))}
          </Grid>
        </MotionBox>
      </Box>
    </Box>
  );
}

function Beneficios() {
  const items: { title: string; desc: string; icon: IconType }[] = [
    { title: "Transparência", desc: "Cidadão acompanha cada passo do atendimento da sua demanda.", icon: FiEye },
    { title: "Agilidade", desc: "Gestor prioriza e encaminha rapidamente para o órgão correto.", icon: FiZap },
    { title: "Integração", desc: "Pronto para integrar com sistemas públicos existentes.", icon: FiLink },
    { title: "Dados", desc: "Métricas para decisões baseadas em evidências reais.", icon: FiBarChart2 },
  ];
  return (
    <Box py={{ base: 14, md: 20 }} px={4}>
      <Box maxW="1200px" mx="auto">
        <MotionBox
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
        >
          <VStack spacing={2} mb={10} textAlign="center">
            <MotionBox variants={fadeUp} custom={0}>
              <Text color="brand.500" fontWeight="bold" fontSize="sm" textTransform="uppercase" letterSpacing="wider">
                Vantagens
              </Text>
            </MotionBox>
            <MotionBox variants={fadeUp} custom={1}>
              <Heading size="xl">Por que usar o Urbanize?</Heading>
            </MotionBox>
          </VStack>

          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6}>
            {items.map((item, i) => (
              <MotionBox key={item.title} variants={fadeUp} custom={i + 2}>
                <Box
                  bg="white"
                  p={6}
                  rounded="xl"
                  border="1px solid"
                  borderColor="gray.100"
                  shadow="sm"
                  _hover={{ shadow: "lg", borderColor: "brand.200", transform: "translateY(-4px)" }}
                  transition="all 0.3s"
                  h="full"
                >
                  <Circle size="48px" bg="brand.50" color="brand.500" mb={4}>
                    <Icon as={item.icon} boxSize={5} />
                  </Circle>
                  <Heading size="md" mb={2}>{item.title}</Heading>
                  <Text color="gray.500" fontSize="sm" lineHeight="tall">{item.desc}</Text>
                </Box>
              </MotionBox>
            ))}
          </Grid>
        </MotionBox>
      </Box>
    </Box>
  );
}

function StatItem({ icon, value, label, sub }: { icon: IconType; value: string; label: string; sub: string }) {
  return (
    <VStack spacing={2} textAlign="center">
      <Circle size="48px" bg="whiteAlpha.100" color="brand.200" mb={1}>
        <Icon as={icon} boxSize={5} />
      </Circle>
      <Heading size="2xl" color="white" fontWeight="extrabold">
        {value}
      </Heading>
      <Text color="gray.200" fontWeight="semibold" fontSize="sm">
        {label}
      </Text>
      <Text color="gray.400" fontSize="xs">
        {sub}
      </Text>
    </VStack>
  );
}

function Estatisticas() {
  return (
    <Box
      bgGradient="linear(to-br, gray.800, gray.900)"
      py={{ base: 14, md: 20 }}
      px={4}
      position="relative"
      overflow="hidden"
    >
      <Circle size="400px" bg="whiteAlpha.50" position="absolute" top="-200px" right="-100px" />

      <Box maxW="1200px" mx="auto" position="relative" zIndex={1}>
        <MotionBox
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={stagger}
        >
          <VStack spacing={2} mb={10} textAlign="center">
            <MotionBox variants={fadeUp} custom={0}>
              <Text color="brand.300" fontWeight="bold" fontSize="sm" textTransform="uppercase" letterSpacing="wider">
                Painel de métricas
              </Text>
            </MotionBox>
            <MotionBox variants={fadeUp} custom={1}>
              <Heading size="xl" color="white">Indicadores em tempo real</Heading>
            </MotionBox>
            <MotionBox variants={fadeUp} custom={2}>
              <Text color="gray.400" fontSize="sm">(dados simulados para demonstração)</Text>
            </MotionBox>
          </VStack>

          <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={{ base: 6, md: 8 }}>
            <MotionBox variants={fadeUp} custom={3}>
              <StatItem icon={FiMapPin} value="312" label="Demandas registradas" sub="Últimos 30 dias" />
            </MotionBox>
            <MotionBox variants={fadeUp} custom={4}>
              <StatItem icon={FiUsers} value="48" label="Em atendimento" sub="Equipes em rota" />
            </MotionBox>
            <MotionBox variants={fadeUp} custom={5}>
              <StatItem icon={FiClock} value="189" label="Resolvidas" sub="SLA médio 4,2 dias" />
            </MotionBox>
            <MotionBox variants={fadeUp} custom={6}>
              <StatItem icon={FiThumbsUp} value="92%" label="Satisfação" sub="Pesquisa mock" />
            </MotionBox>
          </Grid>
        </MotionBox>
      </Box>
    </Box>
  );
}

function CTA() {
  return (
    <Box py={{ base: 14, md: 20 }} px={4}>
      <MotionBox
        maxW="800px"
        mx="auto"
        bg="brand.500"
        rounded="2xl"
        p={{ base: 8, md: 12 }}
        textAlign="center"
        shadow="xl"
        position="relative"
        overflow="hidden"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Circle size="200px" bg="whiteAlpha.100" position="absolute" top="-60px" right="-40px" />
        <VStack spacing={4} position="relative" zIndex={1}>
          <Heading size="lg" color="white">
            Sua cidade merece mais atenção
          </Heading>
          <Text color="whiteAlpha.800" maxW="500px" fontSize="md">
            Comece agora a registrar demandas e ajude a transformar a gestão urbana da sua região.
          </Text>
          <Button
            as={Link}
            href="/demandas/nova"
            size="lg"
            bg="white"
            color="brand.600"
            _hover={{ bg: "gray.100", transform: "translateY(-1px)" }}
            shadow="lg"
            rightIcon={<FiArrowRight />}
            transition="all 0.2s"
            mt={2}
          >
            Registrar sua primeira demanda
          </Button>
        </VStack>
      </MotionBox>
    </Box>
  );
}
