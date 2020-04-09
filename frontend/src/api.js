import io from 'socket.io-client';
import { useCallback } from 'react';
import cookies from 'browser-cookies';
import {render} from './index'
export const socket = io(window.location.hostname + ':6970');


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
  const secret = cookies.get('secret');
  if (secret) {
    api('identify', { secret }).then(render).catch(() => {
      console.error('secret expired');
      cookies.erase('secret');
    });
  }
});

window.addEventListener('focus', () => {
    console.log('Reconnecting')
     const secret = cookies.get('secret');
    if (secret) {
      api('identify', { secret }).then(render).catch(() => {
        console.error('secret expired');
        cookies.erase('secret');
      });
    }

})

export const useApiCall = (event, params) => useCallback(() => api(event, params), [event, params]);

export default api;
