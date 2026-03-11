'use client';

import React, {useState} from 'react';
import {useRouter} from 'next/navigation';

import {components} from '../../components';

const menu = [
  {
    id: 1,
    name: 'Salads',
  },
  {
    id: 2,
    name: 'Meat',
  },
  {
    id: 3,
    name: 'Pasta',
  },
  {
    id: 4,
    name: 'Desserts',
  },
  {
    id: 5,
    name: 'Drinks',
  },
  {
    id: 6,
    name: 'Soups',
  },
  {
    id: 7,
    name: 'Snacks',
  },
];

const preferences = [
  {
    id: 1,
    name: 'Vegetarian',
  },
  {
    id: 2,
    name: 'Vegan',
  },
  {
    id: 3,
    name: 'Gluten-Free',
  },
  {
    id: 4,
    name: 'Nut-Free',
  },
  {
    id: 5,
    name: 'Keto',
  },
  {
    id: 6,
    name: 'Low-Fat',
  },
  {
    id: 7,
    name: 'Organic',
  },
];

export const Filter: React.FC = () => {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState('spicy');
  const [selectedMenu, setSelectedMenu] = useState(menu[1].name);
  const [selectedPreferences, setSelectedPreferences] = useState(
    preferences[3].name,
  );

  const renderHeader = () => {
    return (
      <components.Header
        title='Filter'
        showGoBack={true}
      />
    );
  };

  const renderCategories = () => {
    return (
      <section style={{marginBottom: 30}}>
        <ul style={{display: 'flex', alignItems: 'center', gap: 8}}>
          {['new', 'spicy'].map((category, index) => {
            return (
              <li
                key={index}
                style={{
                  padding: '10px 20px',
                  backgroundColor:
                    selectedCategory === category
                      ? 'var(--main-turquoise)'
                      : '#E9F3F6',
                  borderRadius: 10,
                }}
                className='clickable'
                onClick={() => setSelectedCategory(category)}
              >
                <span
                  className='t14'
                  style={{
                    color:
                      selectedCategory === category
                        ? 'var(--white-color)'
                        : 'var(--main-dark)',
                    textTransform: 'capitalize',
                    fontWeight: 500,
                  }}
                >
                  {category}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    );
  };

  const renderMenu = () => {
    return (
      <section style={{marginBottom: 30}}>
        <h5 style={{marginBottom: 14}}>Category</h5>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          {menu.map((menu: any, index: number) => {
            return (
              <button
                key={menu.id}
                style={{
                  padding: '10px 20px',
                  borderRadius: 10,
                  backgroundColor:
                    selectedMenu === menu.name
                      ? 'var(--main-turquoise)'
                      : '#E9F3F6',
                }}
                onClick={() => {
                  setSelectedMenu(menu.name);
                }}
              >
                <h5
                  style={{
                    color:
                      selectedMenu === menu.name
                        ? 'var(--white-color)'
                        : 'var(--main-dark)',
                    fontWeight: 500,
                  }}
                >
                  {menu.name}
                </h5>
              </button>
            );
          })}
        </div>
      </section>
    );
  };

  const renderDietaryPreferences = () => {
    return (
      <section style={{marginBottom: 30}}>
        <h5 style={{marginBottom: 14}}>Dietary Preferences</h5>
        <ul
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          {preferences.map((preference: any, index) => {
            return (
              <li
                key={preference.id}
                style={{
                  padding: '10px 20px',
                  borderRadius: 10,
                  backgroundColor:
                    selectedPreferences === preference.name
                      ? 'var(--main-turquoise)'
                      : '#E9F3F6',
                }}
                onClick={() => {
                  setSelectedPreferences(preference.name);
                }}
              >
                <button
                  className='t14'
                  style={{
                    color:
                      selectedPreferences === preference.name
                        ? 'var(--white-color)'
                        : 'var(--main-dark)',
                    fontWeight: 500,
                  }}
                  onClick={() => {
                    setSelectedPreferences(preference.name);
                  }}
                >
                  {preference.name}
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    );
  };

  const renderButtons = () => {
    return (
      <section style={{padding: 20}}>
        <components.Button
          label='apply filters'
          containerStyle={{marginBottom: 10}}
          onClick={() => {
            router.back();
          }}
        />
        <components.Button
          label='Reset filters'
          colorScheme='secondary'
          onClick={() => {
            setSelectedCategory('spicy');
            setSelectedMenu(menu[1].name);
            setSelectedPreferences(preferences[3].name);
          }}
          style={{border: '0px', fontWeight: 400}}
        />
      </section>
    );
  };

  const renderContent = () => {
    return (
      <main
        className='scrollable container'
        style={{paddingTop: 10}}
      >
        <section
          style={{
            backgroundColor: 'var(--white-color)',
            paddingTop: '10%',
            borderRadius: 10,
            paddingBottom: '10%',
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          {renderCategories()}
          {renderMenu()}
          {renderDietaryPreferences()}
        </section>
      </main>
    );
  };

  return (
    <components.Screen>
      {renderHeader()}
      {renderContent()}
      {renderButtons()}
    </components.Screen>
  );
};
