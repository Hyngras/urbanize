import { Button, Flex, Input, Select, Stack } from "@chakra-ui/react";
import { useDemandStore } from "@/store/demandStore";

export function DemandFilters() {
  const { filters, setFilters, fetchDemands } = useDemandStore();

  const handleChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value || undefined });
  };

  return (
    <Stack direction={{ base: "column", md: "row" }} spacing={3} mb={4}>
      <Input placeholder="Buscar por título" value={filters.busca ?? ""} onChange={(e) => handleChange("busca", e.target.value)} />
      <Select placeholder="Status" value={filters.status ?? ""} onChange={(e) => handleChange("status", e.target.value)}>
        <option value="registrada">Registrada</option>
        <option value="em_analise">Em análise</option>
        <option value="encaminhada">Encaminhada</option>
        <option value="em_atendimento">Em atendimento</option>
        <option value="resolvida">Resolvida</option>
        <option value="cancelada">Cancelada</option>
      </Select>
      <Select placeholder="Categoria" value={filters.categoria ?? ""} onChange={(e) => handleChange("categoria", e.target.value)}>
        <option value="vias_publicas">Vias públicas</option>
        <option value="iluminacao_publica">Iluminação pública</option>
        <option value="coleta_de_lixo">Coleta de lixo</option>
        <option value="saneamento">Saneamento</option>
        <option value="fiscalizacao">Fiscalização</option>
        <option value="zeladoria">Zeladoria</option>
        <option value="outros">Outros</option>
      </Select>
      <Select placeholder="Prioridade" value={filters.prioridade ?? ""} onChange={(e) => handleChange("prioridade", e.target.value)}>
        <option value="baixa">Baixa</option>
        <option value="media">Média</option>
        <option value="alta">Alta</option>
      </Select>
      <Button colorScheme="brand" onClick={() => fetchDemands(filters)}>
        Aplicar filtros
      </Button>
    </Stack>
  );
}
