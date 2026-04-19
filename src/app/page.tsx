import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Truck, ShieldCheck, Search, ArrowRight } from "lucide-react";
import React from "react";


export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 h-16 border-b border-border/70 bg-background/90 px-4 backdrop-blur lg:px-6">
        <div className="mx-auto flex h-full max-w-7xl items-center">
        <Link className="flex items-center justify-center" href="/">
          <Truck className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold text-foreground">Ransa Logística</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" href="/tracking">
            Rastreo
          </Link>
          <Link className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" href="/login">
            Admin
          </Link>
        </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full bg-gradient-to-b from-secondary/50 via-background to-background py-14 md:py-24 lg:py-32 xl:py-40">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Eficiencia y Seguridad en cada Envío
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Soluciones logísticas integrales para tu negocio. Gestionamos tu carga con la tecnología más avanzada del mercado.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/tracking">
                  <Button size="lg" className="px-8 shadow-md shadow-primary/20">
                    <Search className="mr-2 h-4 w-4" />
                    Rastrear Pedido
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="border-primary/25 bg-card px-8 text-foreground hover:bg-secondary/70">
                    Portal Administrativo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-2xl border border-border/70 bg-card/95 p-6 shadow-sm">
                <Truck className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Flota Moderna</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Contamos con camiones equipados con GPS y monitoreo constante.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-2xl border border-border/70 bg-card/95 p-6 shadow-sm">
                <ShieldCheck className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Carga Segura</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Garantizamos la integridad de tus productos desde el origen hasta el destino.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-2xl border border-border/70 bg-card/95 p-6 shadow-sm">
                <Search className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Trazabilidad</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Consulta el estado de tu envío en cualquier momento con nuestro sistema de rastreo.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t border-border/70 bg-card/70 px-4 py-6 md:px-6 sm:flex-row">
        <p className="text-xs text-muted-foreground">© 2026 Ransa Logística S.A. Todos los derechos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs text-muted-foreground transition-colors hover:text-foreground" href="#">
            Términos de Servicio
          </Link>
          <Link className="text-xs text-muted-foreground transition-colors hover:text-foreground" href="#">
            Privacidad
          </Link>
        </nav>
      </footer>
      
    </div>
  );
}
