'use client';

import React from 'react';
import Link from 'next/link';

import {svg} from '../../svg';
import {Routes} from '../../routes';
import {components} from '../../components';

export const SignUp: React.FC = () => {
  const renderHeader = () => {
    return <components.Header showGoBack={true} />;
  };

  const renderContent = () => {
    return (
      <main
        className='scrollable container'
        style={{paddingTop: 10}}
      >
        <section
          style={{
            height: '100%',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '10px',
            backgroundColor: 'var(--white-color)',
          }}
          className='container'
        >
          {/* SIGN UP */}
          <h1 style={{marginBottom: '30px', textTransform: 'capitalize'}}>
            Sign up
          </h1>

          {/* INPUT FIELDS */}
          <section>
            <components.InputField
              type='text'
              inputType='username'
              placeholder='Enter your username'
              containerStyle={{marginBottom: '10px'}}
            />
            <components.InputField
              type='email'
              inputType='email'
              placeholder='Enter your email'
              containerStyle={{marginBottom: '10px'}}
            />
            <components.InputField
              type='password'
              inputType='password'
              placeholder='Enter your password'
              containerStyle={{marginBottom: '10px'}}
            />
            <components.InputField
              type='password'
              inputType='password'
              placeholder='Confirm your password'
              containerStyle={{marginBottom: '14px'}}
            />
          </section>

          {/* SIGN IN BUTTON */}
          <section style={{marginBottom: '14px'}}>
            <components.Button
              label='Sign up'
              href={Routes.VERIFY_YOUR_PHONE_NUMBER}
            />
          </section>

          {/* REGISTER */}
          <section>
            <p
              className='t16'
              style={{marginBottom: '20px'}}
            >
              Already have an account?{' '}
              <Link
                href={Routes.SIGN_IN}
                style={{color: 'var(--main-turquoise)'}}
              >
                Sign in.
              </Link>
            </p>
          </section>
        </section>
      </main>
    );
  };

  const renderSocials = () => {
    const btnStyle: React.CSSProperties = {
      width: '100%',
      backgroundColor: 'var(--white-color)',
      height: 50,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    };

    return (
      <section
        className='container'
        style={{paddingTop: 10, paddingBottom: 10}}
      >
        <ul
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
          }}
        >
          <li
            style={btnStyle}
            className='clickable'
          >
            <svg.FacebookSvg />
          </li>
          <li
            style={btnStyle}
            className='clickable'
          >
            <svg.GoogleSvg />
          </li>
        </ul>
      </section>
    );
  };

  return (
    <components.Screen>
      {renderHeader()}
      {renderContent()}
      {renderSocials()}
    </components.Screen>
  );
};
