
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {ctxHandler} from './utils'

const DrawBox = props => {
  const canvasRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    setCtx(ctxHandler(canvasRef.current));
  },[setCtx,canvasRef])

  const handleMouseDown = useCallback(e => {
    setIsMouseDown(true);
    ctx.moveTo(e.offsetX, e.offsetY);
  },[setIsMouseDown, ctx])

  const handleMouseMove = useCallback(e => {
    if (isMouseDown) {
      ctx.lineTo(e.offsetX, e.offsetY);
    }
  },[isMouseDown, ctx])

  const handleMouseUp = useCallback(e => {
    setIsMouseDown(false);
    try {
      props.setAvatar(ctx.getCoords())
    } catch (e) {
      console.log(e)
    }
  },[setIsMouseDown, ctx])

  useEffect(() => {
    const ref = canvasRef.current;
    ref.addEventListener('pointerdown', handleMouseDown)
    ref.addEventListener('pointerup', handleMouseUp)
    ref.addEventListener('pointermove', handleMouseMove)

    return (
      () => {
        ref.removeEventListener('pointerdown', handleMouseDown)
        ref.removeEventListener('pointerup', handleMouseUp)
        ref.removeEventListener('pointermove', handleMouseMove)
      }
    )
  },[handleMouseDown, handleMouseUp, handleMouseMove, canvasRef])

  // canvas touch-action='none' is in here for safari/iphone support Doesn't seem to work though....
  return (
    <div className="canvas-wrapper">
      <canvas touch-action='none' ref={canvasRef} width="348px" height="198px" className="avatar-canvas"/>
    </div>
  )
}

export default DrawBox;
