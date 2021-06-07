import { useState, useEffect } from 'react';

// delay is how long before request is sent to server
// this is done so we dont send a request to the server
// everytime an input is entered and result in flooding the server
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
