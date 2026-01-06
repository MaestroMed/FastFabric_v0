import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// Check if user prefers reduced motion
function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Check if mobile device (for performance)
function isMobileDevice() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

// Digital Weaving Animation - FastFabric concept (LIGHTWEIGHT VERSION)
export function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    // Skip animation for reduced motion preference or mobile
    if (prefersReducedMotion() || isMobileDevice()) {
      setShouldAnimate(false);
      setIsVisible(true);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size - use lower resolution for better performance
    const dpr = Math.min(window.devicePixelRatio, 1.5); // Cap DPR for performance
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Animation parameters - REDUCED for performance
    const lines: Line[] = [];
    const numHorizontalLines = 6; // Reduced from 12
    const numVerticalLines = 8;   // Reduced from 16
    const waveSpeed = 0.015;      // Slower for smoother animation
    const waveAmplitude = 6;      // Slightly less movement
    let frame = 0;
    let animationId: number;
    let lastTime = 0;
    const targetFPS = 30; // Cap at 30 FPS for efficiency
    const frameInterval = 1000 / targetFPS;

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

    const colors = [
      'rgba(0, 113, 227, 0.4)',   // Blue (lighter)
      'rgba(88, 86, 214, 0.35)',  // Purple
      'rgba(99, 102, 241, 0.35)', // Indigo
    ];

    // Initialize weaving lines
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const gridSpacingX = width / (numVerticalLines + 1);
    const gridSpacingY = height / (numHorizontalLines + 1);

    // Horizontal lines (weft) - REDUCED
    for (let i = 1; i <= numHorizontalLines; i++) {
      lines.push({
        x1: -50,
        y1: i * gridSpacingY,
        x2: width + 50,
        y2: i * gridSpacingY,
        horizontal: true,
        offset: i * 0.3,
        speed: 0.6,
        color: colors[i % colors.length],
        progress: 0,
      });
    }

    // Vertical lines (warp) - REDUCED
    for (let i = 1; i <= numVerticalLines; i++) {
      lines.push({
        x1: i * gridSpacingX,
        y1: -50,
        x2: i * gridSpacingX,
        y2: height + 50,
        horizontal: false,
        offset: i * 0.4,
        speed: 0.4,
        color: colors[i % colors.length],
        progress: 0,
      });
    }

    // Animation function with FPS limiting
    const animate = (currentTime: number) => {
      const elapsed = currentTime - lastTime;
      
      if (elapsed < frameInterval) {
        animationId = requestAnimationFrame(animate);
        return;
      }
      
      lastTime = currentTime - (elapsed % frameInterval);
      
      ctx.clearRect(0, 0, width, height);
      frame++;

      // Draw weaving pattern - simplified, no particles
      lines.forEach((line) => {
        const time = frame * waveSpeed;
        
        // Animate progress for reveal effect
        if (line.progress < 1) {
          line.progress = Math.min(1, line.progress + 0.01 * line.speed);
        }

        ctx.beginPath();
        ctx.strokeStyle = line.color;
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';

        if (line.horizontal) {
          const endX = line.x1 + (line.x2 - line.x1) * line.progress;
          ctx.moveTo(line.x1, line.y1);
          // Use larger step for performance
          for (let x = line.x1; x <= endX; x += 10) {
            const waveOffset = Math.sin(time + line.offset + x * 0.015) * waveAmplitude;
            const y = line.y1 + waveOffset;
            ctx.lineTo(x, y);
          }
        } else {
          const endY = line.y1 + (line.y2 - line.y1) * line.progress;
          ctx.moveTo(line.x1, line.y1);
          for (let y = line.y1; y <= endY; y += 10) {
            const waveOffset = Math.sin(time + line.offset + y * 0.015) * waveAmplitude;
            const x = line.x1 + waveOffset;
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
      });

      // Simple intersection dots (no pulsing animation for performance)
      const allComplete = lines.every(l => l.progress >= 1);
      if (allComplete && frame % 2 === 0) { // Only draw every other frame
        const horizontalLines = lines.filter(l => l.horizontal);
        const verticalLines = lines.filter(l => !l.horizontal);
        
        horizontalLines.forEach((hLine) => {
          verticalLines.forEach((vLine) => {
            ctx.beginPath();
            ctx.arc(vLine.x1, hLine.y1, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 113, 227, 0.4)';
            ctx.fill();
          });
        });
      }

      animationId = requestAnimationFrame(animate);
    };

    // Start animation after a brief delay
    setTimeout(() => {
      setIsVisible(true);
      animationId = requestAnimationFrame(animate);
    }, 300);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Static fallback for mobile/reduced motion
  if (!shouldAnimate) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg)] z-10 pointer-events-none" />
        {/* Simple static gradient for mobile */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5" />
      </div>
    );
  }

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
      />

      {/* Simplified floating elements - only 3, CSS animations only */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        <div 
          className="absolute w-40 h-40 rounded-full animate-float-slow"
          style={{
            background: 'radial-gradient(circle, rgba(0, 113, 227, 0.08) 0%, transparent 70%)',
            left: '15%',
            top: '25%',
          }}
        />
        <div 
          className="absolute w-32 h-32 rounded-full animate-float-slow"
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
            right: '20%',
            top: '40%',
            animationDelay: '2s',
          }}
        />
        <div 
          className="absolute w-36 h-36 rounded-full animate-float-slow"
          style={{
            background: 'radial-gradient(circle, rgba(88, 86, 214, 0.08) 0%, transparent 70%)',
            left: '40%',
            bottom: '20%',
            animationDelay: '4s',
          }}
        />
      </div>
    </div>
  );
}

// Speed lines animation - LIGHTWEIGHT version with CSS animations
export function SpeedLines() {
  // Skip on mobile or reduced motion
  if (typeof window !== 'undefined' && (prefersReducedMotion() || isMobileDevice())) {
    return null;
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
      {/* Only 3 lines with CSS animations instead of Framer Motion */}
      <div 
        className="absolute h-[1px] w-[150px] bg-gradient-to-r from-transparent via-[var(--accent)]/50 to-transparent animate-speed-line"
        style={{ top: '30%', animationDelay: '0s' }}
      />
      <div 
        className="absolute h-[1px] w-[200px] bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent animate-speed-line"
        style={{ top: '50%', animationDelay: '1s' }}
      />
      <div 
        className="absolute h-[1px] w-[180px] bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent animate-speed-line"
        style={{ top: '70%', animationDelay: '2s' }}
      />
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



