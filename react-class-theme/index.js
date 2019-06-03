import './normal.css';
import { useRef, useEffect } from 'react';

export const setGlobalTheme = (theme = {}) => {
  for (const k in theme) {
    document.body.style.setProperty(k, theme[k]);
  }
};

export default function useThemeRef(theme = {}, ref = null) {
  const themeRef = useRef(ref);

  useEffect(() => {
    if (themeRef.current) {
      if (theme) {
        for (const k in theme) {
          if (theme[k] !== void 0) {
            themeRef.current.style.setProperty(k, theme[k]);
          }
        }
      }
    }
  }, [themeRef, JSON.stringify(theme)]);

  return themeRef;
}
