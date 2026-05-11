import type { ContactData } from '@/lib/contact-types'

export const DEFAULT_CONTACT: ContactData = {
  businessName: 'Logitshop',
  tagline: 'IDEST accredited scuba services and professional diving logbooks. Built for performance. Certified for trust.',
  email: 'info@logitshop.com',
  phone: '',
  instagram: '@logit.shop',
  instagramUrl: 'https://www.instagram.com/logit.shop',
  address: {
    street: '12 Gloucester Road',
    city: 'Grantham',
    county: 'Lincolnshire',
    postcode: 'NG31 8RJ',
    country: 'UK',
  },
  companyName: 'Logitshop LTD',
  companyRegNumber: '15252219',
  vatInfo: 'VAT Registered company 2023',
  copyrightLine1: 'Copyright © 1998 LOG-it — All Rights Reserved.',
  copyrightLine2: 'Copyright © 2026 logitshop.com — All Rights Reserved.',
  siteUrl: 'https://logitshop.com',
  updatedAt: new Date(0).toISOString(),
}

export function mergeContactData(raw: Partial<ContactData> | null | undefined): ContactData {
  if (!raw || !raw.email) return { ...DEFAULT_CONTACT }
  return {
    ...DEFAULT_CONTACT,
    ...raw,
    address: { ...DEFAULT_CONTACT.address, ...(raw.address ?? {}) },
  }
}
