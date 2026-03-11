import { ProductType } from './DishType';

export type CategoryType = {
  id: number;
  name?: string;
  image?: string;
  quantity?: string;
  audience?: string[];
};

export type CategoryInfo = {
  id: number;
  name: string;
  image: string;
  order_by: number;
  is_active: string;
};

export type BannerType = {
  id: number;
  image: string;
  is_active: string;
  order_by: number;
  url: string | null;
  category: number | null;
  product: number | null;
};

export type CategoryDetailsResponse = {
  status: number;
  message: string;
  count: number;
  next: string | null;
  previous: string | null;
  category: CategoryInfo;
  products: ProductType[];
  banner: BannerType[];
};

type LastRequest = {
  type: 'all' | 'filtered' | 'search';
  params: any;
};

export type CategoryListStoreState = {
  categoryDetails: CategoryDetailsResponse | null;
  products: ProductType[];
  categoryInfo: CategoryInfo | null;
  banner: BannerType[];
  isLoading: boolean;
  error: string | null;
  next: string | null;
  lastRequest: LastRequest | null;
  fetchCategoryDetails: (categoryId: number, page: number) => Promise<void>;
  fetchFilteredCategoryDetails: (categoryId: number, page: number, subcategory?: number) => Promise<void>;
  fetchCategoryWithSearch: (
    categoryId: number,
    page: number,
    filterKey: string,
    searchTermValue: string,
    subcategory?: number
  ) => Promise<void>;
  fetchNextPage: () => Promise<void>;
  clearCategoryDetails: () => void;
};

