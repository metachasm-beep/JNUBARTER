"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const DepthFlowShader = ({ 
  imagePath, 
  scrollProgress 
}: { 
  imagePath: string, 
  scrollProgress: any
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  
  // Load textures with error handling
  const texture = useTexture(imagePath);
  
  const uniforms = useMemo(() => ({
    image: { value: texture },
    iOffset: { value: new THREE.Vector2(0, 0) },
    iHeight: { value: 0.05 }, // Displacement intensity
    iTime: { value: 0 }
  }), [texture]);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      const progress = scrollProgress.get();
      
      // Update uniforms
      material.uniforms.iOffset.value.y = progress * 0.2;
      material.uniforms.iTime.value = state.clock.getElapsedTime();
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  // OPTIMIZED SINGLE-PASS DEPTHFLOW SHADER (Prevents Context Loss)
  const fragmentShader = `
    uniform sampler2D image;
    uniform vec2 iOffset;
    uniform float iHeight;
    uniform float iTime;
    varying vec2 vUv;

    void main() {
      // 1. Create a synthetic depth map from brightness
      // This saves a texture fetch and ensures compatibility
      vec4 texColor = texture2D(image, vUv);
      float depth = (texColor.r + texColor.g + texColor.b) / 3.0;
      
      // 2. Calculate Displacement (DepthFlow logic)
      vec2 displacement = (depth - 0.5) * iHeight * iOffset;
      vec2 parallaxUv = vUv + displacement;
      
      // 3. Chromatic Aberration (Cheap Single-Shift)
      float r = texture2D(image, parallaxUv + vec2(0.003, 0.0)).r;
      float g = texture2D(image, parallaxUv).g;
      float b = texture2D(image, parallaxUv - vec2(0.003, 0.0)).b;
      
      vec3 color = vec3(r, g, b);
      
      // 4. Atmosphere & Vignette
      float vignette = smoothstep(0.8, 0.3, length(vUv - 0.5));
      color *= (0.8 + 0.2 * vignette);
      
      // Add subtle atmospheric pulse
      color += 0.02 * sin(iTime + vUv.y * 10.0);

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
      />
    </mesh>
  );
};

export const DepthFlowExperience = ({ scrollProgress }: { scrollProgress: any }) => {
  const [webglError, setWebglError] = useState(false);

  return (
    <div className="fixed inset-0 z-0 bg-black">
      {webglError ? (
        // Fallback for context loss or no WebGL
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: "url('/images/parallax/solid_bg.png')" }}
        />
      ) : (
        <Canvas 
          camera={{ position: [0, 0, 1] }}
          gl={{ antialias: false, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener('webglcontextlost', () => setWebglError(true));
          }}
          onError={() => setWebglError(true)}
        >
          <React.Suspense fallback={null}>
            <DepthFlowShader 
              imagePath="/images/parallax/solid_bg.png" 
              scrollProgress={scrollProgress} 
            />
          </React.Suspense>
        </Canvas>
      )}
    </div>
  );
};
