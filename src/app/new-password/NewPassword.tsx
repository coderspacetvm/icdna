'use client';

import React from 'react';

import {Routes} from '../../routes';
import {components} from '../../components';

export const NewPassword: React.FC = () => {
  const renderHeader = () => {
    return (
      <components.Header
        title='Reset password'
        showGoBack={true}
      />
    );
  };

  const renderContent = () => {
    return (
      <main
        className='scrollable container'
        style={{paddingTop: '10px'}}
      >
        <section
          style={{
            paddingTop: '30px',
            paddingBottom: '30px',
            backgroundColor: 'var(--white-color)',
            borderRadius: '10px',
          }}
          className='container'
        >
          <p
            className='t16'
            style={{marginBottom: '30px'}}
          >
            Enter new password and confirm.
          </p>
          <components.InputField
            inputType='password'
            placeholder='Enter your password'
            containerStyle={{marginBottom: '14px'}}
          />
          <components.InputField
            inputType='password'
            placeholder='Confirm your password'
            containerStyle={{marginBottom: '20px'}}
          />
          <components.Button
            label='Change Password'
            href={Routes.FORGOT_PASSWORD_SENT_EMAIL}
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
