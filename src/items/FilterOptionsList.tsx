import { hooks } from '@/hooks';
// import { stores } from '@/stores';
import React, { useState, memo } from 'react'; // Import memo

type Prop = {
  category: string;
  isOpened?: boolean;
  updateCatId?: (id: number) => void;
};

export const FilterOptionsList: React.FC<Prop> = ({ isOpened = true, updateCatId }) => {
  const { category } = hooks.useGetMenu();
  // const { fetchFilteredCategoryDetails, fetchCategoryDetails } = stores.useMenuByCatagoryStore();

  const allItems = [
    { id: 0, name: 'All', image: '', order_by: 0 },
    ...category,
  ];

  const [selectedMenu, setSelectedMenu] = useState<string>('All');

  const updateMenuByCatagory = (name: string, id: number) => {
    setSelectedMenu(name);

    updateCatId?.(id);

  };

  return (
    <section
      style={{
        marginBottom: 20,
        height: isOpened ? '50px' : 0,
        opacity: isOpened ? 1 : 0,
        overflow: 'hidden',
        transition: 'all 0.4s ease',
        display: 'flex',
        gap: 15,
        overflowX: 'scroll',
        marginInline: 20,
      }}
    >
      {allItems.map((item) => (
        <button
          key={item.id}
          style={{
            padding: '10px 20px',
            borderRadius: 10,
            backgroundColor:
              selectedMenu === item.name ? 'var(--main-turquoise)' : '#E9F3F6',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClick={() => updateMenuByCatagory(item.name, item.id)}
        >
          <h5
            style={{
              color:
                selectedMenu === item.name ? 'var(--white-color)' : 'var(--main-dark)',
              fontWeight: 500,
              width:'max-content'
            }}
          >
            {item.name}
          </h5>
        </button>
      ))}
    </section>
  );
};

export default memo(FilterOptionsList); // Wrap with memo
