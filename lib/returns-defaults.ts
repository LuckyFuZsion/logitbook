import type { ReturnsData } from '@/lib/returns-types'

export const DEFAULT_RETURNS_DATA: ReturnsData = {
  pageTitle: 'RETURN & REFUND POLICY',
  sectionTitle: 'Payment Terms',
  points: [
    'All invoices are payable within 30 days from the date of the invoice.',
    'A late fee of 5% will be applied to any outstanding balance after the due date.',
    'If any invoice remains unpaid in full 90 days after the date of issue, Log-It Scuba Services reserves the right to retain, dispose of, or sell the relevant asset to recover any outstanding costs owed, including associated administrative or handling fees. Any surplus funds remaining after recovery of the debt will be returned to the customer.',
    'Any disputes regarding the invoice must be raised within 7 days of the invoice date or after equipment first use, whichever is sooner.',
    'Should a customer wish to return an item to Log-It Scuba Services, the customer shall be responsible for all return postage and packaging costs, unless the return is due to an error or fault attributable to Log-It Scuba Services.',
    'For any questions or concerns, please contact info@logitshop.com or call 07717751734.',
  ],
  updatedAt: new Date(0).toISOString(),
}

export function mergeReturnsData(raw: Partial<ReturnsData> | null | undefined): ReturnsData {
  if (!raw || !Array.isArray(raw.points) || raw.points.length === 0) {
    return { ...DEFAULT_RETURNS_DATA, points: [...DEFAULT_RETURNS_DATA.points] }
  }
  return {
    pageTitle: raw.pageTitle?.trim() || DEFAULT_RETURNS_DATA.pageTitle,
    sectionTitle: raw.sectionTitle?.trim() || DEFAULT_RETURNS_DATA.sectionTitle,
    points: raw.points.map((p) => p.trim()).filter(Boolean),
    updatedAt: raw.updatedAt ?? DEFAULT_RETURNS_DATA.updatedAt,
  }
}
