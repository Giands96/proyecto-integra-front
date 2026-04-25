import Link from "next/link";
import { Truck, ShieldCheck, Search } from "lucide-react";

export default function HomePage() {
  return (
    <div className="font-body bg-white text-ransa-text min-h-screen overflow-x-hidden">

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
            <span className="font-display text-[22px] tracking-[1.5px] text-blacks">
              RANSA <span className="text-ransa-accent">LOGÍSTICA</span>
            </span>
          </Link>

          <nav className="ml-auto flex gap-2.5">
            <Link
              href="/tracking"
              className="flex items-center gap-1.5 text-[13px] font-medium
                         px-5 py-2 rounded-md tracking-[0.5px]
                         text-neutral/75 border border-neutral/20 bg-transparent
                         transition-all duration-150
                         hover:bg-neutral-700 hover:text-white hover:border-white/35"
            >
              <Search size={13} />
              Rastreo
            </Link>
            <Link
              href="/login"
              className="flex items-center text-[13px] font-semibold
                         px-5 py-2 rounded-md tracking-[0.5px]
                         bg-ransa-accent text-ransa-navy border border-ransa-accent
                         transition-all duration-150
                         hover:bg-ransa-accent-lt"
            >
              Admin
            </Link>
          </nav>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-[580px] flex items-center overflow-hidden bg-ransa-navy">

        <div className="absolute inset-0 bg-hero-grid bg-grid-48 pointer-events-none" />

        <div className="absolute -top-[120px] -right-[100px] w-[500px] h-[500px]
                        rounded-full bg-hero-glow pointer-events-none" />

        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-accent-line" />

        <div className="relative z-10 max-w-[1100px] mx-auto px-8 py-20 w-full">

          <div className="inline-flex items-center gap-2
                          bg-ransa-accent/10 border border-ransa-accent/30
                          rounded-full px-3.5 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-ransa-accent animate-pulse-dot" />
            <span className="text-[11px] font-medium text-ransa-accent tracking-[1.5px] uppercase">
              Soluciones Logísticas Integrales
            </span>
          </div>

          <h1 className="font-display text-hero text-white mb-5">
            EFICIENCIA<br />
            Y <span className="text-ransa-accent">SEGURIDAD</span><br />
            EN CADA ENVÍO
          </h1>

          <p className="text-[17px] font-light text-white/60 max-w-[520px] leading-relaxed mb-10">
            Gestionamos tu carga con la tecnología más avanzada del mercado.
            Desde el origen hasta el destino, siempre conectados.
          </p>

          <Link
            href="/tracking"
            className="inline-flex items-center gap-2
                       bg-ransa-accent text-ransa-navy
                       text-sm font-semibold px-7 py-3.5 rounded-lg
                       border-none tracking-[0.3px]
                       transition-all duration-150
                       hover:bg-ransa-accent-lt hover:-translate-y-px"
          >
            <Search size={15} />
            Rastrear mi pedido
          </Link>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div className="bg-ransa-ink border-t border-white/5 border-b border-white/5 px-8 py-5">
        <div className="max-w-[1100px] mx-auto grid grid-cols-3 gap-4">

          {[
            { num: "+15K",  label: "Envíos mensuales"  },
            { num: "98.4%", label: "Entregas a tiempo" },
            { num: "24/7",  label: "Monitoreo activo"  },
          ].map((stat, i, arr) => (
            <div
              key={stat.label}
              className={`flex flex-col items-center text-center py-2
                          ${i < arr.length - 1 ? "border-r border-white/[0.07]" : ""}`}
            >
              <span className="font-display text-[28px] text-ransa-accent tracking-wide leading-none">
                {stat.num}
              </span>
              <span className="text-[11px] font-normal text-white/45 mt-1 tracking-[0.5px] uppercase">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="px-8 py-20 bg-white">
        <div className="max-w-[1100px] mx-auto mb-12">
          <span className="block text-[11px] font-medium tracking-[2px] uppercase text-ransa-accent mb-2">
            Por qué elegirnos
          </span>
          <h2 className="font-display text-[36px] tracking-wide text-ransa-navy leading-none">
            NUESTRAS VENTAJAS
          </h2>
        </div>

        <div className="max-w-[1100px] mx-auto
                        grid grid-cols-1 md:grid-cols-3
                        border border-ransa-border rounded-[14px] overflow-hidden
                        divide-y md:divide-y-0 md:divide-x divide-ransa-border">
          {[
            {
              icon: <Truck size={20} />,
              title: "Flota Moderna",
              desc:  "Camiones equipados con GPS y monitoreo constante para garantizar la trazabilidad de cada carga en todo momento.",
            },
            {
              icon: <ShieldCheck size={20} />,
              title: "Carga Segura",
              desc:  "Garantizamos la integridad de tus productos desde el origen hasta el destino con protocolos certificados.",
            },
            {
              icon: <Search size={20} />,
              title: "Trazabilidad",
              desc:  "Consulta el estado de tu envío en tiempo real con nuestro sistema de rastreo disponible las 24 horas.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="group bg-white px-8 py-9 cursor-default transition-colors duration-200 hover:bg-ransa-mist"
            >
              <div className="w-11 h-11 rounded-[10px] flex items-center justify-center mb-5
                              bg-ransa-navy text-white
                              transition-colors duration-200
                              group-hover:bg-ransa-accent group-hover:text-ransa-navy">
                {card.icon}
              </div>
              <h3 className="text-base font-medium text-ransa-navy mb-2">{card.title}</h3>
              <p className="text-sm font-light text-ransa-muted leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-ransa-navy border-t border-ransa-accent/15 px-8 py-7">
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

    </div>
  );
}