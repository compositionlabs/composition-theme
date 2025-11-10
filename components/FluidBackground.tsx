'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface FluidBackgroundProps {
  children?: ReactNode;
  className?: string;
}

const FluidBackground = ({ children, className = '' }: FluidBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    glRef.current = gl;

    // Load shaders
    const loadShader = async (url: string, type: number) => {
      const response = await fetch(url);
      const source = await response.text();
      
      const shader = gl.createShader(type);
      if (!shader) return null;

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    };

    const initShaders = async () => {
      try {
        const vertexShader = await loadShader('/shaders/vertex.glsl', gl.VERTEX_SHADER);
        const fragmentShader = await loadShader('/shaders/fragment.glsl', gl.FRAGMENT_SHADER);

        if (!vertexShader || !fragmentShader) {
          console.error('Failed to load shaders');
          return;
        }

        const program = gl.createProgram();
        if (!program) return;

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          console.error('Program linking error:', gl.getProgramInfoLog(program));
          return;
        }

        programRef.current = program;
        gl.useProgram(program);

        // Create a simple quad to render the shader on
        const vertices = new Float32Array([
          -1.0, -1.0,
           1.0, -1.0,
          -1.0,  1.0,
           1.0,  1.0,
        ]);

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        // Get uniform locations
        const timeLocation = gl.getUniformLocation(program, 'u_time');
        const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

        // Animation loop
        const animate = (currentTime: number) => {
          const time = currentTime * 0.001; // Convert to seconds

          // Set viewport and clear
          gl.viewport(0, 0, canvas.width, canvas.height);
          gl.clearColor(0.0, 0.0, 0.0, 1.0);
          gl.clear(gl.COLOR_BUFFER_BIT);

          // Update uniforms
          gl.uniform1f(timeLocation, time);
          gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

          // Draw
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

          animationRef.current = requestAnimationFrame(animate);
        };

        // Start animation
        animationRef.current = requestAnimationFrame(animate);

      } catch (error) {
        console.error('Error initializing shaders:', error);
      }
    };

    initShaders();

    // Handle canvas resize
    const handleResize = () => {
      if (canvas && gl) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Shader canvas as background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full"
        width={800}
        height={600}
      />
      
      {/* Children content on top */}
      {children && (
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      )}
    </div>
  );
};

export default FluidBackground;
