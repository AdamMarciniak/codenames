import io from 'socket.io-client';
import { useCallback } from 'react';
const socket = io(window.location.hostname + ':3001');

const api = (endpoint, params) => {
  socket.emit(endpoint, params, (error) => {
    if (error) {
      console.error(error);
    } else {
      console.log('success!');
    }
  });
}

export const listen = (event, callback) => {
  socket.on(event, callback);
};

export const useApiCall = (event, params) => useCallback(() => api(event, params), [event, params]);

export default api;
