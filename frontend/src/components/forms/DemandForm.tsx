"use client";

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Link,
  Select,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDemandStore } from "@/store/demandStore";
import { Demand, DemandCategory } from "@/types/demand";
import { Organ, buildWhatsappLink, buildEmailLink } from "@/types/organ";
import { ImageUpload } from "./ImageUpload";
import { api } from "@/services/api";

const categories: { value: DemandCategory; label: string }[] = [
  { value: "vias_publicas", label: "Vias Públicas" },
  { value: "iluminacao_publica", label: "Iluminação Pública" },
  { value: "coleta_de_lixo", label: "Coleta de Lixo" },
  { value: "saneamento", label: "Saneamento" },
  { value: "fiscalizacao", label: "Fiscalização" },
  { value: "zeladoria", label: "Zeladoria" },
  { value: "outros", label: "Outros" },
];

export function DemandForm() {
  const toast = useToast();
  const { createDemand, loading } = useDemandStore();
  const [form, setForm] = useState<Partial<Demand>>({
    categoria: "iluminacao_publica",
    status: "registrada",
  });
  const [organs, setOrgans] = useState<Organ[]>([]);
  const [matchedOrgan, setMatchedOrgan] = useState<Organ | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    api.getOrgans().then(setOrgans).catch(() => {});
  }, []);

  // Atualiza órgão sugerido ao mudar categoria
  useEffect(() => {
    if (!form.categoria || organs.length === 0) return;
    const organ = organs.find((o) => {
      try {
        const cats: DemandCategory[] = JSON.parse(o.categoriasJson);
        return cats.includes(form.categoria as DemandCategory);
      } catch {
        return false;
      }
    }) ?? null;
    setMatchedOrgan(organ);
  }, [form.categoria, organs]);

  const handleChange = (field: keyof Demand, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.titulo || !form.descricao || !form.endereco?.endereco) {
      toast({ title: "Preencha os campos obrigatórios", status: "warning" });
      return;
    }
    const payload = {
      ...form,
      categoria: (form.categoria as DemandCategory) ?? "iluminacao_publica",
      prioridade: form.prioridade ?? "media" as const,
      status: "registrada" as const,
      nomeSolicitante: form.nomeSolicitante ?? "Cidadão",
      emailSolicitante: form.emailSolicitante ?? "cidadao@exemplo.com",
      endereco: {
        endereco: form.endereco?.endereco ?? "Recife, PE",
        bairro: form.endereco?.bairro ?? "Centro",
        cidade: form.endereco?.cidade ?? "Recife",
        latitude: form.endereco?.latitude,
        longitude: form.endereco?.longitude,
      },
      origem: "cidadao" as const,
      imagemUrl: imageUrl ?? undefined,
      historico: [],
    } as Omit<Demand, "id" | "protocolo" | "criadaEm" | "atualizadaEm">;

    try {
      const created = await createDemand(payload);
      toast({ title: "Demanda registrada com sucesso!", status: "success" });
      return created;
    } catch (error) {
      console.error(error);
      toast({ title: "Erro ao registrar demanda", status: "error" });
    }
  };

  const waLink = matchedOrgan && form.titulo ? buildWhatsappLink(matchedOrgan, "novo", form.titulo) : null;
  const emailLink = matchedOrgan && form.titulo ? buildEmailLink(matchedOrgan, "novo", form.titulo) : null;

  return (
    <Box bg="white" p={6} rounded="lg" border="1px solid" borderColor="gray.100" shadow="sm">
      <Stack spacing={4}>
        {/* Upload de imagem com triagem automática */}
        <FormControl>
          <FormLabel>Foto do problema</FormLabel>
          <ImageUpload
            onResult={({ imageUrl: url, triagem, latitude, longitude }) => {
              setImageUrl(url);
              setForm((prev) => ({
                ...prev,
                categoria: triagem.categoria,
                endereco: {
                  endereco: prev.endereco?.endereco ?? "",
                  bairro: prev.endereco?.bairro ?? "",
                  cidade: prev.endereco?.cidade ?? "Recife",
                  latitude: latitude ?? prev.endereco?.latitude,
                  longitude: longitude ?? prev.endereco?.longitude,
                },
              }));
            }}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Título</FormLabel>
          <Input value={form.titulo ?? ""} onChange={(e) => handleChange("titulo", e.target.value)} placeholder="Ex: Buraco em via" />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Descrição</FormLabel>
          <Textarea value={form.descricao ?? ""} onChange={(e) => handleChange("descricao", e.target.value)} placeholder="Explique o problema" />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Categoria</FormLabel>
          <Select value={(form.categoria as string) ?? "iluminacao_publica"} onChange={(e) => handleChange("categoria", e.target.value)}>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Endereço</FormLabel>
          <Input
            value={form.endereco?.endereco ?? ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                endereco: { ...prev.endereco, endereco: e.target.value, bairro: prev.endereco?.bairro ?? "", cidade: prev.endereco?.cidade ?? "Recife" },
              }))
            }
            placeholder="Rua, número"
          />
        </FormControl>

        <FormControl>
          <FormLabel>Bairro</FormLabel>
          <Input
            value={form.endereco?.bairro ?? ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                endereco: { ...prev.endereco, endereco: prev.endereco?.endereco ?? "", bairro: e.target.value, cidade: prev.endereco?.cidade ?? "Recife" },
              }))
            }
            placeholder="Centro, Boa Viagem, etc"
          />
        </FormControl>

        {/* Card de órgão responsável com links de contato */}
        {matchedOrgan && (
          <>
            <Divider />
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle fontSize="sm">Órgão responsável sugerido</AlertTitle>
                <AlertDescription>
                  <Text fontWeight="semibold">{matchedOrgan.nome}</Text>
                  {matchedOrgan.telefone && (
                    <Text fontSize="sm" color="gray.600">
                      Tel: {matchedOrgan.telefone}
                    </Text>
                  )}
                  <HStack mt={2} spacing={2} flexWrap="wrap">
                    {waLink && (
                      <Link href={waLink} isExternal>
                        <Button size="xs" colorScheme="whatsapp" variant="solid">
                          WhatsApp
                        </Button>
                      </Link>
                    )}
                    {emailLink && (
                      <Link href={emailLink}>
                        <Button size="xs" colorScheme="blue" variant="outline">
                          E-mail
                        </Button>
                      </Link>
                    )}
                    {matchedOrgan.site && (
                      <Link href={matchedOrgan.site} isExternal>
                        <Button size="xs" variant="ghost">
                          Site oficial
                        </Button>
                      </Link>
                    )}
                  </HStack>
                </AlertDescription>
              </Box>
            </Alert>
          </>
        )}

        <Button colorScheme="brand" onClick={handleSubmit} isLoading={loading}>
          Registrar demanda
        </Button>
      </Stack>
    </Box>
  );
}
