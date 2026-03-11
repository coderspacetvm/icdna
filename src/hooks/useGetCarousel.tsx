// import axios from 'axios';
import {useState, useEffect} from 'react';

// import {URLS} from '../config';
import {CarouselType} from '../types';
import { urls } from '@/lib/config/urls'; 
import { createApiService } from '@/lib/axios/apiService';
import {noAuthClient} from '@/lib/axios/apiClient'


const publicApiService = createApiService(noAuthClient)

export const useGetCarousel = () => {
  const [carousel, setCarousel] = useState<CarouselType[]>([]);
  const [carouselLoading, setCarouselLoading] = useState<boolean>(false);

  const getCarousel = async () => {
    setCarouselLoading(true);

    try {
      const response = await publicApiService.get<{ banners: CarouselType[] }>(urls['banner-section'])
      setCarousel(response?.banners);

    } catch (error) {
      console.error(error);
    } finally {
      setCarouselLoading(false);
    }
  };

  useEffect(() => {
    getCarousel();
  }, []);

  return {carouselLoading, carousel};
};
