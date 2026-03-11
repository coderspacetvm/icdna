'use client';

import React, {useState} from 'react';

import {svg} from '../../svg';
import {components} from '../../components';

const faqs = [
  {
    id: 1,
    question: 'How to open a new card?',
    answer:
      'To open a new card, you need to go to the "Open new card" screen and select the type of card you want to open. After that, you need to fill in the required fields and click the "Open" button.',
  },
  {
    id: 2,
    question: 'Can I close my account?',
    answer:
      'Yes, you can close your account. To do this, you need to go to the "Close account" screen and click the "Close account" button.',
  },
  {
    id: 3,
    question: 'Does the bank charge a fee for using the card?',
    answer:
      'Yes, the bank charges a fee for using the card. The fee depends on the type of card and the amount of money you spend.',
  },
  {
    id: 4,
    question: 'How to transfer money to another account?',
    answer:
      'To transfer money to another account, you need to go to the "Transfer money" screen and fill in the required fields. After that, you need to click the "Transfer" button.',
  },
  {
    id: 5,
    question: 'How to change the PIN code?',
    answer:
      'To change the PIN code, you need to go to the "Change PIN code" screen and fill in the required fields. After that, you need to click the "Change" button.',
  },
];

export const FAQ: React.FC = () => {
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(
    null,
  );

  const toggleAccordion = (index: number) => {
    if (openAccordionIndex === index) {
      setOpenAccordionIndex(null);
    } else {
      setOpenAccordionIndex(index);
    }
  };

  const renderHeader = () => {
    return (
      <components.Header
        showGoBack={true}
        title='FAQ'
      />
    );
  };

  const renderContent = () => {
    return (
      <main
        className='scrollable container'
        style={{paddingTop: '10px', paddingBottom: '20px'}}
      >
        <ul>
          {faqs.map((faq, index) => (
            <li
              key={index}
              style={{marginBottom: '10px'}}
            >
              <details onToggle={() => toggleAccordion(index)}>
                <summary
                  style={{
                    padding: '14px 20px',
                    borderRadius: '10px',
                    backgroundColor: '#FFF7F2',
                    border:
                      openAccordionIndex === index
                        ? '1px solid #FF8A71'
                        : '1px solid transparent',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  className='clickable'
                >
                  <h5>{faq.question}</h5>
                  {openAccordionIndex === index ? (
                    <svg.IsOpenSvg />
                  ) : (
                    <svg.IsCloseSvg />
                  )}
                </summary>
                <div style={{padding: '14px 20px'}}>
                  <p className='t16 element'>{faq.answer}</p>
                </div>
              </details>
            </li>
          ))}
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
