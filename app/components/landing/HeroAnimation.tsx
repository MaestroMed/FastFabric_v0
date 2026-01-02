import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Digital Weaving Animation - FastFabric concept
export function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    // Animation parameters
    const lines: Line[] = [];
    const particles: Particle[] = [];
    const numHorizontalLines = 12;
    const numVerticalLines = 16;
    const waveSpeed = 0.02;
    const waveAmplitude = 8;
    let frame = 0;
    let animationId: number;

    interface Line {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      horizontal: boolean;
      offset: number;
      speed: number;
      color: string;
      progress: number;
    }

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      life: number;
      maxLife: number;
    }

    const colors = [
      'rgba(0, 113, 227, 0.6)',   // Blue
      'rgba(88, 86, 214, 0.5)',   // Purple
      'rgba(0, 113, 227, 0.4)',   // Light blue
      'rgba(99, 102, 241, 0.5)',  // Indigo
    ];

    // Initialize weaving lines
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const gridSpacingX = width / (numVerticalLines + 1);
    const gridSpacingY = height / (numHorizontalLines + 1);

    // Horizontal lines (weft)
    for (let i = 1; i <= numHorizontalLines; i++) {
      lines.push({
        x1: -50,
        y1: i * gridSpacingY,
        x2: width + 50,
        y2: i * gridSpacingY,
        horizontal: true,
        offset: i * 0.3,
        speed: 0.5 + Math.random() * 0.5,
        color: colors[i % colors.length],
        progress: 0,
      });
    }

    // Vertical lines (warp)
    for (let i = 1; i <= numVerticalLines; i++) {
      lines.push({
        x1: i * gridSpacingX,
        y1: -50,
        x2: i * gridSpacingX,
        y2: height + 50,
        horizontal: false,
        offset: i * 0.4,
        speed: 0.3 + Math.random() * 0.4,
        color: colors[i % colors.length],
        progress: 0,
      });
    }

    // Create intersection particles
    const createParticle = (x: number, y: number) => {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        maxLife: 60 + Math.random() * 60,
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      frame++;

      // Draw weaving pattern
      lines.forEach((line, index) => {
        const time = frame * waveSpeed;
        
        // Animate progress for reveal effect
        if (line.progress < 1) {
          line.progress = Math.min(1, line.progress + 0.008 * line.speed);
        }

        ctx.beginPath();
        ctx.strokeStyle = line.color;
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';

        if (line.horizontal) {
          // Draw wavy horizontal line
          const endX = line.x1 + (line.x2 - line.x1) * line.progress;
          ctx.moveTo(line.x1, line.y1);
          
          for (let x = line.x1; x <= endX; x += 5) {
            const waveOffset = Math.sin(time + line.offset + x * 0.02) * waveAmplitude;
            const y = line.y1 + waveOffset;
            ctx.lineTo(x, y);
          }
        } else {
          // Draw wavy vertical line
          const endY = line.y1 + (line.y2 - line.y1) * line.progress;
          ctx.moveTo(line.x1, line.y1);
          
          for (let y = line.y1; y <= endY; y += 5) {
            const waveOffset = Math.sin(time + line.offset + y * 0.02) * waveAmplitude;
            const x = line.x1 + waveOffset;
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();

        // Create particles at intersections
        if (line.progress > 0.5 && line.progress < 0.95 && Math.random() < 0.02) {
          const pos = line.horizontal 
            ? { x: line.x1 + (line.x2 - line.x1) * line.progress, y: line.y1 }
            : { x: line.x1, y: line.y1 + (line.y2 - line.y1) * line.progress };
          createParticle(pos.x, pos.y);
        }
      });

      // Draw and update particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        
        const alpha = 1 - (p.life / p.maxLife);
        if (alpha <= 0) {
          particles.splice(i, 1);
          return;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('0.', `${alpha * 0.6}.`);
        ctx.fill();
      });

      // Draw intersection nodes (fabric knots)
      const allComplete = lines.every(l => l.progress >= 1);
      if (allComplete) {
        lines.forEach((hLine) => {
          if (!hLine.horizontal) return;
          lines.forEach((vLine) => {
            if (vLine.horizontal) return;
            
            const x = vLine.x1;
            const y = hLine.y1;
            const pulse = Math.sin(frame * 0.05 + x * 0.01 + y * 0.01) * 0.5 + 0.5;
            
            ctx.beginPath();
            ctx.arc(x, y, 2 + pulse * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 113, 227, ${0.3 + pulse * 0.3})`;
            ctx.fill();
          });
        });
      }

      animationId = requestAnimationFrame(animate);
    };

    // Start animation after a brief delay
    setTimeout(() => {
      setIsVisible(true);
      animate();
    }, 300);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg)] z-10 pointer-events-none" />
      
      {/* Canvas for weaving animation */}
      <motion.canvas
        ref={canvasRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'blur(0.5px)' }}
      />

      {/* Floating fabric pieces */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(0, 113, 227, 0.1) 0%, transparent 70%)`,
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Speed lines animation for "2 heures" emphasis
export function SpeedLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
          style={{
            width: `${100 + Math.random() * 200}px`,
            top: `${20 + i * 10}%`,
            left: '-200px',
          }}
          animate={{
            x: ['0%', '200vw'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5 + Math.random(),
            repeat: Infinity,
            delay: i * 0.3,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

// Typing effect for dramatic reveal
export function TypeWriter({ text, className }: { text: string; className?: string }) {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
        setTimeout(() => setShowCursor(false), 500);
      }
    }, 80);

    return () => clearInterval(timer);
  }, [text]);

  return (
    <span className={className}>
      {displayText}
      {showCursor && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-[3px] h-[1em] bg-current ml-1"
        />
      )}
    </span>
  );
}



