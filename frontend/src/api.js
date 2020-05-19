import io from "socket.io-client";
import { useCallback, useState } from "react";
export const socket = io(window.location.hostname + ':6969');
//export const socket = io('http://those.codes' + ':6969');


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
};

export const useApiCall = (event, params, onError) => {
  const [inFlight, setInFlight] = useState(false);
  const callback = useCallback(async () => {
    setInFlight(true);
    try {
      const result = await api(event, params);
      setInFlight(false);
      return result;
    } catch (e) {
      setInFlight(false);
      if (onError) {
        onError(e);
      }
      throw e;
    }
  }, [event, params, onError]);
  return [callback, inFlight];
};

export default api;
