import io from 'socket.io-client';
import { useCallback } from 'react';
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

export const useApiCall = (event, params) => useCallback(() => api(event, params), [event, params]);

export default api;
