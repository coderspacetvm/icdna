'use client';

import Image from 'next/image';
import React, {useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import PuffLoader from 'react-spinners/PuffLoader';

import {hooks} from '../hooks';
import {Routes} from '../routes';
import {components} from '../components';

export const Onboarding: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const {onboarding: onboardingData, onboardingLoading} =
    hooks.useGetOnboarding();

  const renderCarousel = () => {
    if (onboardingData.length === 0 || onboardingLoading) return null;

    return (
      <section
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Swiper
          onSlideChange={(swiper) => setCurrentSlideIndex(swiper.activeIndex)}
        >
          {onboardingData.map((item) => (
            <SwiperSlide
              key={item.id}
              style={{width: '100%', height: 'auto'}}
            >
              <Image
                src={item.image}
                alt='Onboarding'
                width={0}
                height={0}
                sizes='100vw'
                priority={true}
                style={{width: '60%', height: 'auto', margin: '0 auto'}}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    );
  };

  const renderDots = () => {
    if (onboardingData.length === 0 || onboardingLoading) return null;

    return (
      <section
        className='container'
        style={{
          gap: 8,
          marginBottom: '8%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {onboardingData.map((item, index) => (
          <div
            key={item.id}
            style={{
              width: 8,
              height: currentSlideIndex === index ? 20 : 8,
              borderRadius: '4px',
              backgroundColor:
                currentSlideIndex === index ? '#06402B' : '#ACE3E6',
            }}
          />
        ))}
      </section>
    );
  };

  const renderDescription = () => {
    if (onboardingData.length === 0 || onboardingLoading) return null;

    const currentItem = onboardingData[currentSlideIndex];
    return (
      <section
        className='container'
        style={{marginBottom: 20}}
      >
        <div
          style={{
            backgroundColor: 'var(--white-color)',
            borderRadius: 10,
            paddingTop: '10%',
            paddingBottom: '10%',
          }}
        >
          <h1 style={{textAlign: 'center', textTransform: 'capitalize'}}>
            {currentItem.title1}
          </h1>
          <h1 style={{textAlign: 'center', textTransform: 'capitalize'}}>
            {currentItem.title2}
          </h1>
          <p
            className='t16'
            style={{marginTop: '14px', color: '#B4B4C6', textAlign: 'center'}}
          >
            {currentItem.description1} <br />
            {currentItem.description2}
          </p>
        </div>
      </section>
    );
  };

  const renderButton = () => {
    if (onboardingData.length === 0 || onboardingLoading) return null;

    return (
      <section
        className='container'
        style={{padding: '0 20px 20px 20px'}}
      >
        <components.Button
          label='Get Started'
          href={Routes.TAB_NAVIGATOR}
        />
      </section>
    );
  };

  const renderLoader = () => {
    if (!onboardingLoading) return null;

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          inset: 0,
          height: '100%',
        }}
        className='flex-center'
      >
        <PuffLoader
          size={40}
          color={'#455A81'}
          aria-label='Loading Spinner'
          data-testid='loader'
          speedMultiplier={1}
        />
      </div>
    );
  };

  return (
    <components.Screen>
      {renderCarousel()}
      {renderDots()}
      {renderDescription()}
      {renderButton()}
      {renderLoader()}
    </components.Screen>
  );
};
