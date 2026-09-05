import { useEffect, useRef } from 'react';

interface PixelRainProps {
  color?: string;
  count?: number;
  speed?: number;
}

export function PixelRain({ color = '#a855f7', count = 300, speed = 1 }: PixelRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let drops: { x: number; y: number; speed: number; length: number; width: number; opacity: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    // Utility to parse hex color to rgb
    const hexToRgb = (hex: string) => {
      let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 168, g: 85, b: 247 }; // default magenta
    };

    const rgb = hexToRgb(color);

    const initDrops = () => {
      drops = [];
      for (let i = 0; i < count; i++) {
        drops.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          speed: (Math.random() * 2 + 1.5) * speed, // faster
          length: Math.random() * 100 + 40, // long trails
          width: Math.random() * 2 + 1, // varied width
          opacity: Math.random() * 0.8 + 0.2, // high contrast
        });
      }
    };

    initDrops();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drops.forEach((p) => {
        // Create falling trail effect with linear gradient
        const gradient = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.length);
        gradient.addColorStop(0, 'rgba(0,0,0,0)'); // Transparent at top
        gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${p.opacity})`); // Solid at bottom

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, p.y + p.length);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = p.width;
        ctx.lineCap = 'square';
        
        ctx.stroke();

        p.y += p.speed;
        if (p.y > canvas.height) {
          p.y = -p.length;
          p.x = Math.random() * canvas.width;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, count, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
