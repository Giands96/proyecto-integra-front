"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/axios";

interface TrackingTerminal {
  nombreUbicacion: string;
}

interface TrackingCarga {
  tipoCarga: string;
}

interface TrackingResult {
  estado: string;
  terminalOrigen?: TrackingTerminal;
  terminalDestino?: TrackingTerminal;
  carga?: TrackingCarga;
  fechaRegistro: string;
  observacion?: string;
}

export default function TrackingPage() {
  const [trackingCode, setTrackingCode] = useState("");
  const [document, setDocument] = useState("");
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleSearch() {
    setLoading(true);
    setError(false);
    setResult(null);
    try {
      const response = await api.get<TrackingResult>(`/api/public/tracking/${trackingCode}/${document}`);
      setResult(response.data);
    } catch (err) {
      console.error(err)
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-100 p-8 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">Ransa Tracking</h1>
          <p className="mt-2 text-muted-foreground">Consulta el estado de tu envío en tiempo real</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Código de Seguimiento</label>
                <Input
                  placeholder="2026-XXXX"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">DNI / RUC</label>
                <Input
                  placeholder="Número de documento"
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                />
              </div>
            </div>
            <Button
              className="w-full mt-6"
              onClick={handleSearch}
              disabled={loading || !trackingCode || !document}
            >
              Consultar Estado
            </Button>
          </CardContent>
        </Card>

        {error && (
          <div className="rounded-lg border border-zinc-300 bg-zinc-200 p-4 text-center text-sm text-zinc-700">
            No se encontró información para los datos proporcionados.
          </div>
        )}

        {result && (
          <Card className="border-zinc-300 bg-white">
            <CardHeader className="border-b bg-zinc-100">
              <CardTitle className="flex justify-between items-center">
                <span>Estado del Envío</span>
                <Badge variant="secondary" className="text-lg px-4 py-1">
                  {result.estado}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                <div>
                  <p className="text-sm text-muted-foreground">Origen</p>
                  <p className="font-medium">{result.terminalOrigen?.nombreUbicacion}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Destino</p>
                  <p className="font-medium">{result.terminalDestino?.nombreUbicacion || "En tránsito"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Carga</p>
                  <p className="font-medium">{result.carga?.tipoCarga}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Última actualización</p>
                  <p className="font-medium">{new Date(result.fechaRegistro).toLocaleDateString()}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Observación</p>
                  <p className="italic">{result.observacion || "Sin observaciones"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
