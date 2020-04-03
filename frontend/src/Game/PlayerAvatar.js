import React, {useRef, useEffect, useState} from 'react'
import {drawAvatar, animateAvatar} from './utils';
import { useApiCall } from '../api';

const PlayerAvatar = props => {
  const getAvatar = useApiCall('getAvatar', { id: props.id });
  const canvasRef = useRef(null);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    getAvatar().then(avatar => {console.log(avatar); setAvatar(avatar)})
  },[])

   useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');

    if (avatar) {
      animateAvatar(avatar, ctx)
    }
  },[canvasRef, avatar])

  return (
    <div className='avatar-container'>
      <canvas className='avatar-canvas' ref={canvasRef}/>
    </div>
  )
}

export default PlayerAvatar;