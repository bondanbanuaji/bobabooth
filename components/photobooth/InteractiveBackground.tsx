'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Preload } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.5;
        groupRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.1) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <mesh position={[-4, 2, -5]}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#fce7f3" wireframe />
        </mesh>
      </Float>
      <Float speed={1.5} rotationIntensity={2} floatIntensity={2}>
         <mesh position={[5, -2, -8]}>
          <torusKnotGeometry args={[1, 0.3, 100, 16]} />
          <meshStandardMaterial color="#c4b5fd" roughness={0.1} metalness={0.8} />
        </mesh>
      </Float>
      <Float speed={3} rotationIntensity={1} floatIntensity={1}>
        <mesh position={[0, 4, -10]}>
          <icosahedronGeometry args={[1.5, 0]} />
          <meshStandardMaterial color="#38bdf8" wireframe />
        </mesh>
      </Float>
    </group>
  );
}

export function InteractiveBackground() {
  return (
    <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-black via-zinc-950 to-black overflow-hidden pointer-events-none">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <spotLight position={[-10, -10, -5]} intensity={0.5} color="#db2777" />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <FloatingShapes />
        <Preload all />
      </Canvas>
    </div>
  );
}
