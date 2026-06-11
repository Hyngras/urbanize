"use client";

import {
  Box,
  Button,
  HStack,
  Image,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { DemandCategory } from "@/types/demand";
import { classifyImage } from "@/utils/imageClassifier";

interface TriagemResult {
  categoria: DemandCategory;
  score: number;
  labels: string[];
}

interface UploadResult {
  imageUrl: string;
  triagem: TriagemResult;
  latitude?: number;
  longitude?: number;
}

interface Props {
  onResult: (result: UploadResult) => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:4000/api";

const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("urbanize-auth");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: { token?: string | null } };
    return parsed.state?.token ?? null;
  } catch {
    return null;
  }
};

const extractExifGps = async (file: File): Promise<{ latitude: number; longitude: number } | null> => {
  try {
    const exifr = (await import("exifr")).default;
    const gps = await exifr.gps(file);
    if (gps?.latitude && gps?.longitude) {
      return { latitude: gps.latitude, longitude: gps.longitude };
    }
  } catch {
    // exifr pode falhar silenciosamente em imagens sem EXIF
  }
  return null;
};

const getBrowserGps = (): Promise<{ latitude: number; longitude: number } | null> =>
  new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ latitude: coords.latitude, longitude: coords.longitude }),
      () => resolve(null),
      { timeout: 5000 }
    );
  });

export function ImageUpload({ onResult }: Props) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setLoading(true);

    try {
      // 1. Tenta extrair GPS do EXIF da imagem
      let gps = await extractExifGps(file);

      // 2. Fallback: pede localização ao browser
      if (!gps) {
        gps = await getBrowserGps();
      }

      // 3. Classifica imagem localmente com MobileNet (sem API externa)
      const img = document.createElement("img");
      img.src = objectUrl;
      await new Promise<void>((resolve) => { img.onload = () => resolve(); });
      const triagem = await classifyImage(img);

      // 4. Envia imagem ao backend (só para armazenar o arquivo)
      const formData = new FormData();
      formData.append("imagem", file);
      formData.append("categoria", triagem.categoria);

      const token = getToken();
      const res = await fetch(`${API_BASE}/upload/image`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include",
        body: formData,
      });

      if (!res.ok) throw new Error("Erro ao enviar imagem.");

      const json = await res.json() as { success: boolean; data: { imageUrl: string; triagem: TriagemResult } };

      // Usa triagem local (mais rápida) — backend pode sobrescrever se Vision estiver configurado
      const finalTriagem = json.data.triagem.categoria !== "outros" ? json.data.triagem : triagem;

      onResult({
        imageUrl: json.data.imageUrl,
        triagem: finalTriagem,
        latitude: gps?.latitude,
        longitude: gps?.longitude,
      });

      toast({
        title: "Imagem analisada",
        description: `Categoria sugerida: ${finalTriagem.categoria.replace(/_/g, " ")}`,
        status: "success",
        duration: 4000,
      });
    } catch {
      toast({ title: "Erro ao processar imagem", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      <Button
        colorScheme="blue"
        variant="outline"
        onClick={() => inputRef.current?.click()}
        isLoading={loading}
        leftIcon={<Text>📷</Text>}
      >
        TIRAR FOTO ou ANEXAR IMAGEM
      </Button>

      {loading && (
        <HStack>
          <Spinner size="sm" />
          <Text fontSize="sm" color="gray.500">
            Classificando imagem e detectando localização…
          </Text>
        </HStack>
      )}

      {preview && !loading && (
        <Box borderRadius="md" overflow="hidden" maxH="200px">
          <Image src={preview} alt="Pré-visualização" objectFit="cover" w="100%" maxH="200px" />
        </Box>
      )}
    </Stack>
  );
}
