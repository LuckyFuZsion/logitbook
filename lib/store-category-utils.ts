import type { StoreCategory } from '@/lib/store-types'

export function slugCategoryId(title: string, existingIds: string[]): string {
  const base =
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'category'
  let id = base
  let n = 2
  while (existingIds.includes(id)) {
    id = `${base}-${n++}`
  }
  return id
}

export function getCategoryTitle(categories: StoreCategory[], categoryId: string): string {
  return categories.find((c) => c.id === categoryId)?.title ?? categoryId
}

export function newStoreCategory(existingIds: string[]): StoreCategory {
  const title = 'New category'
  return {
    id: slugCategoryId(title, existingIds),
    title,
  }
}
