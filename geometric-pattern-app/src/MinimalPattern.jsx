import React, { useRef, useEffect } from 'react';

function containerStyle(hue) {
  return {
    width: '100%',
    height: '100%',
    display: 'block',
    background: `hsl(${hue}, 20%, 10%)`,
  };
}

export default function MinimalPattern({ lineSpacing, rotationSpeed, hue }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    const ctx = canvas.getContext('2d');
    let angle = 0;
    let rafId;

    const render = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(angle);
      ctx.translate(-width / 2, -height / 2);
      ctx.strokeStyle = `hsl(${hue}, 80%, 60%)`;
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += lineSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      ctx.restore();
      angle += rotationSpeed;
      rafId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [lineSpacing, rotationSpeed, hue]);

  return <canvas ref={canvasRef} style={containerStyle(hue)} />;
}
