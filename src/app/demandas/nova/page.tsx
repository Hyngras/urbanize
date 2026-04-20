"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { useDemandStore } from "@/store/demandStore";
import {
  Box,
  Button,
  Checkbox,
  Circle,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Icon,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { Demand, DemandCategory, DemandPriority } from "@/types/demand";
import { useRouter } from "next/navigation";
import {
  FiEdit3,
  FiMapPin,
  FiUser,
  FiSend,
  FiArrowLeft,
  FiAlertCircle,
} from "react-icons/fi";
import Link from "next/link";

function SectionCard({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      bg="white"
      rounded="xl"
      border="1px solid"
      borderColor="gray.100"
      shadow="sm"
      overflow="hidden"
    >
      <Flex align="center" gap={3} px={6} py={4} borderBottom="1px solid" borderColor="gray.50" bg="gray.50">
        <Circle size="36px" bg="brand.50" color="brand.500">
          <Icon as={icon} boxSize={4} />
        </Circle>
        <Box>
          <Text fontWeight="semibold" fontSize="sm" color="gray.800">{title}</Text>
          {subtitle && <Text fontSize="xs" color="gray.500">{subtitle}</Text>}
        </Box>
      </Flex>
      <Box px={6} py={5}>
        {children}
      </Box>
    </Box>
  );
}

export default function NewDemandPage() {
  const { createDemand, loading } = useDemandStore();
  const toast = useToast();
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [form, setForm] = useState<Partial<Demand>>({ prioridade: "media", categoria: "outros" });

  const handleChange = (key: keyof Demand, value: any) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async () => {
    if (!accepted) return toast({ title: "Confirme o aceite", status: "warning" });
    if (!form.titulo || !form.descricao || !form.nomeSolicitante || !form.emailSolicitante || !form.endereco?.endereco) {
      return toast({ title: "Preencha os campos obrigatórios", status: "warning" });
    }
    const payload: Omit<Demand, "id" | "protocolo" | "criadaEm" | "atualizadaEm"> = {
      ...form,
      titulo: form.titulo!,
      descricao: form.descricao!,
      categoria: (form.categoria as DemandCategory) ?? "outros",
      prioridade: (form.prioridade as DemandPriority) ?? "media",
      status: "registrada",
      nomeSolicitante: form.nomeSolicitante!,
      emailSolicitante: form.emailSolicitante!,
      telefoneSolicitante: form.telefoneSolicitante,
      endereco: {
        endereco: form.endereco?.endereco || "",
        bairro: form.endereco?.bairro || "",
        cidade: form.endereco?.cidade || "",
        referencia: form.endereco?.referencia,
      },
      origem: "cidadao",
      historico: [],
    };
    const created = await createDemand(payload);
    toast({ title: "Demanda registrada", status: "success" });
    router.push(`/demandas/${created.id}`);
  };

  return (
    <AppLayout>
      <Box maxW="820px" mx="auto">
        {/* Header */}
        <Flex align="center" gap={3} mb={2}>
          <Button
            as={Link}
            href="/demandas"
            variant="ghost"
            size="sm"
            leftIcon={<FiArrowLeft />}
            color="gray.500"
            _hover={{ color: "brand.600" }}
            px={2}
          >
            Voltar
          </Button>
        </Flex>
        <VStack align="start" spacing={1} mb={8}>
          <Heading size="lg">Nova demanda</Heading>
          <Text color="gray.500">
            Preencha o formulário abaixo para registrar um problema urbano.
          </Text>
        </VStack>

        <Stack spacing={5}>
          {/* Seção: Dados da demanda */}
          <SectionCard icon={FiEdit3} title="Dados da demanda" subtitle="Descreva o problema encontrado">
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
              <GridItem>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">Título</FormLabel>
                  <Input
                    placeholder="Ex: Buraco na calçada"
                    value={form.titulo ?? ""}
                    onChange={(e) => handleChange("titulo", e.target.value)}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    _hover={{ borderColor: "gray.300" }}
                    _focus={{ borderColor: "brand.400", bg: "white", boxShadow: "0 0 0 1px var(--chakra-colors-brand-400)" }}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">Categoria</FormLabel>
                  <Select
                    value={form.categoria ?? "outros"}
                    onChange={(e) => handleChange("categoria", e.target.value)}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    _hover={{ borderColor: "gray.300" }}
                    _focus={{ borderColor: "brand.400", bg: "white", boxShadow: "0 0 0 1px var(--chakra-colors-brand-400)" }}
                  >
                    <option value="vias_publicas">Vias públicas</option>
                    <option value="iluminacao_publica">Iluminação pública</option>
                    <option value="coleta_de_lixo">Coleta de lixo</option>
                    <option value="saneamento">Saneamento</option>
                    <option value="fiscalizacao">Fiscalização</option>
                    <option value="zeladoria">Zeladoria</option>
                    <option value="outros">Outros</option>
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">Descrição</FormLabel>
                  <Textarea
                    placeholder="Descreva o problema com o máximo de detalhes possível..."
                    value={form.descricao ?? ""}
                    onChange={(e) => handleChange("descricao", e.target.value)}
                    rows={4}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    _hover={{ borderColor: "gray.300" }}
                    _focus={{ borderColor: "brand.400", bg: "white", boxShadow: "0 0 0 1px var(--chakra-colors-brand-400)" }}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">Prioridade</FormLabel>
                  <Select
                    value={form.prioridade ?? "media"}
                    onChange={(e) => handleChange("prioridade", e.target.value)}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    _hover={{ borderColor: "gray.300" }}
                    _focus={{ borderColor: "brand.400", bg: "white", boxShadow: "0 0 0 1px var(--chakra-colors-brand-400)" }}
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">Ponto de referência</FormLabel>
                  <Input
                    placeholder="Próximo ao mercado..."
                    value={form.endereco?.referencia ?? ""}
                    onChange={(e) => handleChange("endereco", { ...form.endereco, referencia: e.target.value })}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    _hover={{ borderColor: "gray.300" }}
                    _focus={{ borderColor: "brand.400", bg: "white", boxShadow: "0 0 0 1px var(--chakra-colors-brand-400)" }}
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </SectionCard>

          {/* Seção: Localização */}
          <SectionCard icon={FiMapPin} title="Localização" subtitle="Onde o problema foi identificado">
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
              <GridItem colSpan={{ base: 1, md: 2 }}>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">Endereço / Rua</FormLabel>
                  <Input
                    placeholder="Rua, Avenida..."
                    value={form.endereco?.endereco ?? ""}
                    onChange={(e) => handleChange("endereco", { ...form.endereco, endereco: e.target.value })}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    _hover={{ borderColor: "gray.300" }}
                    _focus={{ borderColor: "brand.400", bg: "white", boxShadow: "0 0 0 1px var(--chakra-colors-brand-400)" }}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">Bairro</FormLabel>
                  <Input
                    placeholder="Bairro"
                    value={form.endereco?.bairro ?? ""}
                    onChange={(e) => handleChange("endereco", { ...form.endereco, bairro: e.target.value })}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    _hover={{ borderColor: "gray.300" }}
                    _focus={{ borderColor: "brand.400", bg: "white", boxShadow: "0 0 0 1px var(--chakra-colors-brand-400)" }}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">Cidade</FormLabel>
                  <Input
                    placeholder="Cidade"
                    value={form.endereco?.cidade ?? ""}
                    onChange={(e) => handleChange("endereco", { ...form.endereco, cidade: e.target.value })}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    _hover={{ borderColor: "gray.300" }}
                    _focus={{ borderColor: "brand.400", bg: "white", boxShadow: "0 0 0 1px var(--chakra-colors-brand-400)" }}
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </SectionCard>

          {/* Seção: Contato */}
          <SectionCard icon={FiUser} title="Dados do solicitante" subtitle="Suas informações de contato">
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
              <GridItem>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">Nome</FormLabel>
                  <Input
                    placeholder="Seu nome completo"
                    value={form.nomeSolicitante ?? ""}
                    onChange={(e) => handleChange("nomeSolicitante", e.target.value)}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    _hover={{ borderColor: "gray.300" }}
                    _focus={{ borderColor: "brand.400", bg: "white", boxShadow: "0 0 0 1px var(--chakra-colors-brand-400)" }}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={form.emailSolicitante ?? ""}
                    onChange={(e) => handleChange("emailSolicitante", e.target.value)}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    _hover={{ borderColor: "gray.300" }}
                    _focus={{ borderColor: "brand.400", bg: "white", boxShadow: "0 0 0 1px var(--chakra-colors-brand-400)" }}
                  />
                </FormControl>
              </GridItem>
              <GridItem>
                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">Telefone</FormLabel>
                  <Input
                    placeholder="(00) 00000-0000"
                    value={form.telefoneSolicitante ?? ""}
                    onChange={(e) => handleChange("telefoneSolicitante", e.target.value)}
                    bg="gray.50"
                    border="1px solid"
                    borderColor="gray.200"
                    _hover={{ borderColor: "gray.300" }}
                    _focus={{ borderColor: "brand.400", bg: "white", boxShadow: "0 0 0 1px var(--chakra-colors-brand-400)" }}
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </SectionCard>

          {/* Aceite e envio */}
          <Box
            bg="white"
            rounded="xl"
            border="1px solid"
            borderColor="gray.100"
            shadow="sm"
            px={6}
            py={5}
          >
            <Flex align="start" gap={3} mb={5}>
              <Icon as={FiAlertCircle} color="orange.400" boxSize={5} mt={0.5} />
              <Text fontSize="sm" color="gray.600">
                Ao enviar, seus dados serão utilizados exclusivamente para o atendimento desta demanda, conforme nossa política de privacidade.
              </Text>
            </Flex>
            <Checkbox
              isChecked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              colorScheme="brand"
              mb={5}
            >
              <Text fontSize="sm">Concordo em compartilhar estes dados para atendimento da demanda.</Text>
            </Checkbox>
            <Flex justify="flex-end" gap={3}>
              <Button
                as={Link}
                href="/demandas"
                variant="ghost"
                size="lg"
                color="gray.500"
              >
                Cancelar
              </Button>
              <Button
                colorScheme="brand"
                size="lg"
                onClick={handleSubmit}
                isLoading={loading}
                leftIcon={<FiSend />}
                shadow="md"
                _hover={{ shadow: "lg", transform: "translateY(-1px)" }}
                transition="all 0.2s"
              >
                Enviar demanda
              </Button>
            </Flex>
          </Box>
        </Stack>
      </Box>
    </AppLayout>
  );
}
