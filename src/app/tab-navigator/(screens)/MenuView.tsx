'use client';

import { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { components } from '../../../components';
import { useMenuByCatagoryStore } from '@/stores/useMenuByCatagoryStore';
import { items } from '../../../items';
import { svg } from '../../../svg';
// import { ProductType } from '@/types/DishType';

export const MenuView: React.FC = memo(() => {
  const {
    fetchCategoryDetails,
    clearCategoryDetails,
    products,
    isLoading,
    fetchCategoryWithSearch,
    fetchFilteredCategoryDetails,
    fetchNextPage,
    next,
  } = useMenuByCatagoryStore();
  const [categorySelected, setSelectedCatagoryState] = useState<number>(0);
  const [isFilterSectionOpen, setIsFilterSectionOpen] = useState<boolean>(false);
  const [search, setSearch] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    fetchCategoryDetails(0, 1);
    return () => {
      clearCategoryDetails();
    };
  }, [fetchCategoryDetails]);

  // Handle search focus from Home screen
  useEffect(() => {
    const focusParam = searchParams.get('focus');
    if (focusParam === 'search' && searchInputRef.current) {
      // Small delay to ensure the component is fully rendered
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [searchParams]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim().length > 0) {
        fetchCategoryWithSearch(categorySelected, 1, '', search);
      } else {
        if (categorySelected === 0) {
          fetchCategoryDetails(0, 1);
        } else {
          fetchFilteredCategoryDetails(categorySelected, 1);
        }
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [search, categorySelected, fetchCategoryDetails, fetchCategoryWithSearch, fetchFilteredCategoryDetails]);

  const memoizedSetSelectedCatagory = useCallback((id: number) => {
    setSelectedCatagoryState(id);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const toggleFilterSection = useCallback(() => {
    setIsFilterSectionOpen((prev) => !prev);
  }, []);

  const handleEndReached = () => {
    if (next) {
      fetchNextPage();
    }
  };

  const renderHeader = () => (
    <components.Header user={true} userName={true} title='Menu' showBasket={true} />
  );

  const searchSection = useMemo(
    () => (
      <section
        className='row-center container'
        style={{
          gap: 5,
          marginTop: 10,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 14,
        }}
      >
        <components.InputField
          ref={searchInputRef}
          inputType='search'
          placeholder='Search ...'
          containerStyle={{ flex: 1, backgroundColor: 'var(--white-color)', height: 50 }}
          value={search}
          onChange={handleSearchChange}
        />
        <button
          onClick={toggleFilterSection}
          style={{
            width: 50,
            height: 50,
            backgroundColor: 'var(--white-color)',
            borderRadius: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexShrink: 0,
          }}
          className='center'
        >
          <svg.FilterSvg />
        </button>
      </section>
    ),
    [search, handleSearchChange, toggleFilterSection]
  );

  const filterOptionsSection = useMemo(
    () => (
      <items.FilterOptionsList
        category='All'
        isOpened={isFilterSectionOpen}
        updateCatId={memoizedSetSelectedCatagory}
      />
    ),
    [isFilterSectionOpen, memoizedSetSelectedCatagory]
  );

  const renderDishes = () => {
    if (isLoading && products.length === 0) {
      return (
        <section className='container' style={{ paddingTop: 0 }}>
          {[0, 1].map((placeholderId, index, array) => (
            <items.MenuListItem
              isLoading={true}
              key={`skel-menu-${placeholderId}`}
              isLast={index === array.length - 1}
            />
          ))}
        </section>
      );
    }

    const filteredProducts = products.filter((dish) =>
      dish.name.toLowerCase().includes(search.toLowerCase())
    );

    if (filteredProducts.length === 0 && search.length > 0) {
      return (
        <section
          className='container'
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <span className='t16'>No dishes found for "{search}"</span>
        </section>
      );
    }

    if (products.length === 0 && !isLoading) {
      return (
        <section
          className='container'
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <span className='t16'>No dishes available.</span>
        </section>
      );
    }

    const productsToRender = search.length > 0 ? filteredProducts : products;

    return (
      <section>
        {productsToRender.map((dish, index) => (
          <items.MenuListItem
            dish={dish}
            key={dish.id}
            isLast={index === productsToRender.length - 1}
          />
        ))}
        {isLoading && <items.MenuListItem isLoading={true} />}
      </section>
    );
  };

  const renderContent = () => {
    const handleScroll = (event: React.UIEvent<HTMLElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
      if (scrollHeight - scrollTop <= clientHeight * 1.5) {
        handleEndReached();
      }
    };

    return (
      <main
        className='container scrollable'
        onScroll={handleScroll}
        style={{ paddingBottom: '70px', overflowY: 'auto', height: 'calc(100vh - 220px)' }}
      >
        {renderDishes()}
      </main>
    );
  };

  const renderModal = () => <components.Modal />;

  const renderBottomTabBar = () => <components.BottomTabBar />;

  return (
    <components.Screen>
      {renderHeader()}
      {searchSection}
      {filterOptionsSection}
      {renderContent()}
      {renderModal()}
      {renderBottomTabBar()}
    </components.Screen>
  );
});
