"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/common/PageHeader";
import { useDemandStore } from "@/store/demandStore";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Select,
  Stack,
  Textarea,
  useToast,
  Checkbox,
} from "@chakra-ui/react";
import { useState } from "react";
import { Demand, DemandCategory, DemandPriority } from "@/types/demand";
import { useRouter } from "next/navigation";

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
      <PageHeader title="Nova demanda" subtitle="Descreva o problema urbano" />
      <Stack spacing={6}>
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Título</FormLabel>
              <Input value={form.titulo ?? ""} onChange={(e) => handleChange("titulo", e.target.value)} />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Categoria</FormLabel>
              <Select value={form.categoria ?? "outros"} onChange={(e) => handleChange("categoria", e.target.value)}>
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
              <FormLabel>Descrição</FormLabel>
              <Textarea value={form.descricao ?? ""} onChange={(e) => handleChange("descricao", e.target.value)} rows={4} />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Prioridade</FormLabel>
              <Select value={form.prioridade ?? "media"} onChange={(e) => handleChange("prioridade", e.target.value)}>
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </Select>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>Ponto de referência</FormLabel>
              <Input value={form.endereco?.referencia ?? ""} onChange={(e) => handleChange("endereco", { ...form.endereco, referencia: e.target.value })} />
            </FormControl>
          </GridItem>
        </Grid>

        <Box>
          <FormControl isRequired>
            <FormLabel>Endereço</FormLabel>
            <Input mb={2} placeholder="Rua" value={form.endereco?.endereco ?? ""} onChange={(e) => handleChange("endereco", { ...form.endereco, endereco: e.target.value })} />
            <Input mb={2} placeholder="Bairro" value={form.endereco?.bairro ?? ""} onChange={(e) => handleChange("endereco", { ...form.endereco, bairro: e.target.value })} />
            <Input placeholder="Cidade" value={form.endereco?.cidade ?? ""} onChange={(e) => handleChange("endereco", { ...form.endereco, cidade: e.target.value })} />
          </FormControl>
        </Box>

        <Box>
          <FormControl isRequired>
            <FormLabel>Contato</FormLabel>
            <Input mb={2} placeholder="Nome" value={form.nomeSolicitante ?? ""} onChange={(e) => handleChange("nomeSolicitante", e.target.value)} />
            <Input mb={2} placeholder="Email" type="email" value={form.emailSolicitante ?? ""} onChange={(e) => handleChange("emailSolicitante", e.target.value)} />
            <Input placeholder="Telefone" value={form.telefoneSolicitante ?? ""} onChange={(e) => handleChange("telefoneSolicitante", e.target.value)} />
          </FormControl>
        </Box>

        <Checkbox isChecked={accepted} onChange={(e) => setAccepted(e.target.checked)}>
          Concordo em compartilhar estes dados para atendimento da demanda.
        </Checkbox>

        <Button colorScheme="brand" size="lg" alignSelf="flex-start" onClick={handleSubmit} isLoading={loading}>
          Enviar demanda
        </Button>
      </Stack>
    </AppLayout>
  );
}
