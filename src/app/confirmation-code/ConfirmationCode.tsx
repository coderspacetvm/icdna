'use client';

import React from 'react';

import {Routes} from '../../routes';
import {components} from '../../components';

export const ConfirmationCode: React.FC = () => {
  const inputs = ['', '', '', '', ''];

  const renderHeader = () => {
    return (
      <components.Header
        showGoBack={true}
        title='Verify your phone number'
      />
    );
  };

  const renderContent = () => {
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value.length > 1) {
        e.target.value = e.target.value.slice(0, 1);
      }
    };

    return (
      <main
        className='scrollable container'
        style={{paddingTop: 13, paddingBottom: 20}}
      >
        <section
          style={{
            paddingTop: 30,
            paddingBottom: 30,
            borderRadius: 10,
            backgroundColor: 'var(--white-color)',
          }}
          className='container'
        >
          <span
            className='t16'
            style={{marginBottom: 30, display: 'block'}}
          >
            Enter your OTP code here.
          </span>
          <ul
            style={{
              marginBottom: 30,
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 9,
            }}
          >
            {inputs.map((_, index) => (
              <li
                key={index}
                style={{
                  display: 'flex',
                  width: '100%',
                  aspectRatio: 1 / 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '1px solid var(--main-turquoise)',
                }}
              >
                <input
                  maxLength={1}
                  style={{
                    textAlign: 'center',
                    width: '100%',
                    height: '100%',
                    borderRadius: 10,
                    border: 'none',
                    fontSize: 20,
                  }}
                  type='number'
                  min={0}
                  max={9}
                  onInput={handleInput}
                />
              </li>
            ))}
          </ul>
          <span className='t16'>
            Didn’t receive the OTP?{' '}
            <span
              style={{color: 'var(--main-turquoise)'}}
              className='clickable'
            >
              Resend.
            </span>
          </span>
          <components.Button
            label='verify'
            style={{marginTop: 30}}
            href={Routes.SIGN_UP_ACCOUNT_CREATED}
          />
        </section>
      </main>
    );
  };

  return (
    <components.Screen>
      {renderHeader()}
      {renderContent()}
    </components.Screen>
  );
};
