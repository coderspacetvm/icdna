import { create } from 'zustand';
import { createApiService } from '@/lib/axios/apiService';
import { urls } from '@/lib/config/urls';
import noAuthClient from '@/lib/axios/noAuthClient';
import { CategoryDetailsResponse, CategoryListStoreState } from '@/types/CategoryType';

const publicApiService = createApiService(noAuthClient);

const initialState: Omit<
  CategoryListStoreState,
  | 'fetchCategoryDetails'
  | 'fetchFilteredCategoryDetails'
  | 'fetchCategoryWithSearch'
  | 'clearCategoryDetails'
  | 'fetchNextPage'
> = {
  categoryDetails: null,
  products: [],
  categoryInfo: null,
  banner: [],
  isLoading: false,
  error: null,
  next: null,
  lastRequest: null,
};

export const useMenuByCatagoryStore = create<CategoryListStoreState>()((set, get) => ({
  ...initialState,

  fetchCategoryDetails: async (categoryId: number, page: number) => {
    set({ isLoading: true, error: null });
    const requestBody = { category_id: categoryId };
    try {
      const response = await publicApiService.post<CategoryDetailsResponse>(
        urls['category-details'] + `?page=${page}`,
        requestBody
      );

      if (response.status === 1) {
        const rawProducts = response.products || [];
        const uniqueProducts = Array.from(new Map(rawProducts.map((item) => [item.id, item])).values());
        set({
          products: uniqueProducts,
          categoryInfo: response.category,
          banner: response.banner || [],
          isLoading: false,
          next: response.next,
          lastRequest: { type: 'all', params: requestBody },
        });
      } else {
        set({
          isLoading: false,
          error: response.message || 'Failed to fetch category details',
          next: null,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'An unknown error occurred',
        isLoading: false,
        next: null,
      });
    }
  },

  fetchFilteredCategoryDetails: async (categoryId: number, page: number, subcategory?: number) => {
    set({ isLoading: true, error: null });
    const requestBody = {
      category_id: categoryId,
      subcategory_id: subcategory,
    };
    try {
      const response = await publicApiService.post<CategoryDetailsResponse>(
        urls['category-details'] + `?page=${page}`,
        requestBody
      );
      if (response.status === 1) {
        const rawProducts = response.products || [];
        const uniqueProducts = Array.from(new Map(rawProducts.map((item) => [item.id, item])).values());
        set({
          products: uniqueProducts,
          categoryInfo: response.category,
          banner: response.banner || [],
          isLoading: false,
          next: response.next,
          lastRequest: { type: 'filtered', params: requestBody },
        });
      } else {
        set({
          isLoading: false,
          error: response.message || 'Failed to fetch filtered category details',
          next: null,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'An unknown error occurred',
        isLoading: false,
        next: null,
      });
    }
  },

  fetchCategoryWithSearch: async (
    categoryId: number,
    page: number,
    filterKey: string,
    searchTermValue: string,
    subcategory?: number
  ) => {
    set({ isLoading: true, error: null });
    const requestBody = {
      category_id: categoryId,
      filter_term: 'search_term',
      search_term: searchTermValue,
      subcategory_id: subcategory,
    };
    try {
      const response = await publicApiService.post<CategoryDetailsResponse>(
        urls['category-details'] + `?page=${page}`,
        requestBody
      );
      if (response.status === 1) {
        const rawProducts = response.products || [];
        const uniqueProducts = Array.from(new Map(rawProducts.map((item) => [item.id, item])).values());
        set({
          products: uniqueProducts,
          categoryInfo: response.category,
          banner: response.banner || [],
          isLoading: false,
          next: response.next,
          lastRequest: { type: 'search', params: requestBody },
        });
      } else {
        set({
          isLoading: false,
          error: response.message || 'Failed to fetch category details with search',
          next: null,
        });
      }
    } catch (error: any) {
      set({
        error: error.message || 'An unknown error occurred',
        isLoading: false,
        next: null,
      });
    }
  },

  fetchNextPage: async () => {
    const { next, products, lastRequest } = get();
    if (!next || get().isLoading) {
      return;
    }

    set({ isLoading: true });
    try {
      const response = await publicApiService.post<CategoryDetailsResponse>(next, lastRequest?.params);
      if (response.status === 1) {
        const newProducts = response.products || [];
        const uniqueNewProducts = newProducts.filter((newItem) => !products.some((existingItem) => existingItem.id === newItem.id));
        set({
          products: [...products, ...uniqueNewProducts],
          next: response.next,
          isLoading: false,
        });
      } else {
        set({ isLoading: false, error: response.message || 'Failed to fetch next page' });
      }
    } catch (error: any) {
      set({ isLoading: false, error: error.message || 'An unknown error occurred' });
    }
  },

  clearCategoryDetails: () => {
    set(initialState);
  },
}));

