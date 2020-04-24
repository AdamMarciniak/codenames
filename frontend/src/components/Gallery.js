import React, { useState, useRef, useEffect } from 'react';
import api from '../api';
import {drawAvatar} from '../Game/utils'
import './Gallery.css'


const GalleryImage = props => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    drawAvatar(props.image, ctx)
  }, [canvasRef, props.image])

  return (
    <div className='avatar-container'>
      <canvas id={props.id} className='avatar-canvas-gallery' width='348' height='198' ref={canvasRef}/>
    </div>
  )
}

const Loader = () => (
  <div className={'loader-wrapper'} style={{display: 'flex', alignItems: 'center', flexDirection:'column'}}>
    <div id={'loader'}/>
    <h1>Loading..</h1>
    <h3>There are LOTS of drawings</h3>
  </div>
);

export default () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect (() => {
    const fetchImages = async () => {
      const images = await api('getAllImages')
      setImages(images);
    }
    fetchImages();
  },[setImages])

  useEffect(() => {
    console.log(images.length)
    if (images.length > 0){
      setLoading(false);
    }
  },[images])

  if (loading) {
    return (
      <Loader />
    )
  } else {
    return (
    <div className="gallery">
      <div className="galleryContainer">
        {images.map(image => (
          <GalleryImage id={image.player_id} key={image.player_id} image={image.image}></GalleryImage>
        ))}
      </div>
    </div>
  )
  }

  
}

