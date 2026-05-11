export interface ContactAddress {
  street: string
  city: string
  county: string
  postcode: string
  country: string
}

export interface ContactData {
  businessName: string
  tagline: string
  email: string
  phone: string
  instagram: string
  instagramUrl: string
  address: ContactAddress
  companyName: string
  companyRegNumber: string
  vatInfo: string
  copyrightLine1: string
  copyrightLine2: string
  siteUrl: string
  updatedAt: string
}
