import React, { useState, useRef, useEffect } from 'react';
import api from '../api';
import {drawAvatar} from '../Game/utils'


const GalleryImage = props => {
  const canvasRef = useRef(null);


  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    drawAvatar(props.image, ctx)
  }, [canvasRef])

  return (
    <div className='avatar-container'>
      <canvas className='avatar-canvas' width='348' height='198' ref={canvasRef}/>
    </div>
  )
}


export default () => {
  const [images, setImages] = useState([]);
  
  useEffect (async () => {
   const images = await api('getAllImages')
   setImages(images.map((item) => item.image));
  },[setImages])
  
  return (
    <div className="galleryContainer">
    {images.map(image => (
      <GalleryImage image={image}></GalleryImage>
    ))}
    </div>
  )
}