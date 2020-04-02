
import C2S from './canvasSvg.js'
import React, { useState, useEffect, useCallback, useRef } from 'react';

const DrawBox = props => {
  const canvasRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [fakeCtx, setFakeCtx] = useState(null);
  const [rect, setRect] = useState(null);

  const handleMouseMove = useCallback(e => {
    if (isMouseDown) {
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      fakeCtx.lineTo(e.offsetX, e.offsetY);
      fakeCtx.stroke();
    }
  },[ctx, isMouseDown, rect])

  const handleMouseDown = useCallback(e => {
    setIsMouseDown(true);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#ff8000';
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
    fakeCtx.strokeStyle = '#40663d';

    fakeCtx.lineJoin = 'round';
    fakeCtx.lineCap = 'round';
    fakeCtx.beginPath();
    fakeCtx.moveTo(e.offsetX, e.offsetY);
    ctx.lineWidth = 15;
    fakeCtx.lineWidth = 15;

  },[setIsMouseDown, ctx, rect])

   const handleMouseUp = useCallback(e => {
    setIsMouseDown(false);
    try {
    const re = new RegExp('(?<=\<g>)(.*?)(?=\<\/g>)');
    const serializedSvg = fakeCtx.getSerializedSvg(true)
    const results = re.exec(serializedSvg)[0];
    props.setSvg(results)
    } catch (e) {
      console.log(e)
    }
  },[setIsMouseDown,fakeCtx])

  useEffect(() => {
    setRect(canvasRef.current.getBoundingClientRect());
  },[setRect])

  useEffect(() => {
    setFakeCtx(new C2S(348,198));
  },[])

  useEffect(() => {
    const ref = canvasRef.current;
    setCtx(ref.getContext('2d'));
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
  },[handleMouseDown, handleMouseUp, handleMouseMove, setCtx])


  return (
    <div className="canvas-wrapper">
      <canvas ref={canvasRef} width="348px" height="198px" className="avatar-canvas"/>
    </div>
  )
}

export default DrawBox;