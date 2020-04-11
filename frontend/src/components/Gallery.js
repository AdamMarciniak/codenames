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
      <canvas className='avatar-canvas-gallery' width='348' height='198' ref={canvasRef}/>
    </div>
  )
}


export default () => {
  const [images, setImages] = useState([]);
  
  useEffect (() => {
    const fetchImages = async () => {
      const images = await api('getAllImages')
      setImages(images);
    }
    fetchImages();
  },[setImages])

  useEffect(() => {
    console.log(images)
  },[images])
  
  return (
    <div className="gallery">
      <div className="galleryContainer">
        {images.map(image => (
          <GalleryImage key={image.player_id} image={image.image}></GalleryImage>
        ))}
      </div>
    </div>
  )
}