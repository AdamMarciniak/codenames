import React, { useRef, useEffect, useState, useMemo } from 'react'
import { animateAvatar } from './utils';
import { useApiCall } from '../api';

const avatarCache = {};

const PlayerAvatar = ({ id }) => {
  const avatarParams = useMemo(() => ({ id }), [id]);
  const [getAvatar] = useApiCall('getAvatar', avatarParams);
  const canvasRef = useRef(null);
  const [avatar, setAvatar] = useState(null);

  useEffect(
    () => {
      if (avatarCache[id]) {
        setAvatar(avatarCache[id]);
      } else {
        getAvatar().then((avatar) => {
          setAvatar(avatar);
          avatarCache[id] = avatar;
        });
      }
    },
    [getAvatar, setAvatar, id]
  );

   useEffect(
    () => {
      const ctx = canvasRef.current.getContext('2d');

      if (avatar) {
        animateAvatar(avatar, ctx)
      }
    },
    [canvasRef, avatar]
  );

  return (
    <div className='avatar-container'>
      <canvas className='avatar-canvas' width="348px" height="198px" ref={canvasRef}/>
    </div>
  )
}

export default PlayerAvatar;
