'use client';

import { useEffect, useRef, useState } from 'react';
import { components } from '@/components';
import { items } from '@/items';
import { noAuthClient } from '@/lib/axios/apiClient';
import { createApiService } from '@/lib/axios/apiService';
import { ProductType } from '@/types/DishType';

const publicApiService = createApiService(noAuthClient);
const PAGE_SIZE = 12;

interface ApiResponse {
  status: number;
  products: ProductType[];
  count: number;
  next: string | null;
  previous: string | null;
}

export default function AllProductsPage() {
  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Refs hold always-fresh values the IntersectionObserver can read without stale closure
  const sentinelRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef(1);          // current page already fetched
  const isLoadingRef = useRef(false); // mirror of isLoading state, readable in callbacks
  const hasMoreRef = useRef(true);    // mirror of hasMore state

  const fetchProducts = async (pageNum: number) => {
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    setIsLoading(true);

    try {
      const res = await publicApiService.get<ApiResponse>(
        `/user/recomended-product?page=${pageNum}&page_size=${PAGE_SIZE}`
      );

      const newProducts = res.products || [];
      setTotalCount(res.count || 0);

      setAllProducts((prev) =>
        pageNum === 1 ? newProducts : [...prev, ...newProducts]
      );

      // No more pages when `next` is null
      const more = res.next !== null;
      hasMoreRef.current = more;
      setHasMore(more);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      hasMoreRef.current = false;
      setHasMore(false);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProducts(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set up IntersectionObserver once — reads only from refs (always fresh)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMoreRef.current &&
          !isLoadingRef.current
        ) {
          const nextPage = pageRef.current + 1;
          pageRef.current = nextPage;
          fetchProducts(nextPage);
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← runs once, observer never re-registers


  const renderSkeletonGrid = (count: number) => (
    <ul
      style={{
        display: 'grid',
        gap: 15,
        gridTemplateColumns: 'repeat(2, 1fr)',
        margin: '0px 20px',
        padding: 0,
        listStyle: 'none',
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <items.ItemGrid key={`skeleton-${i}`} isLoading={true} />
      ))}
    </ul>
  );

  return (
    <components.Screen>
      <components.Header
        showGoBack={true}
        title="All Products"
        showBasket={true}
      />

      <main
        className="scrollable"
        style={{ paddingTop: 10, paddingBottom: 80, height: '100%' }}
      >
        {/* Page Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 20px 16px 20px',
          }}
        >
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--main-dark)',
              margin: 0,
            }}
          >
            All Products
          </h2>
          {totalCount > 0 && (
            <span
              style={{
                fontSize: '13px',
                color: 'var(--text-light-grey)',
                fontWeight: 500,
                backgroundColor: 'var(--page-background-color, #f5f5f5)',
                padding: '4px 10px',
                borderRadius: '20px',
              }}
            >
              {totalCount} items
            </span>
          )}
        </div>

        {/* Initial skeleton loading */}
        {isInitialLoad ? (
          renderSkeletonGrid(12)
        ) : allProducts.length === 0 ? (
          /* Empty state */
          <div
            style={{
              textAlign: 'center',
              padding: '80px 20px',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                border: '2px solid #f1f5f9',
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={28}
                height={28}
                fill="none"
                stroke="#94a3b8"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </div>
            <h3
              style={{
                color: '#94a3b8',
                fontSize: '16px',
                fontWeight: '500',
                margin: '0 0 6px 0',
              }}
            >
              No products found
            </h3>
            <p
              style={{
                color: '#cbd5e1',
                fontSize: '14px',
                margin: 0,
                lineHeight: '1.5',
              }}
            >
              Check back soon
            </p>
          </div>
        ) : (
          <>
            {/* Product grid */}
            <ul
              style={{
                display: 'grid',
                gap: 15,
                gridTemplateColumns: 'repeat(2, 1fr)',
                margin: '0px 20px',
                padding: 0,
                listStyle: 'none',
              }}
            >
              {allProducts.map((product) => (
                <items.ItemGrid key={product.id} item={product} />
              ))}
            </ul>

            {/* Loading more skeletons (inline append) */}
            {isLoading && !isInitialLoad && (
              <ul
                style={{
                  display: 'grid',
                  gap: 15,
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  margin: '15px 20px 0 20px',
                  padding: 0,
                  listStyle: 'none',
                }}
              >
                {Array.from({ length: 2 }).map((_, i) => (
                  <items.ItemGrid key={`loading-more-${i}`} isLoading={true} />
                ))}
              </ul>
            )}

            {/* End of list indicator */}
            {!hasMore && allProducts.length > 0 && (
              <p
                style={{
                  textAlign: 'center',
                  color: 'var(--text-light-grey)',
                  fontSize: '13px',
                  margin: '24px 20px 0 20px',
                  padding: '12px',
                  borderTop: '1px solid #f1f5f9',
                }}
              >
                You&apos;ve seen all products
              </p>
            )}

            {/* Invisible sentinel for IntersectionObserver */}
            <div ref={sentinelRef} style={{ height: 1, marginTop: 10 }} />
          </>
        )}
      </main>

      <components.BottomTabBar />
    </components.Screen>
  );
}
