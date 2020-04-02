
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
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
      fakeCtx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      fakeCtx.stroke();
      console.log(e.clientY);
    }
  },[ctx, isMouseDown, rect])

  useEffect(() => {

console.log(fakeCtx);
  },[fakeCtx])

  const handleMouseDown = useCallback(e => {
    setIsMouseDown(true);
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    fakeCtx.beginPath();
    fakeCtx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.lineWidth = 10;
    fakeCtx.lineWidth = 10;

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