import { useState } from 'react';
// import { MenuType } from '../types';
import { urls } from '@/lib/config/urls';
import { noAuthClient } from '@/lib/axios/apiClient';
import { createApiService } from '@/lib/axios/apiService';
import { SubCategory } from '@/types/MenuType';

const publicApiService = createApiService(noAuthClient);

export const useGetSubCategories = (): { getSubCategories: (category_id: number) => void, subcategoryFetchingStatus: boolean; subCategory: SubCategory[] } => {
  const [subCategory, setSubCategory] = useState<SubCategory[]>([]);
  const [subcategoryFetchingStatus, setSubCategoryFetchingStatus] = useState<boolean>(false);

  const getSubCategories = async (category_id: number) => {
    setSubCategoryFetchingStatus(true);
    try {
      const res = await publicApiService.get<{ subcategories: SubCategory[] }>(`${urls['all-sub-category']}?page_size=15&category_id=${category_id}`);
      setSubCategory(res.subcategories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setSubCategory([]);
    } finally {
      setSubCategoryFetchingStatus(false);
    }
  };


  return { getSubCategories, subcategoryFetchingStatus, subCategory };
};
