"use client";

import { GPUFluid } from "@/lib/GPUFluid";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ShaderMaterial, WebGLRenderer } from "three";
import { PointerState } from "@/lib/GPUFluid";

interface FluidSimulationProps {
  text?: string;
}

interface FluidSimulationWithVisibilityProps extends FluidSimulationProps {
  isVisible: boolean;
}

const pointerDefault: PointerState = { x: 0, y: 0, dx: 0, dy: 0 };

function FluidSimulationWithVisibility({ text = "JACOBIAN", isVisible }: FluidSimulationWithVisibilityProps) {
  const fluidRef = useRef<GPUFluid | null>(null);
  const pointerRef = useRef<PointerState>({ ...pointerDefault });
  const prevPointer = useRef({ x: 0, y: 0 });
  const impulseTimeRef = useRef(0);
  const isPointerDownRef = useRef(false);

  const { gl, size } = useThree();

  useEffect(() => {
    if (!fluidRef.current) {
      fluidRef.current = new GPUFluid(gl as WebGLRenderer, size.width, size.height, text);
    }

    const fluid = fluidRef.current;

    fluid.resize(size.width, size.height);

    return () => {
      fluidRef.current?.dispose();
      fluidRef.current = null;
    };
  }, [gl, size.width, size.height, text]);


  const onPointerDown = useCallback((event: PointerEvent) => {
    if (!fluidRef.current || !isVisible) return;
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = 1 - (event.clientY - rect.top) / rect.height;

    isPointerDownRef.current = true;
    pointerRef.current.x = x;
    pointerRef.current.y = y;
    prevPointer.current.x = x;
    prevPointer.current.y = y;
    pointerRef.current.dx = 0;
    pointerRef.current.dy = 0;
  }, []);

  const onPointerMove = useCallback((event: PointerEvent) => {
    if (!fluidRef.current || !isPointerDownRef.current || !isVisible) return;
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = 1 - (event.clientY - rect.top) / rect.height;

    pointerRef.current.x = x;
    pointerRef.current.y = y;
    pointerRef.current.dx = x - prevPointer.current.x;
    pointerRef.current.dy = y - prevPointer.current.y;
    prevPointer.current.x = x;
    prevPointer.current.y = y;
  }, [isVisible]);

  const onPointerUp = useCallback(() => {
    isPointerDownRef.current = false;
    pointerRef.current.dx = 0;
    pointerRef.current.dy = 0;
  }, []);

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerUp);
    };
  }, [gl, onPointerDown, onPointerMove, onPointerUp]);

  const material = useMemo(() => {
    const shader = new ShaderMaterial({
      uniforms: {
        uTexture: { value: null },
        uObstacle: { value: null },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D uTexture;
        uniform sampler2D uObstacle;
        void main() {
          vec4 color = texture2D(uTexture, vUv);
          float mask = texture2D(uObstacle, vUv).r;
          vec3 obstacleColor = vec3(0.85);
          // Force pure grey where obstacle mask is present
          vec3 outColor = mix(color.rgb, obstacleColor, step(0.5, mask));
          gl_FragColor = vec4(outColor, 1.0);
        }
      `,
    });
    shader.name = "FluidDisplayShader";
    return shader;
  }, []);

  useFrame((_, delta) => {
    if (!fluidRef.current || !isVisible) return;
    
    fluidRef.current.step(delta, pointerRef.current);
    material.uniforms.uTexture.value = fluidRef.current.dyeTexture;
    material.uniforms.uObstacle.value = (fluidRef.current as any).obstacleMaskTexture;
  });

  return (
    <mesh visible={isVisible}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

export function FluidCanvas({ text = "JACOBIAN" }: FluidSimulationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full">
      <Canvas 
        orthographic 
        camera={{ position: [0, 0, 1] }} 
        dpr={[1, 2]}
        gl={{ 
          antialias: false, 
          alpha: false,
          preserveDrawingBuffer: false,
          powerPreference: "high-performance"
        }}
      >
        <color attach="background" args={[0.0, 0.0, 0.0]} />
        <FluidSimulationWithVisibility text={text} isVisible={isVisible} />
      </Canvas>
    </div>
  );
}

export default FluidCanvas;


