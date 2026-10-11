import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  type: 'feather' | 'petal' | 'gold';
}

export const ConfettiCanvas: React.FC<{ active?: boolean }> = ({ active = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = ['#F59E0B', '#DC2626', '#FDE68A', '#FEF08A', '#F8FAFC', '#F43F5E'];
    const particles: Particle[] = [];

    // Create 70 soft celebratory particles
    for (let i = 0; i < 75; i++) {
      particles.push({
        x: Math.random() * width,
        y: -20 - Math.random() * height * 0.5,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 2.5,
        speedY: Math.random() * 2.2 + 1.2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 3,
        opacity: Math.random() * 0.8 + 0.2,
        type: i % 3 === 0 ? 'feather' : i % 3 === 1 ? 'petal' : 'gold',
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX + Math.sin(p.y * 0.01) * 0.8;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.type === 'petal') {
          // Soft petal shape
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'feather') {
          // Soft curved feather
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.quadraticCurveTo(p.size * 0.4, 0, 0, p.size);
          ctx.quadraticCurveTo(-p.size * 0.4, 0, 0, -p.size);
          ctx.fill();
        } else {
          // Gold sparkle square
          ctx.fillRect(-p.size * 0.4, -p.size * 0.4, p.size * 0.8, p.size * 0.8);
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
};
