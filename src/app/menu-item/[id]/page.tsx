import type { Metadata } from 'next'
import { MenuItem } from './MenuItem'
import { urls } from '@/lib/config/urls'
import { noAuthClient } from '@/lib/axios/apiClient'
import { createApiService } from '@/lib/axios/apiService'
import type { ProductType } from '@/types/DishType'
import { cache } from 'react'


const publicApiService = createApiService(noAuthClient)

type Props = {
  params: Promise<{ id: string }>
}

const getCachedProductById = cache(async (id: string): Promise<ProductType | null> => {
  try {
    const numericId = parseInt(id, 10)
    if (isNaN(numericId)) {
      console.error('Invalid product ID:', id)
      return null
    }

    const res = await publicApiService.post<{ product: ProductType }>(
      urls['product-details'],
      { product_id: numericId }
    )
    return res.product || null
  } catch (error) {
    console.error('Error fetching product details:', error)
    return null
  }
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  try {
    const numericId = parseInt(id, 10)
    if (isNaN(numericId)) {
      console.error('Invalid product ID for metadata:', id)
      return {
        title: 'Menu Item Not Found',
        description: 'The requested menu item could not be found.',
      }
    }
    

    const product = await getCachedProductById(id)

    if (product) {
      return {
        title: product.name,
        description: product.product_description,
      }
    } else {
      return {
        title: 'Menu Item Not Found',
        description: 'Details for this menu item are not available.',
      }
    }
  } catch (error) {
    console.error('Error fetching product for metadata:', error)
    return {
      title: 'Error',
      description: 'Could not load menu item details.',
    }
  }
}

export default async function MenuItemPage({ params }: Props) {
  const resolvedParams = await params
  const product = await getCachedProductById(resolvedParams.id);
  return <MenuItem product={product} />
}
