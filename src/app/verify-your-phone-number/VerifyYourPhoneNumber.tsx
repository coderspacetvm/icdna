'use client';

import React from 'react';

import {Routes} from '../../routes';
import {components} from '../../components';

export const VerifyYourPhoneNumber: React.FC = () => {
  const renderHeader = () => {
    return (
      <components.Header
        showGoBack={true}
        title='Verify your phone number'
      />
    );
  };

  const renderContent = () => {
    return (
      <main
        className='scrollable container'
        style={{paddingTop: '10px', paddingBottom: '10px'}}
      >
        <section
          style={{
            paddingTop: '30px',
            paddingBottom: '30px',
            borderRadius: '10px',
            backgroundColor: 'var(--white-color)',
          }}
          className='container'
        >
          <p
            className='t16'
            style={{marginBottom: '30px'}}
          >
            We have sent you an SMS with a code to number +17 0123456789.
          </p>
          <components.InputField
            type='text'
            inputType='phone'
            placeholder='Enter your phone number'
            containerStyle={{marginBottom: 14}}
          />
          <components.Button
            label='Confirm'
            href={Routes.CONFIRMATION_CODE}
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
