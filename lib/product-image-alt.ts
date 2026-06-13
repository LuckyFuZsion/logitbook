/** Accessible alt text for shop product images, derived from the product name. */
export function productImageAlt(
  productName: string,
  imageIndex = 0,
  imageCount = 1,
): string {
  const name = productName.trim()
  if (imageCount <= 1) return name
  return `${name} — image ${imageIndex + 1} of ${imageCount}`
}
