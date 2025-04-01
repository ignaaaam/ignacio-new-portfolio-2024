"use client";
import React, { useRef, useEffect } from "react";
import { cn } from "../lib/utils";

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  refresh?: boolean;
  particleColors?: string[];
  particleCount?: number;
  particleSpread?: number;
  speed?: number;
  particleBaseSize?: number;
  moveParticlesOnHover?: boolean;
  alphaParticles?: boolean;
  disableRotation?: boolean;
}

export default function Particles({
  className = "",
  quantity = 40,
  staticity = 30,
  ease = 60,
  refresh = false,
  particleColors = ["rgba(129, 140, 248, 0.9)"],
  particleCount,
  particleSpread = 30,
  speed = 0.5,
  particleBaseSize = 1,
  moveParticlesOnHover = true,
  alphaParticles = true,
  disableRotation = false,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<any[]>([]);
  const mousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

  const effectiveParticleCount = particleCount || quantity;

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    animate();
    window.addEventListener("resize", initCanvas);

    // Add these event listeners for mobile
    if (moveParticlesOnHover) {
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchstart", handleTouchMove);
    }

    return () => {
      window.removeEventListener("resize", initCanvas);
      if (moveParticlesOnHover) {
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchstart", handleTouchMove);
      }
    };
  }, [moveParticlesOnHover]);

  useEffect(() => {
    initCanvas();
  }, [refresh]);

  const initCanvas = () => {
    resizeCanvas();
    drawParticles();
  };

  const resizeCanvas = () => {
    if (canvasContainerRef.current && canvasRef.current && context.current) {
      circles.current = [];
      canvasSize.current.w = canvasContainerRef.current.offsetWidth;
      canvasSize.current.h = canvasContainerRef.current.offsetHeight;
      canvasRef.current.width = canvasSize.current.w * dpr;
      canvasRef.current.height = canvasSize.current.h * dpr;
      canvasRef.current.style.width = `${canvasSize.current.w}px`;
      canvasRef.current.style.height = `${canvasSize.current.h}px`;
      context.current.scale(dpr, dpr);
    }
  };

  const circleParams = () => {
    const x = Math.floor(Math.random() * canvasSize.current.w);
    const y = Math.floor(Math.random() * canvasSize.current.h);
    const baseSize = particleBaseSize || 1;
    const size = Math.floor(Math.random() * 2) + baseSize;
    
    let colors = particleColors;
    if (!colors || colors.length === 0) {
      colors = [
        "rgba(129, 140, 248, 0.9)",   // indigo-400
        "rgba(99, 102, 241, 0.9)",    // indigo-500
        "rgba(79, 70, 229, 0.9)",     // indigo-600
        "rgba(139, 92, 246, 0.9)",    // purple-500
        "rgba(168, 85, 247, 0.9)",    // purple-500 (brighter)
        "rgba(59, 130, 246, 0.9)",    // blue-500
      ];
    }
    
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    const opacity = alphaParticles ? Math.random() * 0.8 + 0.1 : 1;
    
    let finalColor = color;
    if (alphaParticles && color.startsWith('#')) {
      const r = parseInt(color.substr(1, 2), 16);
      const g = parseInt(color.substr(3, 2), 16);
      const b = parseInt(color.substr(5, 2), 16);
      finalColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    } else if (alphaParticles && color.startsWith('rgb')) {
      finalColor = color.replace(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/, `rgba($1, $2, $3, ${opacity})`);
    }

    return {
      x,
      y,
      size,
      color: finalColor,
      baseY: y,
      baseX: x,
      rotation: disableRotation ? 0 : Math.random() * 360,
      speed: speed * (0.5 + Math.random())
    };
  };

  const drawParticles = () => {
    circles.current = [];
    if (context.current) {
      for (let i = 0; i < effectiveParticleCount; i++) {
        const circle = circleParams();
        circles.current.push(circle);
      }
    }
  };

  const animate = () => {
    if (context.current) {
      context.current.clearRect(
        0,
        0,
        canvasSize.current.w,
        canvasSize.current.h
      );
      
      circles.current.forEach((circle: any, i: number) => {
        if (moveParticlesOnHover) {
          circle.x +=
            (mouse.current.x - circle.x) / (staticity + (circle.size * particleSpread));
          circle.y +=
            (mouse.current.y - circle.y) / (staticity + (circle.size * particleSpread));
        }
        
        // Simplified movement calculations to improve performance
        const time = Date.now() * 0.001 * circle.speed;
        circle.x += Math.sin(time) * 0.2;
        circle.y += Math.cos(time) * 0.2;
        
        context.current!.save();
        
        if (!disableRotation) {
          context.current!.translate(circle.x, circle.y);
          context.current!.rotate((circle.rotation + time) % 360 * Math.PI / 180);
          context.current!.translate(-circle.x, -circle.y);
        }
        
        context.current!.beginPath();
        context.current!.arc(circle.x, circle.y, circle.size, 0, 2 * Math.PI);
        context.current!.fillStyle = circle.color;
        context.current!.fill();
        
        if (!circle.color.includes('255, 255, 255')) {
          context.current!.beginPath();
          context.current!.arc(circle.x, circle.y, circle.size * 3, 0, 2 * Math.PI);
          const gradient = context.current!.createRadialGradient(
            circle.x, circle.y, circle.size * 0.5,
            circle.x, circle.y, circle.size * 3
          );
          gradient.addColorStop(0, circle.color);
          gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
          context.current!.fillStyle = gradient;
          context.current!.fill();
        }
        
        context.current!.restore();
        
        if (moveParticlesOnHover && 
          (Math.abs(circle.x - circle.baseX) > 50 ||
          Math.abs(circle.y - circle.baseY) > 50)
        ) {
          circle.x += (circle.baseX - circle.x) / ease;
          circle.y += (circle.baseY - circle.y) / ease;
        }
      });
    }
    
    // Using this method for more reliable animation frames
    const animationId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animationId);
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (canvasContainerRef.current && moveParticlesOnHover) {
      const rect = canvasContainerRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      mouse.current = {
        x: x,
        y: y,
      };
    }
  };

  // Add touch event handler
  const handleTouchMove = (event: TouchEvent) => {
    if (canvasContainerRef.current && moveParticlesOnHover && event.touches.length > 0) {
      const rect = canvasContainerRef.current.getBoundingClientRect();
      const touch = event.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      mouse.current = {
        x: x,
        y: y,
      };
    }
  };

  return (
    <div
      ref={canvasContainerRef}
      onMouseMove={handleMouseMove}
      className={cn("fixed top-[10vh] bottom-0 left-0 right-0 z-[-1]", className)}
    >
      {/* Remove solid background to let gradient show through */}
      
      {/* Hero section accent gradients - enhanced but subtle */}
      <div className="absolute top-[10vh] right-0 w-[60vw] h-[70vh] bg-gradient-to-bl from-indigo-900/20 via-purple-800/15 to-transparent rounded-full blur-[120px] z-[-1]"></div>
      <div className="absolute top-[20vh] left-0 w-[50vw] h-[50vh] bg-gradient-to-r from-blue-900/15 via-indigo-800/15 to-transparent rounded-full blur-[100px] z-[-1]"></div>
      
      {/* Services section accent - subtle enhancement */}
      <div className="absolute top-[90vh] left-1/2 -translate-x-1/2 w-[80vw] h-[80vh] bg-gradient-to-t from-indigo-900/15 via-purple-900/10 to-transparent rounded-full blur-[120px] z-[-1]"></div>
      
      <canvas ref={canvasRef} className="z-0" />
    </div>
  );
} 