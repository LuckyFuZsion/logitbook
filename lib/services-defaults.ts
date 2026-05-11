import type { ServicesData } from '@/lib/services-types'

export const DEFAULT_SERVICES_DATA: ServicesData = {
  categories: [
    {
      id: 'cylinders',
      title: 'Cylinder Services',
      icon: 'Droplet',
      description:
        'All cylinder services include valve service. O₂ fills not included. IDEST accredited.',
      services: [
        { id: 'cyl-1', name: 'Hydro (PIAT) test + air fill', standard: 64.0, member: 60.0 },
        { id: 'cyl-2', name: 'Visual (PI) test + air fill', standard: 55.0, member: 50.0 },
        { id: 'cyl-3', name: 'O₂ clean', standard: 25.0, member: 25.0 },
        { id: 'cyl-4', name: 'Internal shot blast', standard: 18.0, member: 15.0 },
        { id: 'cyl-5', name: 'Chemical clean', standard: 20.0, member: 18.0 },
        { id: 'cyl-6', name: 'Twinset manifold surcharge', standard: 15.0, member: 10.0 },
        { id: 'cyl-7', name: 'Test failure', standard: 18.0, member: 18.0 },
        {
          id: 'cyl-8',
          name: 'External shot blast & repaint',
          standard: null,
          member: null,
          note: 'Price on request',
        },
      ],
    },
    {
      id: 'regulators',
      title: 'Regulator Services',
      icon: 'Wrench',
      description:
        'All regulator services include gauge check. Specialist brands: price on request. IDEST accredited.',
      services: [
        { id: 'reg-1', name: '1st & 2nd stage service', standard: 100.0, member: 95.0 },
        {
          id: 'reg-2',
          name: '1st stage, 2nd stage & octo service',
          standard: 140.0,
          member: 130.0,
        },
        {
          id: 'reg-3',
          name: 'O₂ clean (mandatory if using 25%+ O₂)',
          standard: 25.0,
          member: 25.0,
        },
        {
          id: 'reg-4',
          name: 'SPG conformity check',
          standard: 10.0,
          member: 10.0,
          note: 'Free with gauge purchase',
        },
        {
          id: 'reg-5',
          name: 'Surcharge for heavily soiled equipment',
          standard: 15.0,
          member: 15.0,
        },
        {
          id: 'reg-6',
          name: 'Diagnostic fee',
          standard: 30.0,
          member: 30.0,
          note: 'Halved if service completed',
        },
      ],
    },
    {
      id: 'bcds',
      title: 'BCD Services',
      icon: 'Zap',
      description:
        'Complete BCD maintenance including pressure check and antibacterial bladder clean. IDEST accredited.',
      services: [
        {
          id: 'bcd-1',
          name: 'BCD service (incl. pressure check & antibacterial clean)',
          standard: 35.0,
          member: 31.0,
        },
      ],
    },
    {
      id: 'repairs',
      title: 'Repairs & Custom Work',
      icon: 'LifeBuoy',
      description:
        'Expert repair work and custom modifications for specialized diving equipment.',
      services: [
        { id: 'rep-1', name: 'Repair work (per hour)', standard: 25.0, member: 20.0 },
        {
          id: 'rep-2',
          name: 'Custom work (per hour or individually priced)',
          standard: 25.0,
          member: 20.0,
        },
        {
          id: 'rep-3',
          name: 'Out-of-scope / additional hourly rate',
          standard: 25.0,
          member: 20.0,
        },
      ],
    },
  ],
  vatNote:
    'All prices include VAT at 20%. Specialist kits or increased kit costs will be confirmed before work begins.',
  membersNote:
    'Members pricing applies to members of our partner dive club, where we are their preferred service provider.',
  clubUrl: 'https://binghamsac.co.uk',
  clubName: 'Bingham SAC',
  updatedAt: new Date(0).toISOString(),
}

export function mergeServicesData(raw: Partial<ServicesData> | null | undefined): ServicesData {
  if (!raw || !Array.isArray(raw.categories) || raw.categories.length === 0) {
    return { ...DEFAULT_SERVICES_DATA }
  }
  return {
    categories: raw.categories,
    vatNote: raw.vatNote ?? DEFAULT_SERVICES_DATA.vatNote,
    membersNote: raw.membersNote ?? DEFAULT_SERVICES_DATA.membersNote,
    clubUrl: raw.clubUrl ?? DEFAULT_SERVICES_DATA.clubUrl,
    clubName: raw.clubName ?? DEFAULT_SERVICES_DATA.clubName,
    updatedAt: raw.updatedAt ?? DEFAULT_SERVICES_DATA.updatedAt,
  }
}
