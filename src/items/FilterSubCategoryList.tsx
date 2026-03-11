// :chk may be we can club this component with FilterOptionsList component
import { hooks } from '@/hooks';
// import { stores } from '@/stores';
import React, { useState, memo } from 'react'; // Imported memo

type Prop = {
  category: string; // This is the main category name, used for initial selectedMenu state
  isOpened?: boolean;
  category_id: number
  updateCatId?: (id: number) => void;
  setSubCategoriesEmpty: React.Dispatch<React.SetStateAction<boolean>>
};

const FilterSubCategoryList: React.FC<Prop> = ({ category, category_id, isOpened = true, updateCatId, setSubCategoriesEmpty }) => {
  const { subCategory, getSubCategories } = hooks.useGetSubCategories();
  // const { fetchFilteredCategoryDetails, fetchCategoryDetails } = stores.useMenuByCatagoryStore();

  React.useEffect(() => {
    getSubCategories(category_id)
  }, [])

  // Removed filtering to show all subcategories as requested
  const filteredSubCategories = subCategory;
  const allItems = filteredSubCategories.length > 0
    ? [
      { id: 0, name: 'All', category: category_id },
      ...filteredSubCategories,
    ]
    : [];

  React.useEffect(() => {
    if (allItems.length === 0) {
      setSubCategoriesEmpty(true);
    } else {
      setSubCategoriesEmpty(false);
    }
  }, [allItems, setSubCategoriesEmpty]); // Added setSubCategoriesEmpty to deps

  const [selectedMenu, setSelectedMenu] = useState<string>('All'); // Default to 'All'

  const updateMenuBySubCategory = (name: string, id: number) => {
    setSelectedMenu(name);

    updateCatId?.(id);

    // if (id === 0) {
    //   fetchCategoryDetails(10); // This was for fetching all items of the main category
    // } else {
    // fetchFilteredCategoryDetails(category_id, 10,id); // This fetched for a specific sub-category
    // }
  };

  return (
    allItems.length > 0 ? <section
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
          onClick={() => updateMenuBySubCategory(item.name, item.id)}
        >
          <h5
            style={{
              color:
                selectedMenu === item.name ? 'var(--white-color)' : 'var(--main-dark)',
              fontWeight: 500,
              width: 'max-content'
            }}
          >
            {item.name}
          </h5>
        </button>
      ))}
    </section>
      : null
  );
};

export default memo(FilterSubCategoryList); // Wrapped component with memo
