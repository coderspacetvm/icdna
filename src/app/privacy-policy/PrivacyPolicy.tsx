'use client';

import React from 'react';

import {components} from '../../components';

const privacyPolicy = [
  {
    id: 1,
    title: 'Terms',
    content:
      'By accessing this website, you are agreeing to be bound by these website Terms and Conditions of Use, applicable laws and regulations and their compliance. If you disagree with any of the stated terms and conditions, you are prohibited from using or accessing this site. The materials contained in this site are secured by relevant copyright and trademark law.',
  },
  {
    id: 2,
    title: 'Use Licence',
    content:
      'Permission is allowed to temporarily download one duplicate of the materials (data or programming) on Company site for individual and non-business use only. This is just a permit of license and not an exchange of title',
  },
];

export const PrivacyPolicy: React.FC = () => {
  const renderHeader = () => {
    return <components.Header showGoBack={true} />;
  };

  const renderContent = () => {
    return (
      <main
        className='scrollable container'
        style={{paddingTop: 10}}
      >
        <h2 style={{marginBottom: 20}}>Privacy policy</h2>
        <ul>
          {privacyPolicy.map((item, index, array) => {
            const isLast = index === array.length - 1;
            return (
              <li
                key={index}
                style={{marginBottom: isLast ? 0 : 30}}
              >
                <div
                  style={{
                    marginBottom: 10,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <h4 style={{marginRight: 4}}>{item.id}.</h4>
                  <h4>{item.title}</h4>
                </div>
                <span className='t16'>{item.content}</span>
              </li>
            );
          })}
        </ul>
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
