import { useEffect } from 'react';
import history from '@/utils/history';

export default (url, defaultUrl = '/') => {
  useEffect(() => {
    if (history.location.pathname === defaultUrl) {
      history.replace(url);
    }
  }, []);
};
