import React from 'react';

import {svg} from '../../svg';
import {Routes} from '../../routes';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';

export const PaymentSuccess: React.FC = () => {
  const renderHeader = () => {
    return <Header showGoBack={true} />;
  };

  const renderContent = () => {
    return (
      <main className='scrollable container'>
        <section
          style={{
            height: '100%',
            justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <svg.TransactionSvg style={{marginBottom: 30}} />
          <h2 style={{marginBottom: 30}}>
            Your payment has been <br /> processed!
          </h2>
          <h2 style={{fontWeight: 400, marginBottom: 10}}>
            364
            <span
              className='t16'
              style={{color: 'var(--main-dark)'}}
            >
              .00 USD
            </span>{' '}
          </h2>
          <p
            className='t16'
            style={{marginBottom: 30}}
          >
            Labore sunt culpa excepteur culpa ipsum. Labore occaecat ex nisi
            mollit.
          </p>
          <ul
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 17,
            }}
          >
            <li>
              <Button
                label='Send Receipt'
                colorScheme='secondary'
              />
            </li>
            <li>
              <Button
                label='Done'
                href={Routes.TAB_NAVIGATOR}
              />
            </li>
          </ul>
        </section>
      </main>
    );
  };

  return (
    <Screen>
      {renderHeader()}
      {renderContent()}
    </Screen>
  );
};
