import React, { useRef, useEffect, useState, useMemo } from 'react'
import { animateAvatar } from './utils';
import { useApiCall } from '../api';

const PlayerAvatar = props => {
  const avatarParams = useMemo(() => ({ id: props.id }), [props.id]);
  const [getAvatar, gettingAvatar] = useApiCall('getAvatar', avatarParams);
  const canvasRef = useRef(null);
  const [avatar, setAvatar] = useState(null);

  useEffect(
    () => {
      getAvatar().then((avatar) => setAvatar(avatar));
    },
    [getAvatar, setAvatar]
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
      <canvas className='avatar-canvas' ref={canvasRef}/>
    </div>
  )
}

export default PlayerAvatar;
