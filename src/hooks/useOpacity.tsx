import {useEffect} from 'react';

export const useOpacity = (setOpacity: (value: number) => void) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpacity(1);
    }, 0);

    return () => clearTimeout(timer);
  }, [setOpacity]);
};
