import { Box, Button, Flex, Icon, Input, InputGroup, InputLeftElement, Select, Stack } from "@chakra-ui/react";
import { useDemandStore } from "@/store/demandStore";
import { FiSearch, FiFilter } from "react-icons/fi";

export function DemandFilters() {
  const { filters, setFilters, fetchDemands } = useDemandStore();

  const handleChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value || undefined });
  };

  const inputStyle = {
    bg: "white",
    border: "1px solid",
    borderColor: "gray.200",
    _hover: { borderColor: "gray.300" },
    _focus: { borderColor: "brand.400", bg: "white", boxShadow: "0 0 0 1px var(--chakra-colors-brand-400)" },
  };

  return (
    <Box
      bg="white"
      p={4}
      rounded="xl"
      border="1px solid"
      borderColor="gray.100"
      shadow="sm"
      mb={5}
    >
      <Flex align="center" gap={2} mb={3}>
        <Icon as={FiFilter} color="gray.400" boxSize={4} />
      </Flex>
      <Stack direction={{ base: "column", md: "row" }} spacing={3}>
        <InputGroup flex={2}>
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Buscar por título..."
            value={filters.busca ?? ""}
            onChange={(e) => handleChange("busca", e.target.value)}
            {...inputStyle}
          />
        </InputGroup>
        <Select
          placeholder="Status"
          value={filters.status ?? ""}
          onChange={(e) => handleChange("status", e.target.value)}
          flex={1}
          {...inputStyle}
        >
          <option value="registrada">Registrada</option>
          <option value="em_analise">Em análise</option>
          <option value="encaminhada">Encaminhada</option>
          <option value="em_atendimento">Em atendimento</option>
          <option value="resolvida">Resolvida</option>
          <option value="cancelada">Cancelada</option>
        </Select>
        <Select
          placeholder="Categoria"
          value={filters.categoria ?? ""}
          onChange={(e) => handleChange("categoria", e.target.value)}
          flex={1}
          {...inputStyle}
        >
          <option value="vias_publicas">Vias públicas</option>
          <option value="iluminacao_publica">Iluminação pública</option>
          <option value="coleta_de_lixo">Coleta de lixo</option>
          <option value="saneamento">Saneamento</option>
          <option value="fiscalizacao">Fiscalização</option>
          <option value="zeladoria">Zeladoria</option>
          <option value="outros">Outros</option>
        </Select>
        <Select
          placeholder="Prioridade"
          value={filters.prioridade ?? ""}
          onChange={(e) => handleChange("prioridade", e.target.value)}
          flex={1}
          {...inputStyle}
        >
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </Select>
        <Button
          colorScheme="brand"
          onClick={() => fetchDemands(filters)}
          shadow="sm"
          _hover={{ shadow: "md", transform: "translateY(-1px)" }}
          transition="all 0.2s"
          flexShrink={0}
        >
          Aplicar
        </Button>
      </Stack>
    </Box>
  );
}
