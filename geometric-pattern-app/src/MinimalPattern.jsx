import React, { useRef, useEffect } from 'react';

const MinimalPattern = ({ lineSpacing, rotationSpeed, hue }) => {
  const canvasRef = useRef(null);
  const rotation = useRef(0);

  // Resize canvas to fill the container
  useEffect(() => {
    const canvas = canvasRef.current;
    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Draw pattern with animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;

    const render = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(rotation.current);
      ctx.strokeStyle = `hsl(${hue}, 80%, 60%)`;
      ctx.lineWidth = 1;

      const maxRadius = Math.min(width, height) / 2;
      const step = Math.max(lineSpacing, 2);
      for (let r = step; r < maxRadius; r += step) {
        ctx.beginPath();
        ctx.moveTo(-r, 0);
        ctx.lineTo(r, 0);
        ctx.stroke();
        ctx.rotate(Math.PI / 16);
      }
      ctx.restore();

      rotation.current += rotationSpeed;
      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [lineSpacing, rotationSpeed, hue]);

  return <canvas ref={canvasRef} className="minimal-pattern-canvas" />;
};

export default MinimalPattern;
