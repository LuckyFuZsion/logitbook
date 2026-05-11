import type { HeroData } from '@/lib/hero-types'

export const DEFAULT_HERO: HeroData = {
  subheading:
    'Professional-grade diving log, accredited servicing, and expert technical support for technical divers worldwide.',
  cta1Label: 'Shop Now',
  cta1Target: 'shop',
  cta2Label: 'Our Services',
  cta2Target: 'services',
  tickerItems: [
    'PROFESSIONAL GRADE LOGITBOOK',
    'IDEST ACCREDITED',
    'CERTIFIED DIVING TECHNICIANS',
    'REGULATOR & BCD SERVICING',
    'UNDERWATER EQUIPMENT EXPERTS',
    'DEEP WATER TESTED',
  ],
  updatedAt: new Date(0).toISOString(),
}

export function mergeHeroData(raw: Partial<HeroData> | null | undefined): HeroData {
  if (!raw || !raw.subheading) return { ...DEFAULT_HERO, tickerItems: [...DEFAULT_HERO.tickerItems] }
  return {
    ...DEFAULT_HERO,
    ...raw,
    tickerItems: Array.isArray(raw.tickerItems) && raw.tickerItems.length > 0
      ? raw.tickerItems
      : DEFAULT_HERO.tickerItems,
  }
}
