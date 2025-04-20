'use client';

import { useEffect, useRef, useState, ChangeEvent, useCallback, MutableRefObject } from 'react';
import * as THREE from 'three';
import { ArcballControls } from 'three/addons/controls/ArcballControls.js';
import { gsap } from 'gsap';
import { Button } from './ui/button';

const NUM_SIM_RUNTIME = 30;
const AI_RUNTIME: { [key: number]: number } = {
  0: 38.4,
  1: 42.9,
  2: 37.5,
  3: 38.9,
  4: 42.6,
  5: 41.1,
  6: 35.7,
  7: 36.5,
  8: 38.8,
  9: 37.4,
  10: 36.2,
  11: 39.5,
  12: 47.0,
  13: 42.0,
  14: 43.4,
  15: 41.1,
  16: 36.6,
  17: 35.2,
  18: 37.6,
  19: 42.8
}

interface CloudInfo {
  filename: string;
  numPoints: number;
  stats: {
    positionMin: number[];
    positionMax: number[];
    pressureMin: number;
    pressureMax: number;
  };
  format: {
    positions: {
      type: string;
      components: number;
      offset: number;
    };
    groundTruth: {
      type: string;
      components: number;
      offset: number;
    };
    prediction: {
      type: string;
      components: number;
      offset: number;
    };
  };
}

// Enhanced jet colormap with better contrast
const jetColormap = (value: number): [number, number, number] => {
  // Ensure value is in range [0,1]
  const v = Math.max(0, Math.min(1, value));
  
  let r, g, b;
  
  if (v < 0.125) {
    r = 0;
    g = 0;
    b = 0.5 + 4 * v;
  } else if (v < 0.375) {
    r = 0;
    g = 4 * (v - 0.125);
    b = 1;
  } else if (v < 0.625) {
    r = 4 * (v - 0.375);
    g = 1;
    b = 1 - 4 * (v - 0.375);
  } else if (v < 0.875) {
    r = 1;
    g = 1 - 4 * (v - 0.625);
    b = 0;
  } else {
    r = 1 - 4 * (v - 0.875);
    g = 0;
    b = 0;
  }
  
  // Enhance contrast and saturation
  r = Math.pow(r, 0.8);
  g = Math.pow(g, 0.8);
  b = Math.pow(b, 0.8);
  
  return [r, g, b];
};

// Add a new function to verify centering
const calculateCentroid = (positions: Float32Array, numPoints: number): THREE.Vector3 => {
  const centroid = new THREE.Vector3(0, 0, 0);
  
  for (let i = 0; i < numPoints; i++) {
    centroid.x += positions[i * 3];
    centroid.y += positions[i * 3 + 1];
    centroid.z += positions[i * 3 + 2];
  }
  
  centroid.divideScalar(numPoints);
  return centroid;
};

// Colormap for error: Green (0) -> Yellow (0.5) -> Red (1)
const errorColormap = (value: number): [number, number, number] => {
  // Ensure value is in range [0,1]
  const v = Math.max(0, Math.min(1, value));

  let r, g, b;

  if (v < 0.5) {
    // Transition from green to yellow
    r = 2 * v;
    g = 1;
    b = 0;
  } else {
    // Transition from yellow to red
    r = 1;
    g = 1 - 2 * (v - 0.5);
    b = 0;
  }

  return [r, g, b];
};

