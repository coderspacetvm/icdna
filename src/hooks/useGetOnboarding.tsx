import axios from 'axios';
import {useState, useEffect} from 'react';

import {URLS} from '../config';

type OnboardingItem = {
  id: number;
  title1: string;
  title2: string;
  image: string;
  description1: string;
  description2: string;
};

export const useGetOnboarding = () => {
  const [onboarding, setOnboarding] = useState<OnboardingItem[]>([]);
  const [onboardingLoading, setOnboardingLoading] = useState(false);

  const getOnboarding = async () => {
    setOnboardingLoading(true);

    try {
      const response = await axios.get(URLS.GET_ONBOARDING);
      setOnboarding(response.data.onboarding);
    } catch (error) {
      console.error(error);
    } finally {
      setOnboardingLoading(false);
    }
  };

  useEffect(() => {
    getOnboarding();
  }, []);

  return {onboardingLoading, onboarding};
};
