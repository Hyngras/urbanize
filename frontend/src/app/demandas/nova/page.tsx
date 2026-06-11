"use client";

import { RoleProtectedRoute } from "@/components/auth/RoleProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import { useDemandStore } from "@/store/demandStore";
import { useAuthStore } from "@/store/authStore";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Checkbox,
  Circle,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Input,
  Link as ChakraLink,
  Select,
  Stack,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Demand, DemandCategory, DemandPriority } from "@/types/demand";
import { Organ, buildWhatsappLink, buildEmailLink } from "@/types/organ";
import { useRouter } from "next/navigation";
import {
  FiMapPin,
  FiSend,
  FiArrowLeft,
  FiAlertCircle,
  FiCamera,
} from "react-icons/fi";
import Link from "next/link";
import { ImageUpload } from "@/components/forms/ImageUpload";
import { api } from "@/services/api";
import { categoryLabel } from "@/utils/categoryLabel";

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

const buildSuggestedDemandText = (categoria: DemandCategory, organ?: Organ | null) => {
  const organName = organ?.nome ?? "órgão responsável";

  return {
    titulo: categoryLabel[categoria],
    descricao: `Imagem analisada automaticamente. Sugestão de encaminhamento para ${organName}. A ocorrência foi identificada a partir da foto anexada e deve ser revisada pelo gestor antes do envio definitivo ao órgão responsável.`,
  };
};

export default function NewDemandPage() {
  const { createDemand, loading } = useDemandStore();
  const { user } = useAuthStore();
  const toast = useToast();
  const router = useRouter();
  const [accepted, setAccepted] = useState(false);
  const [form, setForm] = useState<Partial<Demand>>({ prioridade: "media", categoria: "outros" });
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [organs, setOrgans] = useState<Organ[]>([]);
  const [matchedOrgan, setMatchedOrgan] = useState<Organ | null>(null);

  useEffect(() => {
    api.getOrgans().then(setOrgans).catch(() => {});
  }, []);

  useEffect(() => {
    if (!form.categoria || organs.length === 0) { setMatchedOrgan(null); return; }
    const organ = organs.find((o) => {
      try { const cats: DemandCategory[] = JSON.parse(o.categoriasJson); return cats.includes(form.categoria as DemandCategory); }
      catch { return false; }
    }) ?? null;
    setMatchedOrgan(organ);
  }, [form.categoria, organs]);

  useEffect(() => {
    if (!form.categoria || !matchedOrgan || form.titulo || form.descricao) return;
    const suggestion = buildSuggestedDemandText(form.categoria as DemandCategory, matchedOrgan);
    setForm((prev) => ({ ...prev, ...suggestion }));
  }, [form.categoria, form.descricao, form.titulo, matchedOrgan]);

  const handleChange = (key: keyof Demand, value: unknown) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async () => {
    if (!accepted) return toast({ title: "Confirme o aceite", status: "warning" });
    if (!form.titulo || !form.descricao || !form.endereco?.endereco) {
      return toast({ title: "Preencha os campos obrigatórios", status: "warning" });
    }
    const payload: Omit<Demand, "id" | "protocolo" | "criadaEm" | "atualizadaEm"> = {
      ...form,
      titulo: form.titulo!,
      descricao: form.descricao!,
      categoria: (form.categoria as DemandCategory) ?? "outros",
      prioridade: (form.prioridade as DemandPriority) ?? "media",
      status: "registrada",
      nomeSolicitante: user?.nome ?? "",
      emailSolicitante: user?.email ?? "",
      telefoneSolicitante: undefined,
      endereco: {
        endereco: form.endereco?.endereco || "",
        bairro: form.endereco?.bairro || "",
        cidade: form.endereco?.cidade || "",
        referencia: form.endereco?.referencia,
        latitude: form.endereco?.latitude,
        longitude: form.endereco?.longitude,
      },
      origem: "cidadao",
      imagemUrl: imageUrl ?? undefined,
      historico: [],
    };
    const created = await createDemand(payload);
    toast({ title: "Demanda registrada", status: "success" });
    router.push(`/demandas/${created.id}`);
  };

  return (
    <RoleProtectedRoute allowedRoles={["cidadao"]}>
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
          {/* Seção: Foto do problema */}
          <SectionCard icon={FiCamera} title="Foto do problema" subtitle="Nossa IA classifica a categoria automaticamente">
            <ImageUpload
              onResult={({ imageUrl: url, triagem, latitude, longitude }) => {
                setImageUrl(url);
                setForm((prev) => ({
                  ...prev,
                  categoria: triagem.categoria,
                  ...buildSuggestedDemandText(
                    triagem.categoria,
                    organs.find((o) => {
                      try {
                        const cats: DemandCategory[] = JSON.parse(o.categoriasJson);
                        return cats.includes(triagem.categoria);
                      } catch {
                        return false;
                      }
                    }) ?? null
                  ),
                  endereco: {
                    endereco: prev.endereco?.endereco ?? "",
                    bairro: prev.endereco?.bairro ?? "",
                    cidade: prev.endereco?.cidade ?? "Recife",
                    referencia: prev.endereco?.referencia,
                    latitude: latitude ?? prev.endereco?.latitude,
                    longitude: longitude ?? prev.endereco?.longitude,
                  },
                }));
              }}
            />
          </SectionCard>

          {/* Card órgão responsável */}
          {matchedOrgan && (
            <Alert status="info" borderRadius="xl" border="1px solid" borderColor="blue.100">
              <AlertIcon />
              <Box flex="1">
                <AlertTitle fontSize="sm">Órgão responsável sugerido</AlertTitle>
                <AlertDescription>
                  <Text fontWeight="semibold">{matchedOrgan.nome}</Text>
                  {matchedOrgan.telefone && <Text fontSize="sm" color="gray.600">Tel: {matchedOrgan.telefone}</Text>}
                  <HStack mt={2} spacing={2} flexWrap="wrap">
                    {buildWhatsappLink(matchedOrgan, "novo", form.titulo ?? "demanda") && (
                      <ChakraLink href={buildWhatsappLink(matchedOrgan, "novo", form.titulo ?? "demanda")!} isExternal>
                        <Button size="xs" colorScheme="whatsapp">WhatsApp</Button>
                      </ChakraLink>
                    )}
                    {buildEmailLink(matchedOrgan, "novo", form.titulo ?? "demanda") && (
                      <ChakraLink href={buildEmailLink(matchedOrgan, "novo", form.titulo ?? "demanda")!}>
                        <Button size="xs" colorScheme="blue" variant="outline">E-mail</Button>
                      </ChakraLink>
                    )}
                    {matchedOrgan.site && (
                      <ChakraLink href={matchedOrgan.site} isExternal>
                        <Button size="xs" variant="ghost">Site oficial</Button>
                      </ChakraLink>
                    )}
                  </HStack>
                </AlertDescription>
              </Box>
            </Alert>
          )}

          {/* Campos da demanda */}
          <Box bg="white" rounded="xl" border="1px solid" borderColor="gray.100" shadow="sm" px={6} py={5}>
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
              <GridItem colSpan={{ base: 1, md: 2 }}>
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
          </Box>

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
                size="sm"
                color="gray.500"
              >
                Cancelar
              </Button>
              <Button
                colorScheme="brand"
                size="sm"
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
    </RoleProtectedRoute>
  );
}
