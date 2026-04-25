"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Truck, Search, ArrowLeft } from "lucide-react";
import { TrackingResultModal } from "@/modules/tracking/components/TrackingResultModal";
import { trackingService } from "@/modules/tracking/services/trackingService";
import { TrackingResult } from "@/modules/tracking/types";
import { getHttpStatus } from "@/modules/tracking/utils";

export default function TrackingPage() {
  const [trackingCode, setTrackingCode] = useState("");
  const [document, setDocument]         = useState("");
  const [result, setResult]             = useState<TrackingResult | null>(null);
  const [loading, setLoading]           = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  async function handleSearch() {
    const idSeguimiento = trackingCode.trim();
    const documento = document.trim();

    if (!idSeguimiento || !documento) {
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setResult(null);
    setIsResultModalOpen(false);

    try {
      const trackingResult = await trackingService.buscarPorSeguimiento(idSeguimiento, documento);
      setResult(trackingResult);
      setIsResultModalOpen(true);
      return;
    } catch (errorCarga) {
      console.error("No se encontró carga por tracking:", errorCarga);

      const status = getHttpStatus(errorCarga);
      if (status === 401 || status === 403) {
        setErrorMessage("No tienes permisos para consultar tracking en este momento.");
        setLoading(false);
        return;
      }
    }

    try {
      const trackingResult = await trackingService.buscarCitaFallback(idSeguimiento, documento);
      setResult(trackingResult);
      setIsResultModalOpen(true);
    } catch (errorCita) {
      console.error("No se encontró cita por tracking:", errorCita);
      setErrorMessage("No se encontró una carga o cita con ese código de seguimiento y documento.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="font-body min-h-screen bg-ransa-navy overflow-x-hidden">

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 h-16 flex items-center px-8
                         bg-ransa-navy/97 backdrop-blur-md
                         border-b border-ransa-accent/20">
        <div className="max-w-[1100px] w-full mx-auto flex items-center">
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-[34px] h-[34px] bg-ransa-accent rounded-[6px]
                            flex items-center justify-center text-ransa-navy">
              <Truck size={18} />
            </div>
            <span className="font-display text-[22px] tracking-[1.5px] text-white">
              RANSA <span className="text-ransa-accent">LOGÍSTICA</span>
            </span>
          </Link>
          <nav className="ml-auto">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-[13px] font-medium
                         px-4 py-2 rounded-md text-white/60
                         transition-colors hover:text-white"
            >
              <ArrowLeft size={13} />
              Volver al inicio
            </Link>
          </nav>
        </div>
      </header>

      {/* ── HERO STRIP ── */}
      <div className="relative bg-ransa-navy border-b border-white/5 px-8 py-14 text-center overflow-hidden">
        <div className="absolute inset-0 bg-hero-grid bg-grid-48 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px]
                        rounded-full bg-hero-glow pointer-events-none -translate-y-1/2" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-ransa-accent/10 border border-ransa-accent/30
                          rounded-full px-3.5 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-ransa-accent animate-pulse-dot" />
            <span className="text-[11px] font-medium text-ransa-accent tracking-[1.5px] uppercase">
              Sistema de Rastreo
            </span>
          </div>
          <h1 className="font-display text-[42px] md:text-[56px] tracking-[2px] text-white leading-none">
            RASTREAR <span className="text-ransa-accent">ENVÍO</span>
          </h1>
          <p className="mt-3 text-[15px] font-light text-white/50 max-w-md mx-auto leading-relaxed">
            Ingresa tu código de seguimiento y documento para consultar el estado en tiempo real.
          </p>
          <p className="text-white mt-4 flex flex-col">o.. intenta con nuestro nuevo Asistente IA ;) <span className="text-white/50">(ubicado en la esquina inferior derecha)</span></p>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="px-8 py-12">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Search card */}
          <div className="bg-ransa-ink border border-white/10 rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-white/50 uppercase tracking-[1px]">
                  Código de Seguimiento
                </label>
                <Input
                  placeholder="2026-XXXX"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !loading && trackingCode && document && handleSearch()}
                  className="bg-ransa-navy/60 border-white/10 text-white placeholder:text-white/25
                             focus-visible:ring-ransa-accent/40 focus-visible:border-ransa-accent/50
                             h-11 rounded-lg"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-white/50 uppercase tracking-[1px]">
                  DNI / RUC
                </label>
                <Input
                  placeholder="Número de documento"
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !loading && trackingCode && document && handleSearch()}
                  className="bg-ransa-navy/60 border-white/10 text-white placeholder:text-white/25
                             focus-visible:ring-ransa-accent/40 focus-visible:border-ransa-accent/50
                             h-11 rounded-lg"
                />
              </div>
            </div>

            <button
              onClick={handleSearch}
              disabled={loading || !trackingCode || !document}
              className="w-full mt-5 h-11 flex items-center justify-center gap-2
                         font-semibold text-sm tracking-[0.3px] rounded-lg
                         bg-ransa-accent text-ransa-navy
                         transition-all duration-150
                         hover:bg-ransa-accent-lt hover:-translate-y-px
                         disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-ransa-navy/30 border-t-ransa-navy
                                   rounded-full animate-spin" />
                  Consultando...
                </>
              ) : (
                <>
                  <Search size={15} />
                  Consultar Estado
                </>
              )}
            </button>
          </div>

          {/* Error state */}
          {errorMessage && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 text-center">
              <p className="text-sm text-red-400 font-medium">
                {errorMessage}
              </p>
              <p className="text-xs text-red-400/60 mt-1">
                Verifica el código de seguimiento y el documento ingresado.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="mt-8 border-t border-ransa-accent/15 px-8 py-7">
        <div className="max-w-[1100px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <p className="text-[13px] font-light text-white/35">
            © 2026 Ransa Logística S.A. Todos los derechos reservados.
          </p>
          <nav className="flex gap-6">
            <Link href="#" className="text-[13px] text-white/40 no-underline transition-colors hover:text-ransa-accent">
              Términos de Servicio
            </Link>
            <Link href="#" className="text-[13px] text-white/40 no-underline transition-colors hover:text-ransa-accent">
              Privacidad
            </Link>
          </nav>
        </div>
      </footer>

      <TrackingResultModal
        open={isResultModalOpen}
        onOpenChange={setIsResultModalOpen}
        result={result}
        trackingCode={trackingCode}
      />

    </div>
  );
}