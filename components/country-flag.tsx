import type { DiveDestinationCountryCode } from '@/lib/dive-destinations'

const COUNTRY_LABELS: Record<DiveDestinationCountryCode, string> = {
  gb: 'United Kingdom',
  eg: 'Egypt',
  gd: 'Grenada',
  jm: 'Jamaica',
}

export function CountryFlag({
  code,
  className = 'h-5 w-7 shrink-0 rounded-sm object-cover shadow-[0_1px_4px_rgba(0,0,0,0.35)] ring-1 ring-white/15',
}: {
  code: DiveDestinationCountryCode
  className?: string
}) {
  return (
    <img
      src={`https://flagcdn.com/w80/${code}.png`}
      srcSet={`https://flagcdn.com/w160/${code}.png 2x`}
      width={28}
      height={20}
      alt=""
      className={className}
      loading="lazy"
      decoding="async"
      aria-hidden="true"
    />
  )
}

export function countryFlagLabel(code: DiveDestinationCountryCode): string {
  return COUNTRY_LABELS[code]
}
