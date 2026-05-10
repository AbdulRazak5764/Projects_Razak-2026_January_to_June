import { useEffect, useRef } from 'react';

interface WaveAnimationProps {
  isActive: boolean;
}

export function WaveAnimation({ isActive }: WaveAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isActive) {
        const centerY = canvas.height / 2;
        const amplitude = 30;
        const frequency = 0.02;
        const speed = 0.1;

        ctx.beginPath();
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;

        for (let x = 0; x < canvas.width; x++) {
          const y = centerY + Math.sin(x * frequency + phase) * amplitude;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();

        for (let i = 1; i <= 2; i++) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(59, 130, 246, ${0.3 / i})`;
          ctx.lineWidth = 2;

          for (let x = 0; x < canvas.width; x++) {
            const y = centerY + Math.sin(x * frequency + phase + i) * (amplitude * (1 - i * 0.2));
            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }

          ctx.stroke();
        }

        phase += speed;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={100}
      className="w-full max-w-md h-24"
    />
  );
}
