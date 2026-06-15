import { SUPPLIER_LOGOS } from '@/lib/supplier-logos'

function supplierLogoAlt(name: string) {
  return `${name} logo`
}

export default function SupplierLogosCarousel() {
  const logos = [...SUPPLIER_LOGOS, ...SUPPLIER_LOGOS]

  return (
    <section
      className="py-10 border-y border-[var(--charcoal-light)] bg-[var(--charcoal)]/50 overflow-hidden"
      aria-label="Supplier partners"
    >
      <p
        className="text-center text-xs font-semibold tracking-[0.3em] uppercase text-white/45 mb-8 px-4"
        style={{ fontFamily: 'var(--font-rajdhani)' }}
      >
        Trusted Suppliers
      </p>
      <div className="pointer-events-none select-none overflow-hidden">
        <div className="flex supplier-ticker w-max items-center gap-10 md:gap-16 px-6">
          {logos.map((logo, index) => {
            const isDuplicate = index >= SUPPLIER_LOGOS.length
            return (
            <div
              key={`${logo.src}-${index}`}
              className="flex w-28 md:w-36 shrink-0 flex-col items-center gap-2"
              aria-hidden={isDuplicate || undefined}
            >
              <div className="flex h-12 md:h-14 w-full items-center justify-center">
                <img
                  src={logo.src}
                  alt={supplierLogoAlt(logo.name)}
                  className="max-h-full max-w-full object-contain opacity-75 brightness-110"
                  loading="lazy"
                  draggable={false}
                />
              </div>
              <p
                className="text-[10px] md:text-xs text-white/55 text-center leading-tight tracking-wide"
                style={{ fontFamily: 'var(--font-rajdhani)' }}
              >
                {logo.name}
              </p>
            </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
