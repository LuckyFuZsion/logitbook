export interface SupplierLogo {
  src: string
  name: string
}

/** Intrinsic pixel size of supplier logo assets (square WebP). */
export const SUPPLIER_LOGO_WIDTH = 833
export const SUPPLIER_LOGO_HEIGHT = 833

export const SUPPLIER_LOGOS: SupplierLogo[] = [
  { src: '/SupplierLogos/Ap-Diving-Logo.webp', name: 'AP Diving' },
  { src: '/SupplierLogos/Beaver-Logo.webp', name: 'Beaver' },
  { src: '/SupplierLogos/Dynamic-Logo.webp', name: 'Dynamic' },
  { src: '/SupplierLogos/Kent-Tooling-Logo.webp', name: 'Kent Tooling' },
  { src: '/SupplierLogos/Kubi-Logo.webp', name: 'Kubi' },
  { src: '/SupplierLogos/MiFlex-Hoses-Logo.webp', name: 'MiFlex Hoses' },
  { src: '/SupplierLogos/NammuTech-Logo.webp', name: 'NammuTech' },
  { src: '/SupplierLogos/Northern-Diver-Logo.webp', name: 'Northern Diver' },
  { src: '/SupplierLogos/XDeep-Logo.webp', name: 'XDeep' },
]
