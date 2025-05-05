import React, { useEffect, useRef } from 'react';

interface ConfettiEffectProps {
  active: boolean;
}

const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confettiPieces = useRef<any[]>([]);
  const animationRef = useRef<number>();

  const colors = [
    '#8A6FDF', // dream-purple
    '#F6A3FF', // dream-pink
    '#68D8D6', // dream-teal
    '#64B6FF', // dream-blue
    '#FFDE59', // gold
  ];

  useEffect(() => {
    if (!active) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    
    // Create confetti pieces
    const createConfetti = () => {
      confettiPieces.current = [];
      
      for (let i = 0; i < 150; i++) {
        confettiPieces.current.push({
          x: Math.random() * canvas.width,
          y: -20 - Math.random() * 100,
          size: Math.random() * 8 + 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          speedX: Math.random() * 6 - 3,
          speedY: Math.random() * 3 + 2,
          rotation: Math.random() * 360,
          rotationSpeed: Math.random() * 10 - 5
        });
      }
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let stillActive = false;
      
      confettiPieces.current.forEach(piece => {
        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate((piece.rotation * Math.PI) / 180);
        
        // Draw a confetti piece
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
        
        ctx.restore();
        
        // Update position
        piece.x += piece.speedX;
        piece.y += piece.speedY;
        piece.rotation += piece.rotationSpeed;
        piece.speedY += 0.05; // gravity
        
        // Check if confetti is still on screen
        if (piece.y < canvas.height + 100) {
          stillActive = true;
        }
      });
      
      if (stillActive) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // All confetti has fallen off screen
        if (canvasRef.current) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
    };
    
    createConfetti();
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-50"
    />
  );
};

export default ConfettiEffect;
