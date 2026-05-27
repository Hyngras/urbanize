"use client";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDemandStore } from "@/store/demandStore";
import { Demand, DemandCategory } from "@/types/demand";

const categories: DemandCategory[] = ["vias_publicas", "iluminacao_publica", "coleta_de_lixo", "saneamento", "fiscalizacao", "zeladoria", "outros"];

export function DemandForm() {
  const toast = useToast();
  const { createDemand, loading } = useDemandStore();
  const [form, setForm] = useState<Partial<Demand>>({
    categoria: "iluminacao_publica",
    status: "registrada",
  });

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
      },
      origem: "cidadao" as const,
      historico: [],
    } as Omit<Demand, "id" | "protocolo" | "criadaEm" | "atualizadaEm">;

    try {
      const created = await createDemand(payload);
      toast({ title: "Demanda registrada", status: "success" });
      return created;
    } catch (error) {
      console.error(error);
      toast({ title: "Erro ao registrar demanda", status: "error" });
    }
  };

  return (
    <Box bg="white" p={6} rounded="lg" border="1px solid" borderColor="gray.100" shadow="sm">
      <Stack spacing={4}>
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
          <Select
            value={(form.categoria as string) ?? "iluminacao_publica"}
            onChange={(e) => handleChange("categoria", e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
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
        <Button colorScheme="brand" onClick={handleSubmit} isLoading={loading}>
          Registrar demanda
        </Button>
      </Stack>
    </Box>
  );
}
