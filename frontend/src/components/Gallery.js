import React, { useState, useRef, useEffect, useCallback } from 'react';
import api from '../api';
import {drawAvatar} from '../Game/utils'
import './Gallery.css'

const avatarHeight = 98
const avatarWidth = 172


const GalleryImage = props => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    drawAvatar(props.image, ctx)
  }, [canvasRef, props.image])

  return (
    <div className='avatar-container'>
    <div style={{position: 'absolute'}}>{props.index}</div>
      <canvas id={props.id} className='avatar-canvas-gallery' width='348' height='198' ref={canvasRef}/>
    </div>
  )
}

const Loader = () => (
  <div className={'loader-wrapper'} style={{display: 'flex', alignItems: 'center', flexDirection:'column'}}>
    <div id={'loader'}/>
    <h1>Loading..</h1>
    <h3>There are LOTS of avatars. Give it 10 - 20 Seconds. It's worth it ;) </h3>
  </div>
);

export default () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(Infinity);
  const [imagesPerPage, setImagesPerPage] = useState(500);
  const [scrollHeight, setScrollHeight] = useState(1);
  const [indicies, setIndicies] = useState([0,800])

  const getIndicies = () => {
    const topOffset = window.pageYOffset;
    const columns = Math.floor(window.innerWidth / avatarWidth);
    const rows = Math.floor(window.innerHeight / avatarHeight);
    const startRow = Math.floor(topOffset / avatarHeight);
    const start = Math.floor(startRow * columns);
    const end = Math.ceil((startRow + rows + 10) * (columns));
    return [start, end]
  }

  const handleScroll = useCallback((e) => {
    setIndicies(getIndicies());
  },[setIndicies]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {window.removeEventListener('scroll', handleScroll)};
  },[handleScroll])

  useEffect (() => {
    const fetchImages = async () => {
      const images = await api('getAllImages')
      setImages(images.reverse());
    }
    fetchImages();
  },[setImages])

  useEffect(() => {
    console.log(images.length)
    if (images.length > 0){
      setLoading(false);
      setMaxPage(Math.ceil(images.length / imagesPerPage));
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
        {images.slice(0, indicies[1]).map((image, i) => (
          <GalleryImage index={images.length - i} id={image.player_id} key={image.player_id} image={image.image}></GalleryImage>
        ))}
      </div>
    </div>
  )
  }

  
}

