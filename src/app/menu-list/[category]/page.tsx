import type { Metadata } from 'next';
import { MenuList } from './MenuList';

type PageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ id?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  return {
    title: decodedCategory,
    description: `List of menu items for ${decodedCategory}.`,
  };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { category } = await params;
  const { id } = await searchParams;
  const categoryId = id || '0';

  return <MenuList category={decodeURIComponent(category)} category_id={parseInt(categoryId)} />;
}