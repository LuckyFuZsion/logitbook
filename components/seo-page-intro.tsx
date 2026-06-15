export function SeoPageIntro({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="max-w-3xl mx-auto text-center text-white/65 text-base leading-relaxed mb-8 px-4"
      style={{ fontFamily: 'var(--font-rajdhani)' }}
    >
      {children}
    </p>
  )
}
