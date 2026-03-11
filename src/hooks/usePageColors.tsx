import {useEffect} from 'react';

export const usePageColors = (backgroundColor: string, themeColor: string) => {
  useEffect(() => {
    document.body.style.backgroundColor = backgroundColor;

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeColor);
    }

    return () => {
      document.body.style.backgroundColor = '';
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', '');
      }
    };
  }, [backgroundColor, themeColor]);
};