// Enhanced ColorScale component with more prominence
const ColorScale = ({ 
  min, 
  max, 
  label, 
  colormap = jetColormap 
}: { 
  min: number; 
  max: number; 
  label: string; 
  colormap?: (value: number) => [number, number, number] 
}) => {
  const numStops = 20; // Number of stops for gradient precision
  const gradientStops = [];
  
  for (let i = 0; i <= numStops; i++) {
    const value = i / numStops;
    const [r, g, b] = colormap(value);
    const color = `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
    gradientStops.push(`${color} ${(value * 100).toFixed(1)}%`);
  }
  
  const gradientStyle = {
    background: `linear-gradient(to right, ${gradientStops.join(', ')})`
  };
  
  return (
    <div className="flex flex-col w-full h-20 mt-1"> {/* Increased parent height */}
      <div className="text-sm font-semibold text-center text-white mb-2 font-mono">{label}</div>
      <div 
        className="h-8 w-full rounded-md overflow-hidden border border-white border-opacity-30 shadow-lg" /* Increased scale height */
        style={gradientStyle} 
      />
      <div className="flex justify-between text-xs text-white mt-2 px-1">
        <span className="font-mono">{min.toFixed(3)}</span>
        <span className="font-mono">{max.toFixed(3)}</span>
      </div>
    </div>
  );
};

const SideBySidePointCloudViewer = () => {
  // Create separate refs for ground truth and prediction views
  const groundTruthContainerRef = useRef<HTMLDivElement | null>(null);
  const predictionContainerRef = useRef<HTMLDivElement | null>(null);
  const errorContainerRef = useRef<HTMLDivElement | null>(null);
  
  // Explicitly type refs that will be assigned later
  const groundTruthRendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const predictionRendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const errorRendererRef = useRef<THREE.WebGLRenderer | null>(null);

  const groundTruthSceneRef = useRef<THREE.Scene | null>(null);
  const predictionSceneRef = useRef<THREE.Scene | null>(null);
  const errorSceneRef = useRef<THREE.Scene | null>(null);

  const groundTruthCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const predictionCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const errorCameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Controls refs for all three views
  const groundTruthControlsRef = useRef<ArcballControls | null>(null);
  const predictionControlsRef = useRef<ArcballControls | null>(null);
  const errorControlsRef = useRef<ArcballControls | null>(null);
  
  // Track which controls are currently active
  const activeControlsRef = useRef<string | null>(null);

  const groundTruthPointCloudRef = useRef<THREE.Points | null>(null);
  const predictionPointCloudRef = useRef<THREE.Points | null>(null);
  const errorPointCloudRef = useRef<THREE.Points | null>(null);
  
  const [metadata, setMetadata] = useState<CloudInfo[] | null>(null);
  const [currentPointCloudIndex, setCurrentPointCloudIndex] = useState(0);
  
  // Add state for tracking loading status
  const [pressureRange, setPressureRange] = useState<{ min: number; max: number }>({ min: 0, max: 1 });
  const [errorRange, setErrorRange] = useState<{ min: number; max: number }>({ min: 0, max: 1 });
  // Add state for camera position string
  const [cameraPositionString, setCameraPositionString] = useState('');
  // Add state to track whether intro animation has played
  const [hasPlayedIntroAnimation, setHasPlayedIntroAnimation] = useState(false);

  // Function to update camera position state - made reusable
  const updateCameraPosDisplay = useCallback(() => {
    let activeCam = null;
    
    // Determine which camera to display position for
    if (activeControlsRef.current === 'prediction' && predictionCameraRef.current) {
      activeCam = predictionCameraRef.current;
    } else if (activeControlsRef.current === 'error' && errorCameraRef.current) {
      activeCam = errorCameraRef.current;
    } else if (groundTruthCameraRef.current) {
      // Default to ground truth
      activeCam = groundTruthCameraRef.current;
    }
    
    if (activeCam) {
      const pos = activeCam.position;
      setCameraPositionString(`(${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)})`);
    }
  }, []); // Empty dependency array as it only uses refs

  // Setup shared background material
  const setupBackgroundMaterial = () => {
    const bgColor1 = new THREE.Color(0x101018);
    const bgColor2 = new THREE.Color(0x080830);
    
    return new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 colorA;
        uniform vec3 colorB;
        void main() {
          gl_FragColor = vec4(mix(colorA, colorB, vUv.y), 1.0);
        }
      `,
      uniforms: {
        colorA: { value: bgColor1 },
        colorB: { value: bgColor2 }
      },
      depthWrite: false
    });
  };
  
  // Initialize both Three.js scenes
  useEffect(() => {
    if (!groundTruthContainerRef.current || !predictionContainerRef.current || !errorContainerRef.current) return;
    
    // Create scenes
    const groundTruthScene = new THREE.Scene();
    const predictionScene = new THREE.Scene();
    const errorScene = new THREE.Scene();
    
    groundTruthSceneRef.current = groundTruthScene;
    predictionSceneRef.current = predictionScene;
    errorSceneRef.current = errorScene;
    
    // Create gradient backgrounds
    const backgroundMaterial = setupBackgroundMaterial();
    
    const setupView = (
      containerRef: React.RefObject<HTMLDivElement>,
      sceneRef: React.RefObject<THREE.Scene>,
      cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>,
      rendererRef: React.MutableRefObject<THREE.WebGLRenderer | null>,
      controlsRef: MutableRefObject<ArcballControls | null>,
      viewIndex: number
    ) => {
      if (!containerRef.current || !sceneRef.current) return { backgroundScene: null, backgroundCamera: null };
      
      // Add lighting
      const ambientLight = new THREE.AmbientLight(0x404040, 2);
      sceneRef.current.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
      directionalLight.position.set(1, 2, 3);
      sceneRef.current.add(directionalLight);
      
      // Create camera
      const camera = new THREE.PerspectiveCamera(
        60,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.set(5, 5, 5);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;
      
      // Create renderer
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      containerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;
      
      // Create controls for all views
      const controls = new ArcballControls(camera, renderer.domElement, sceneRef.current);
      controls.setGizmosVisible(false); // Hide the gizmos by default
      controls.enableZoom = true;
      controls.enablePan = true;
      controls.enableRotate = true;
      controls.enableAnimations = false; // Disable animations to prevent floating after interaction
      controlsRef.current = controls;
      
      // Event handlers for tracking which controls are active
      const viewName = viewIndex === 0 ? 'groundTruth' : viewIndex === 1 ? 'prediction' : 'error';
      
      // Add a mouseover handler to pre-emptively set the active view
      renderer.domElement.addEventListener('mouseover', () => {
        // Update active controls when the mouse enters a view
        activeControlsRef.current = viewName;
      });
      
      // Also add touch events for mobile
      renderer.domElement.addEventListener('touchstart', () => {
        activeControlsRef.current = viewName;
      }, { passive: true });
      
      // Handle control start - mark these controls as active
      controls.addEventListener('start', () => {
        activeControlsRef.current = viewName;
      });
      
      // Handle control change - update position display for any control
      controls.addEventListener('change', () => {
        updateCameraPosDisplay();
      });
      
      // Handle control end
      controls.addEventListener('end', () => {
        updateCameraPosDisplay();
      });
      
      // Setup background scene
      const backgroundScene = new THREE.Scene();
      const backgroundCamera = new THREE.Camera();
      const backgroundMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        backgroundMaterial
      );
      backgroundScene.add(backgroundMesh);
      
      return { backgroundScene, backgroundCamera };
    };
    
    // Setup all three views with independent controls
    const groundTruthBg = setupView(groundTruthContainerRef, groundTruthSceneRef, groundTruthCameraRef, groundTruthRendererRef, groundTruthControlsRef, 0);
    const predictionBg = setupView(predictionContainerRef, predictionSceneRef, predictionCameraRef, predictionRendererRef, predictionControlsRef, 1);
    const errorBg = setupView(errorContainerRef, errorSceneRef, errorCameraRef, errorRendererRef, errorControlsRef, 2);
    
    if (!groundTruthBg.backgroundScene || !predictionBg.backgroundScene || !errorBg.backgroundScene) {
      return;
    }

    // Animation loop - with conditional camera sync
    const animate = () => {
      requestAnimationFrame(animate);

      // 1. Update all controls
      if (groundTruthControlsRef.current) {
        groundTruthControlsRef.current.update();
      }
      if (predictionControlsRef.current) {
        predictionControlsRef.current.update();
      }
      if (errorControlsRef.current) {
        errorControlsRef.current.update();
      }

      // 2. Sync cameras based on which view is actively being controlled
      if (groundTruthCameraRef.current && predictionCameraRef.current && errorCameraRef.current) {
        let sourceCam;
        
        // Determine which camera is the source based on active controls
        if (activeControlsRef.current === 'prediction') {
          sourceCam = predictionCameraRef.current;
        } else if (activeControlsRef.current === 'error') {
          sourceCam = errorCameraRef.current;
        } else {
          // Default to ground truth if no specific control is active
          sourceCam = groundTruthCameraRef.current;
        }
        
        // Ensure we're copying properties not references to avoid reference issues
        if (sourceCam === groundTruthCameraRef.current) {
          // Copy position and quaternion with clone to ensure clean copying
          predictionCameraRef.current.position.copy(sourceCam.position.clone());
          predictionCameraRef.current.quaternion.copy(sourceCam.quaternion.clone());
          
          errorCameraRef.current.position.copy(sourceCam.position.clone());
          errorCameraRef.current.quaternion.copy(sourceCam.quaternion.clone());
        } else if (sourceCam === predictionCameraRef.current) {
          groundTruthCameraRef.current.position.copy(sourceCam.position.clone());
          groundTruthCameraRef.current.quaternion.copy(sourceCam.quaternion.clone());
          
          errorCameraRef.current.position.copy(sourceCam.position.clone());
          errorCameraRef.current.quaternion.copy(sourceCam.quaternion.clone());
        } else {
          groundTruthCameraRef.current.position.copy(sourceCam.position.clone());
          groundTruthCameraRef.current.quaternion.copy(sourceCam.quaternion.clone());
          
          predictionCameraRef.current.position.copy(sourceCam.position.clone());
          predictionCameraRef.current.quaternion.copy(sourceCam.quaternion.clone());
        }
        
        // Also copy the up vector to ensure consistent orientation
        if (sourceCam === groundTruthCameraRef.current) {
          predictionCameraRef.current.up.copy(sourceCam.up.clone());
          errorCameraRef.current.up.copy(sourceCam.up.clone());
        } else if (sourceCam === predictionCameraRef.current) {
          groundTruthCameraRef.current.up.copy(sourceCam.up.clone());
          errorCameraRef.current.up.copy(sourceCam.up.clone());
        } else {
          groundTruthCameraRef.current.up.copy(sourceCam.up.clone());
          predictionCameraRef.current.up.copy(sourceCam.up.clone());
        }
        
        // Also update camera position display if needed
        if (activeControlsRef.current) {
          updateCameraPosDisplay();
        }
      }

      // 3. Render all views
      if (groundTruthRendererRef.current && groundTruthCameraRef.current && groundTruthSceneRef.current && groundTruthBg.backgroundScene && groundTruthBg.backgroundCamera) {
        groundTruthRendererRef.current.autoClear = false;
        groundTruthRendererRef.current.clear();
        groundTruthRendererRef.current.render(groundTruthSceneRef.current, groundTruthCameraRef.current);
      }
      
      // Render prediction view
      if (predictionRendererRef.current && predictionCameraRef.current && predictionSceneRef.current) {
        predictionRendererRef.current.autoClear = false;
        predictionRendererRef.current.clear();
        predictionRendererRef.current.render(predictionSceneRef.current, predictionCameraRef.current);
      }
      
      // Render error view
      if (errorRendererRef.current && errorCameraRef.current && errorSceneRef.current) {
        errorRendererRef.current.autoClear = false;
        errorRendererRef.current.clear();
        errorRendererRef.current.render(errorSceneRef.current, errorCameraRef.current);
      }
    };
    animate();
    
    // Handle resize for all views
    const handleResize = () => {
      if (!groundTruthContainerRef.current || !predictionContainerRef.current || !errorContainerRef.current ||
          !groundTruthCameraRef.current || !predictionCameraRef.current || !errorCameraRef.current ||
          !groundTruthRendererRef.current || !predictionRendererRef.current || !errorRendererRef.current ||
          !groundTruthControlsRef.current || !predictionControlsRef.current || !errorControlsRef.current) return;
      
      // Update ground truth view
      groundTruthCameraRef.current.aspect = groundTruthContainerRef.current.clientWidth / groundTruthContainerRef.current.clientHeight;
      groundTruthCameraRef.current.updateProjectionMatrix();
      groundTruthRendererRef.current.setSize(groundTruthContainerRef.current.clientWidth, groundTruthContainerRef.current.clientHeight);
      groundTruthControlsRef.current.update();
      
      // Update prediction view
      predictionCameraRef.current.aspect = predictionContainerRef.current.clientWidth / predictionContainerRef.current.clientHeight;
      predictionCameraRef.current.updateProjectionMatrix();
      predictionRendererRef.current.setSize(predictionContainerRef.current.clientWidth, predictionContainerRef.current.clientHeight);
      predictionControlsRef.current.update();
      
      // Update error view
      errorCameraRef.current.aspect = errorContainerRef.current.clientWidth / errorContainerRef.current.clientHeight;
      errorCameraRef.current.updateProjectionMatrix();
      errorRendererRef.current.setSize(errorContainerRef.current.clientWidth, errorContainerRef.current.clientHeight);
      errorControlsRef.current.update();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      // Dispose of all controls and remove listeners
      const disposeControls = (controlsRef: MutableRefObject<ArcballControls | null>, viewName: string) => {
        if (controlsRef.current) {
          controlsRef.current.dispose();
          controlsRef.current = null;
        }
      };
      
      disposeControls(groundTruthControlsRef, 'groundTruth');
      disposeControls(predictionControlsRef, 'prediction');
      disposeControls(errorControlsRef, 'error');
      
      // Clean up renderers
      if (groundTruthRendererRef.current && groundTruthContainerRef.current) {
        groundTruthContainerRef.current.removeChild(groundTruthRendererRef.current.domElement);
      }
      
      if (predictionRendererRef.current && predictionContainerRef.current) {
        predictionContainerRef.current.removeChild(predictionRendererRef.current.domElement);
      }
      
      if (errorRendererRef.current && errorContainerRef.current) {
        errorContainerRef.current.removeChild(errorRendererRef.current.domElement);
      }
      
      // Clean up point clouds
      if (groundTruthPointCloudRef.current && groundTruthSceneRef.current) {
        groundTruthSceneRef.current.remove(groundTruthPointCloudRef.current);
      }
      
      if (predictionPointCloudRef.current && predictionSceneRef.current) {
        predictionSceneRef.current.remove(predictionPointCloudRef.current);
      }
      
      if (errorPointCloudRef.current && errorSceneRef.current) {
        errorSceneRef.current.remove(errorPointCloudRef.current);
      }
    };
  }, []); // Empty dependency array
  
  // Load metadata
  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const response = await fetch('/point_cloud_bin/metadata.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch metadata: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setMetadata(data);
      } catch (error) {
        // Error handling without logging
      }
    };
    
    loadMetadata();
  }, []);
  
  // Updated resetCameras to reset all three controls
  const resetCameras = useCallback((cloudInfo: CloudInfo) => {
      if (!groundTruthCameraRef.current || !groundTruthControlsRef.current || 
          !predictionCameraRef.current || !predictionControlsRef.current ||
          !errorCameraRef.current || !errorControlsRef.current) return;

      try {
          const center = new THREE.Vector3(0, 0, 0); // Keep target centered
          
          // Set the specific initial starting position requested by the user
          const initialPosition = new THREE.Vector3(-0.07, -0.10, 0.11);

          // Reset ground truth view
          groundTruthCameraRef.current.position.copy(initialPosition);
          groundTruthCameraRef.current.up.set(0, 1, 0);
          groundTruthControlsRef.current.reset(); // Use reset instead of setTarget
          
          // Reset prediction view
          predictionCameraRef.current.position.copy(initialPosition);
          predictionCameraRef.current.up.set(0, 1, 0);
          predictionControlsRef.current.reset(); // Use reset instead of setTarget
          
          // Reset error view
          errorCameraRef.current.position.copy(initialPosition);
          errorCameraRef.current.up.set(0, 1, 0);
          errorControlsRef.current.reset(); // Use reset instead of setTarget

          // Reset active controls tracking
          activeControlsRef.current = null;

          // Update position string display immediately
          updateCameraPosDisplay();
      } catch (error) {
          // Error handling without logging
      } 
  }, [updateCameraPosDisplay]);
  
  // Load point cloud data - resetCameras dependency is now stable
  useEffect(() => {
    if (!metadata || !groundTruthSceneRef.current || !predictionSceneRef.current || !errorSceneRef.current || !resetCameras) {
      return;
    }
    
    const loadPointClouds = async () => {
      try {
        if (currentPointCloudIndex >= metadata.length) {
          return;
        }
        
        const cloudInfo = metadata[currentPointCloudIndex];
        
        // Immediately set pressure range from metadata
        const pressureMin = cloudInfo.stats.pressureMin;
        const pressureMax = cloudInfo.stats.pressureMax;
        setPressureRange({
          min: pressureMin,
          max: pressureMax
        });
        
        // Load binary data
        const response = await fetch(`/point_cloud_bin/${cloudInfo.filename}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch point cloud: ${response.status} ${response.statusText}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const pointData = new Float32Array(arrayBuffer);
        
        // Calculate exact center of the point cloud from its bounding box
        const min = new THREE.Vector3(
          cloudInfo.stats.positionMin[0] * 2,
          cloudInfo.stats.positionMin[1],
          cloudInfo.stats.positionMin[2]
        );
        
        const max = new THREE.Vector3(
          cloudInfo.stats.positionMax[0] * 2,
          cloudInfo.stats.positionMax[1],
          cloudInfo.stats.positionMax[2]
        );
        
        // Create a temporary bounding box to compute the center
        const boundingBox = new THREE.Box3(min, max);
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);
        
        // Pre-calculate error values and their min/max for proper normalization
        let errorMin = Infinity;
        let errorMax = -Infinity;
        const errorValues = new Float32Array(cloudInfo.numPoints);
        
        // First pass to calculate all error values and find their min/max
        for (let i = 0; i < cloudInfo.numPoints; i++) {
          const groundTruthValue = pointData[i * 5 + 3];
          const predictionValue = pointData[i * 5 + 4];
          const error = Math.abs(groundTruthValue - predictionValue);
          errorValues[i] = error;
          
          // Update error min/max
          if (error < errorMin) errorMin = error;
          if (error > errorMax) errorMax = error;
        }
        
        // Ensure we have a valid range (avoid division by zero)
        if (errorMax === errorMin) {
          errorMax = errorMin + 1;
        }
        
        setErrorRange({
          min: errorMin,
          max: errorMax
        });
        
        // Create point clouds for all views
        const createPointCloud = (
          sceneRef: React.RefObject<THREE.Scene>,
          pointCloudRef: MutableRefObject<THREE.Points | null>,
          colorMode: 'groundTruth' | 'prediction' | 'error'
        ) => {
          if (!sceneRef.current) return;
          
          // Clean up previous point cloud FIRST
          if (pointCloudRef.current && sceneRef.current) {
               if (pointCloudRef.current.geometry) {
                  pointCloudRef.current.geometry.dispose();
              }
              if (pointCloudRef.current.material) {
                   const material = pointCloudRef.current.material as THREE.PointsMaterial;
                   if (material.map) {
                       material.map.dispose();
                   }
                  material.dispose();
              }
              sceneRef.current.remove(pointCloudRef.current);
              pointCloudRef.current = null; // Ensure ref is nullified
          }

          // Create geometry
          const geometry = new THREE.BufferGeometry();
          
          // Extract positions and create a simple colored point cloud
          const positions = new Float32Array(cloudInfo.numPoints * 3);
          const colors = new Float32Array(cloudInfo.numPoints * 3);
          
          // Extract pressure data and normalize for coloring
          const pressureRangeVal = pressureMax - pressureMin; // Renamed to avoid conflict with useState variable
          
          // Extract data from interleaved format and center at origin
          for (let i = 0; i < cloudInfo.numPoints; i++) {
            // Extract position and center it around origin
            positions[i * 3] = pointData[i * 5] * 2.3 - center.x;     // x - stretched by factor of 2
            positions[i * 3 + 1] = pointData[i * 5 + 1] - center.y + 0.25; // y - increased offset to raise the points more
            positions[i * 3 + 2] = pointData[i * 5 + 2] - center.z; // z
            
            let normalizedValue;
            
            if (colorMode === 'groundTruth') {
              // Use groundTruth value and normalize with pressure range
              const pressureValue = pointData[i * 5 + 3];
              normalizedValue = pressureRangeVal === 0 ? 0.5 : Math.max(0, Math.min(1, (pressureValue - pressureMin) / pressureRangeVal)); // Added check for zero range
            } else if (colorMode === 'prediction') {
              // Use prediction value and normalize with pressure range
              const pressureValue = pointData[i * 5 + 4];
               normalizedValue = pressureRangeVal === 0 ? 0.5 : Math.max(0, Math.min(1, (pressureValue - pressureMin) / pressureRangeVal)); // Added check for zero range
            } else if (colorMode === 'error') {
              // Use pre-computed error value and normalize with error range
              const errorValue = errorValues[i];
              const errorRangeVal = errorMax - errorMin; // Renamed
              normalizedValue = errorRangeVal === 0 ? 0.5 : Math.max(0, Math.min(1, (errorValue - errorMin) / errorRangeVal)); // Added check for zero range
            } else {
              normalizedValue = 0; // Default value to avoid undefined
            }
            
            // Apply the appropriate colormap
            let colorMapToUse = jetColormap;
            if (colorMode === 'error') {
              colorMapToUse = errorColormap;
            }
            const [r, g, b] = colorMapToUse(normalizedValue);
            
            // Set color
            colors[i * 3] = r;
            colors[i * 3 + 1] = g;
            colors[i * 3 + 2] = b;
          }
          
          // Set geometry attributes
          geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
          geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
          
          // Create point sprite texture
          const pointCanvas = document.createElement('canvas');
          const ctx = pointCanvas.getContext('2d');
          const size = 128;
          pointCanvas.width = size;
          pointCanvas.height = size;
          
          if (ctx) {
            // Draw circular point
            const radius = size / 2;
            ctx.beginPath();
            ctx.arc(radius, radius, radius, 0, Math.PI * 2, false);
            ctx.fillStyle = 'white';
            ctx.fill();
          }
          
          const pointTexture = new THREE.CanvasTexture(pointCanvas);
          
          // Create material
          const material = new THREE.PointsMaterial({
            // point cloud size
            size: 0.015,
            vertexColors: true,
            sizeAttenuation: true,
            map: pointTexture,
            transparent: true,
            alphaTest: 0.1,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            depthTest: true
          });
          
          // Create mesh
          const pointCloud = new THREE.Points(geometry, material);
          
          // Add to scene
          sceneRef.current.add(pointCloud);
          pointCloudRef.current = pointCloud; // This assignment is now valid
        };
        
        // Create all point clouds
        // Pass MutableRefObject refs
        createPointCloud(groundTruthSceneRef, groundTruthPointCloudRef as MutableRefObject<THREE.Points | null>, 'groundTruth');
        createPointCloud(predictionSceneRef, predictionPointCloudRef as MutableRefObject<THREE.Points | null>, 'prediction');
        createPointCloud(errorSceneRef, errorPointCloudRef as MutableRefObject<THREE.Points | null>, 'error');
        
        // Only reset the camera when changing cars if animation has played
        // Otherwise maintain current camera position
        if (!hasPlayedIntroAnimation) {
          resetCameras(cloudInfo);
          
          // Start the intro camera animation ONLY if it hasn't played before
          if (groundTruthCameraRef.current && groundTruthControlsRef.current) {
              const camera = groundTruthCameraRef.current;
              const controls = groundTruthControlsRef.current;
              const targetPosition = new THREE.Vector3(-0.94, -1.42, 1.59);
              const initialUp = camera.up.clone(); // Store the initial UP vector
              const rotationTarget = { angle: 0 }; // Object for GSAP to animate
              const finalRotationAngle = 55 * Math.PI / 180; // -70 degrees clockwise in radians

              // Kill any existing animations on the camera position and rotation target
              gsap.killTweensOf(camera.position);
              gsap.killTweensOf(rotationTarget);

              // Important - treat animation as being controlled from groundTruth view
              // to ensure all three cameras stay in sync during animation
              activeControlsRef.current = 'groundTruth';

              // Temporarily disable controls during animation
              if (groundTruthControlsRef.current) groundTruthControlsRef.current.enabled = false;
              if (predictionControlsRef.current) predictionControlsRef.current.enabled = false;
              if (errorControlsRef.current) errorControlsRef.current.enabled = false;
              
              // Store original pointer event handlers and temporarily disable them
              const gtDomElement = groundTruthRendererRef.current?.domElement;
              const predDomElement = predictionRendererRef.current?.domElement;
              const errDomElement = errorRendererRef.current?.domElement;
              
              // Save original pointer-events style
              let gtPointerEvents = gtDomElement?.style.pointerEvents;
              let predPointerEvents = predDomElement?.style.pointerEvents;
              let errPointerEvents = errDomElement?.style.pointerEvents;
              
              // Disable pointer events during animation
              if (gtDomElement) gtDomElement.style.pointerEvents = 'none';
              if (predDomElement) predDomElement.style.pointerEvents = 'none';
              if (errDomElement) errDomElement.style.pointerEvents = 'none';
              
              // Create a transparent overlay to block all mouse events
              const overlay = document.createElement('div');
              overlay.style.position = 'fixed';
              overlay.style.top = '0';
              overlay.style.left = '0';
              overlay.style.width = '100%';
              overlay.style.height = '100%';
              overlay.style.backgroundColor = 'transparent';
              overlay.style.zIndex = '9999';
              document.body.appendChild(overlay);

              gsap.to({ ...camera.position, rotation: rotationTarget.angle }, { // Animate position and rotation angle
                  x: targetPosition.x,
                  y: targetPosition.y,
                  z: targetPosition.z,
                  rotation: finalRotationAngle, // Target rotation angle
                  duration: 2, // Animation duration in seconds
                  ease: 'power2.inOut', // Smoother easing
                  onUpdate: function() { // Use function() to access 'this.targets()[0]'
                      const currentTarget = this.targets()[0];
                      camera.position.set(currentTarget.x, currentTarget.y, currentTarget.z);

                      // Calculate current rotation based on animated angle
                      const forward = new THREE.Vector3();
                      camera.getWorldDirection(forward); // Get current view direction
                      const rotation = new THREE.Quaternion().setFromAxisAngle(forward, currentTarget.rotation);
                      
                      // Apply rotation to the *initial* up vector
                      const newUp = initialUp.clone().applyQuaternion(rotation);
                      camera.up.copy(newUp);

                      // Look at the center with the new position and up vector
                      camera.lookAt(0, 0, 0);

                      // IMPORTANT: Keep controls updated during animation
                      controls.update();
                      
                      // Update the position display string during animation
                      updateCameraPosDisplay(); 
                  },
                  onComplete: () => {
                      // Ensure final position and rotation are precise
                      camera.position.copy(targetPosition);
                      const forward = new THREE.Vector3();
                      camera.getWorldDirection(forward);
                      const finalRotation = new THREE.Quaternion().setFromAxisAngle(forward, finalRotationAngle);
                      camera.up.copy(initialUp.clone().applyQuaternion(finalRotation));
                      camera.lookAt(0, 0, 0);
                      controls.update(); // Final controls update
                      updateCameraPosDisplay(); // Final position display update

                      // Re-enable controls after animation is complete
                      if (groundTruthControlsRef.current) groundTruthControlsRef.current.enabled = true;
                      if (predictionControlsRef.current) predictionControlsRef.current.enabled = true;
                      if (errorControlsRef.current) errorControlsRef.current.enabled = true;
                      
                      // Restore original pointer-events style
                      if (gtDomElement) gtDomElement.style.pointerEvents = gtPointerEvents || '';
                      if (predDomElement) predDomElement.style.pointerEvents = predPointerEvents || '';
                      if (errDomElement) errDomElement.style.pointerEvents = errPointerEvents || '';
                      
                      // Remove the overlay
                      document.body.removeChild(overlay);

                      // Mark that the animation has played
                      setHasPlayedIntroAnimation(true);
                  }
              });
          }
        }

      } catch (error) {
        // Error handling without logging
      }
    };
    
    loadPointClouds();
  }, [metadata, currentPointCloudIndex, resetCameras, updateCameraPosDisplay, hasPlayedIntroAnimation]); // Added hasPlayedIntroAnimation dependency
  
  // Handle point cloud navigation
  const nextPointCloud = () => {
    if (!metadata) return;
    setCurrentPointCloudIndex((prevIndex) => 
      prevIndex < metadata.length - 1 ? prevIndex + 1 : prevIndex
    );
  };
  
  const prevPointCloud = () => {
    if (!metadata) return;
    setCurrentPointCloudIndex((prevIndex) => 
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };

  // Function to select a random point cloud
  const selectRandomPointCloud = () => {
    if (!metadata || metadata.length === 0) return;
    const randomIndex = Math.floor(Math.random() * metadata.length);
    setCurrentPointCloudIndex(randomIndex);
  };
  
  return (
    <div className="flex flex-col w-full h-full m-auto justify-between">
      <div className="flex flex-col justify-center p-2 rounded-[10px] mx-4 mb-2 text-white shadow-lg overflow-hidden gap-2">
        <div className='font-mono flex flex-col md:flex-row items-start justify-between'>
          <span className='text-sm md:text-2xl font-bold md:font-bold text-left md:text-center w-full mb-4'>Run complex mechanical simulations in seconds</span>
        </div>
        <div className="flex items-center justify-between w-full gap-4 font-mono">
          <span className="text-sm font-semibold">Latest Model: Mach-1.5 (March 2025)</span>
          <Button className='rounded-[10px] w-full md:w-[250px] my-2 md:my-0' onClick={selectRandomPointCloud} disabled={!metadata || metadata.length === 0}>New Car</Button>
        </div>
        <div className='flex flex-col items-start justify-between font-mono md:flex-row gap-4 md:gap-0'>
          <div className='flex flex-col gap-2 md:gap-0'>
            <span className='text-xs md:text-sm font-normal'>Simulation: CFD for Aerodynamic Performance</span>
            <span className='text-xs md:text-sm font-normal'>Output: Pressure distribution over the car</span>
          </div>
          {/* <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex flex-col'>
              <span className='text-sm font-semibold md:font-normal'>Numerical Solver Runtime</span>
              <span className='text-xl font-normal'>{NUM_SIM_RUNTIME} hours</span>
            </div>
            <div className='flex flex-col'>
              <span className='text-sm font-semibold md:font-normal'>Our AI Model Runtime</span>
              <span className='text-xl font-normal'>{AI_RUNTIME[currentPointCloudIndex]} ms</span>
              <span className='text-sm font-normal text-green-500'>↑ {Math.round(NUM_SIM_RUNTIME * 60 * 60 * 1000 / AI_RUNTIME[currentPointCloudIndex]).toLocaleString()}x Faster</span>
            </div>
          </div> */}
        </div>
      </div>
      
      <div className="flex md:flex-row flex-col md:h-[70vh] h-[1500px]">
        <div className="flex-1 flex flex-col rounded-lg overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 z-10 pt-2">
            <div className="text-white text-center font-bold font-mono">Numerical Solver Result</div>
            <div className="text-xs before:text-white text-center font-normal font-mono">Runtime: {NUM_SIM_RUNTIME} hours</div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 z-10 pt-2">
            <div className="p-3">
              <ColorScale 
                min={pressureRange.min} 
                max={pressureRange.max} 
                label="Pressure" 
              />
            </div>
          </div>
          <div 
            ref={groundTruthContainerRef} 
            className="flex-1 w-full h-full" 
          />
        </div>
        
        <div className="flex-1 flex flex-col rounded-lg overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 z-10 pt-2">
            <div className="text-white text-center font-bold font-mono">AI Result</div>
            <div className="text-xs before:text-white text-center font-normal font-mono">Runtime: {AI_RUNTIME[currentPointCloudIndex]} ms</div>
            <div className='text-xs text-green-500 text-center font-normal font-mono mt-1'>↑ {Math.round(NUM_SIM_RUNTIME * 60 * 60 * 1000 / AI_RUNTIME[currentPointCloudIndex]).toLocaleString()}x Faster</div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 z-10 pt-2">
            <div className="p-3">
              <ColorScale 
                min={pressureRange.min} 
                max={pressureRange.max} 
                label="Pressure" 
              />
            </div>
          </div>
          <div 
            ref={predictionContainerRef} 
            className="flex-1 w-full h-full" 
          />
        </div>
        
        <div className="flex-1 flex flex-col rounded-lg overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 z-10 pt-2">
            <div className="text-white text-center font-bold font-mono">Prediction Error</div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 z-10 pt-2">
            <div className="p-3">
              <ColorScale 
                min={errorRange.min} 
                max={errorRange.max} 
                label="Error" 
                colormap={errorColormap}
              />
            </div>
          </div>
          <div 
            ref={errorContainerRef} 
            className="flex-1 w-full h-full" 
          />
        </div>
      </div>
    </div>
  );
};

export default SideBySidePointCloudViewer;

// Example page component for Next.js
// export function PointCloudPage() {
//   return (
//     <div className="container">
//       <h1>3D Point Cloud Visualization</h1>
//       <PointCloudViewer />
//     </div>
//   )
// } 