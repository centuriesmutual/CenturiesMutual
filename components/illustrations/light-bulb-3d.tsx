'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

function LightBulbScene() {
  const group = useRef<THREE.Group>(null)
  const glow = useRef<THREE.PointLight>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.35) * 0.16
      group.current.position.y = -0.2 + Math.sin(t * 0.55) * 0.03
    }
    if (glow.current) {
      glow.current.intensity = 1.35 + Math.sin(t * 2.1) * 0.25
    }
  })

  return (
    <Float speed={0.85} rotationIntensity={0.1} floatIntensity={0.22}>
      <group ref={group} position={[0, -0.2, 0]} scale={1}>
        {/* Soft outer glow shell */}
        <mesh position={[0, 0.55, 0]}>
          <sphereGeometry args={[0.68, 48, 48]} />
          <meshBasicMaterial color="#FFE9A8" transparent opacity={0.1} depthWrite={false} />
        </mesh>

        {/* Glass bulb */}
        <mesh position={[0, 0.55, 0]}>
          <sphereGeometry args={[0.56, 48, 48]} />
          <meshPhysicalMaterial
            color="#FFF6D6"
            emissive="#FFD056"
            emissiveIntensity={0.85}
            roughness={0.18}
            metalness={0.05}
            transmission={0.35}
            thickness={0.45}
            transparent
            opacity={0.95}
            envMapIntensity={0.35}
          />
        </mesh>

        {/* Inner filament glow */}
        <mesh position={[0, 0.52, 0]}>
          <sphereGeometry args={[0.18, 24, 24]} />
          <meshStandardMaterial
            color="#FFE08A"
            emissive="#FFC107"
            emissiveIntensity={2.2}
            roughness={0.4}
          />
        </mesh>

        {/* Neck */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.22, 0.28, 0.28, 32]} />
          <meshStandardMaterial color="#E8E0C8" metalness={0.2} roughness={0.45} />
        </mesh>

        {/* Screw base */}
        <mesh position={[0, -0.28, 0]}>
          <cylinderGeometry args={[0.26, 0.24, 0.42, 32]} />
          <meshStandardMaterial color="#A8B0B8" metalness={0.85} roughness={0.28} />
        </mesh>
        {([-0.12, 0, 0.12] as const).map((y) => (
          <mesh key={y} position={[0, -0.28 + y, 0]}>
            <torusGeometry args={[0.255, 0.018, 12, 48]} />
            <meshStandardMaterial color="#8A939C" metalness={0.9} roughness={0.25} />
          </mesh>
        ))}

        {/* Tip contact */}
        <mesh position={[0, -0.52, 0]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial color="#6E787F" metalness={0.95} roughness={0.2} />
        </mesh>

        <pointLight
          ref={glow}
          position={[0, 0.55, 0.2]}
          color="#FFD56A"
          intensity={1.5}
          distance={6}
          decay={2}
        />
      </group>
    </Float>
  )
}

export function LightBulb3D({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative h-full w-full bg-transparent ${className}`}
      aria-hidden
    >
      <Suspense fallback={null}>
        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: [0, 0.15, 3.8], fov: 34, near: 0.1, far: 40 }}
          gl={{
            antialias: true,
            alpha: true,
            premultipliedAlpha: false,
            powerPreference: 'high-performance',
          }}
          style={{ background: 'transparent', width: '100%', height: '100%' }}
          onCreated={({ gl, scene, camera }) => {
            gl.setClearColor(0x000000, 0)
            scene.background = null
            camera.lookAt(0, 0.15, 0)
          }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[3, 4, 2]} intensity={0.7} color="#FFF8E7" />
          <directionalLight position={[-2, 1, -2]} intensity={0.28} color="#8FB39E" />
          <LightBulbScene />
          <ContactShadows
            position={[0, -0.95, 0]}
            opacity={0.28}
            scale={5}
            blur={2.6}
            far={2.8}
            color="#04110C"
          />
          <Environment preset="city" environmentIntensity={0.28} background={false} />
        </Canvas>
      </Suspense>
    </div>
  )
}
