import axios from 'axios';
import {useState, useEffect} from 'react';

import {URLS} from '../config';
import {PromocodeType} from '../types';

export const useGetPromocodes = () => {
  const [promocodes, setPromocodes] = useState<PromocodeType[]>([]);
  const [promocodesLoading, setPromocodesLoading] = useState<boolean>(false);

  const getPromocodes = async () => {
    setPromocodesLoading(true);

    try {
      const response = await axios.get(URLS.GET_PROMOCODES);
      setPromocodes(response.data.promocodes);
    } catch (error) {
      console.error(error);
    } finally {
      setPromocodesLoading(false);
    }
  };

  useEffect(() => {
    getPromocodes();
  }, []);

  return {promocodesLoading, promocodes};
};
