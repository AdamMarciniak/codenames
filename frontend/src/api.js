import io from 'socket.io-client';
import { useCallback, useState } from 'react';
import cookies from 'browser-cookies';
import {render} from './index'
export const socket = io(window.location.hostname + ':6969');


let index = 0;

const api = (endpoint, params) => {
  console.log(`API call ${index}:`, endpoint, params);
  return new Promise((resolve, reject) => {
    socket.emit(endpoint, params, (error, result) => {
      if (error) {
        console.error(error);
        reject(error);
      } else {
        console.log(`Success  ${index} (${endpoint})`);
        resolve(result);
      }
    });
  });
}

socket.on('reconnect', () => {
  console.log('auto-reconnecting');
  const secret = cookies.get('secret');
  if (secret) {
    api('identify', { secret }).then(render).catch(() => {
      console.error('secret expired');
      cookies.erase('secret');
    });
  }
});

export const useApiCall = (event, params) => {
  const [inFlight, setInFlight] = useState(false);
  const callback = useCallback(
    async () => {
      setInFlight(true);
      try {
        const result = await api(event, params);
        setInFlight(false);
        return result;
      } catch (e) {
        setInFlight(false);
        throw e;
      }
    },
    [event, params]
  );
  return [callback, inFlight];
};

export default api;
