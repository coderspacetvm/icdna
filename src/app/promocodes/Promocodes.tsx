'use client';

import React from 'react';

import {items} from '../../items';
import {hooks} from '../../hooks';
import {components} from '../../components';

export const Promocodes: React.FC = () => {
  const {promocodes, promocodesLoading} = hooks.useGetPromocodes();

  const renderHeader = () => {
    return (
      <components.Header
        showGoBack={true}
        title='Promocodes & gift cards'
      />
    );
  };

  const renderContent = () => {
    if (promocodes.length === 0 && promocodesLoading) return null;

    return (
      <main
        className='scrollable container'
        style={{paddingTop: 10, paddingBottom: 10}}
      >
        <ul style={{paddingTop: 10, paddingBottom: 20}}>
          {promocodes.map((promocode: any, index: number, array: any[]) => {
            const isLast = index === array.length - 1;

            return (
              <items.PromocodeItem
                isLast={isLast}
                key={promocode.id}
                promocode={promocode}
              />
            );
          })}
        </ul>
      </main>
    );
  };

  const renderFooter = () => {
    return (
      <section
        style={{
          padding: 20,
          gap: 10,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}
        className='row-center'
      >
        <div style={{flex: 1}}>
          <components.InputField
            type='text'
            inputType='promocode'
            placeholder='Add new coupon'
          />
        </div>

        <button
          style={{
            width: '33.33%',
            height: 50,
            borderRadius: 10,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'var(--main-turquoise)',
          }}
        >
          <span
            className='t14'
            style={{color: 'var(--white-color)', fontWeight: 700}}
          >
            + Add
          </span>
        </button>
      </section>
    );
  };

  return (
    <components.Screen>
      {renderHeader()}
      {renderContent()}
      {renderFooter()}
    </components.Screen>
  );
};
