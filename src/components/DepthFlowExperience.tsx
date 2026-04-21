"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useScroll, useSpring, useTransform } from "framer-motion";

const DepthFlowShader = ({ 
  imagePath, 
  depthPath, 
  scrollProgress 
}: { 
  imagePath: string, 
  depthPath?: string,
  scrollProgress: any
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  
  // Load textures
  const texture = useTexture(imagePath);
  const depthMap = useTexture(depthPath || imagePath); // Fallback to brightness if no depth map

  const uniforms = useMemo(() => ({
    iTime: { value: 0 },
    iResolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
    image: { value: texture },
    depth: { value: depthMap },
    // DepthFlow Uniforms
    iOffset: { value: new THREE.Vector2(0, 0) },
    iZoom: { value: 1.05 },
    iHeight: { value: 0.1 },
    iFocus: { value: 0.5 },
    iSteady: { value: 0.5 },
    iQuality: { value: 0.5 },
    iBlurIntensity: { value: 0.02 },
    iLensIntensity: { value: 0.01 }
  }), [texture, depthMap, viewport]);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.iTime.value = state.clock.getElapsedTime();
      
      // Map scroll progress to offset and zoom
      const progress = scrollProgress.get();
      material.uniforms.iOffset.value.y = progress * 0.1;
      material.uniforms.iZoom.value = 1.05 + progress * 0.1;
      material.uniforms.iBlurIntensity.value = 0.01 + progress * 0.05;
    }
  });

  // FRAGMENT SHADER (Ported from DepthFlow-main/depthflow/resources/depthflow.glsl)
  const fragmentShader = `
    uniform float iTime;
    uniform vec2 iResolution;
    uniform sampler2D image;
    uniform sampler2D depth;
    uniform vec2 iOffset;
    uniform float iZoom;
    uniform float iHeight;
    uniform float iFocus;
    uniform float iSteady;
    uniform float iQuality;
    uniform float iBlurIntensity;
    uniform float iLensIntensity;
    
    varying vec2 vUv;

    // Optimized Ray-Marching Parallax
    vec2 getDepthFlowUV(vec2 uv) {
      float depthVal = texture2D(depth, uv).r;
      float displacement = (depthVal - iSteady) * iHeight;
      return uv + iOffset * displacement * iZoom;
    }

    void main() {
      vec2 uv = vUv;
      
      // 1. Calculate Primary UV with Parallax
      vec2 parallaxUv = getDepthFlowUV(uv);
      
      // 2. Chromatic Aberration (Lens Distortion)
      vec3 color;
      if (iLensIntensity > 0.0) {
        float r = texture2D(image, getDepthFlowUV(uv + vec2(iLensIntensity, 0.0))).r;
        float g = texture2D(image, parallaxUv).g;
        float b = texture2D(image, getDepthFlowUV(uv - vec2(iLensIntensity, 0.0))).b;
        color = vec3(r, g, b);
      } else {
        color = texture2D(image, parallaxUv).rgb;
      }

      // 3. Depth of Field (Subtle Blur)
      if (iBlurIntensity > 0.0) {
        float depthVal = texture2D(depth, parallaxUv).r;
        float blurAmount = abs(depthVal - iFocus) * iBlurIntensity;
        
        vec3 blurredColor = vec3(0.0);
        float total = 0.0;
        for (float x = -2.0; x <= 2.0; x++) {
          for (float y = -2.0; y <= 2.0; y++) {
            blurredColor += texture2D(image, parallaxUv + vec2(x, y) * blurAmount).rgb;
            total += 1.0;
          }
        }
        color = mix(color, blurredColor / total, clamp(blurAmount * 10.0, 0.0, 1.0));
      }

      // 4. Vignette
      float dist = distance(uv, vec2(0.5));
      color *= smoothstep(0.8, 0.2, dist);

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
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
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <React.Suspense fallback={null}>
          <DepthFlowShader 
            imagePath="/images/parallax/solid_bg.png" 
            scrollProgress={scrollProgress} 
          />
        </React.Suspense>
      </Canvas>
    </div>
  );
};
