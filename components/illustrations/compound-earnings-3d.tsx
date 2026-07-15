'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, ContactShadows, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

function CompoundScene() {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (!group.current) return
    group.current.rotation.y = Math.sin(t * 0.28) * 0.18
    group.current.position.y = -0.15 + Math.sin(t * 0.5) * 0.035
  })

  const bars = [
    { h: 0.55, x: -0.85, color: '#1A4D38' },
    { h: 0.9, x: -0.28, color: '#0F3D2E' },
    { h: 1.3, x: 0.28, color: '#C9A53E' },
    { h: 1.75, x: 0.85, color: '#E0C15A' },
  ] as const

  return (
    <Float speed={0.8} rotationIntensity={0.08} floatIntensity={0.2}>
      <group ref={group} position={[0, -0.15, 0]} scale={1.05}>
        <RoundedBox args={[2.6, 0.08, 1.1]} radius={0.03} position={[0, -0.85, 0]}>
          <meshStandardMaterial color="#0A2E22" metalness={0.2} roughness={0.55} />
        </RoundedBox>
        {bars.map((bar) => (
          <RoundedBox
            key={bar.x}
            args={[0.42, bar.h, 0.42]}
            radius={0.04}
            position={[bar.x, -0.85 + bar.h / 2, 0]}
          >
            <meshStandardMaterial
              color={bar.color}
              metalness={0.35}
              roughness={0.35}
              emissive={bar.color}
              emissiveIntensity={0.08}
            />
          </RoundedBox>
        ))}
        <pointLight position={[0.9, 1.2, 1.2]} color="#FFD56A" intensity={1.05} distance={5} />
      </group>
    </Float>
  )
}

export function CompoundEarnings3D({ className = '' }: { className?: string }) {
  return (
    <div className={`relative h-full w-full bg-transparent ${className}`} aria-hidden>
      <Suspense fallback={null}>
        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: [0, 0.55, 4.4], fov: 34, near: 0.1, far: 40 }}
          gl={{ antialias: true, alpha: true, premultipliedAlpha: false }}
          style={{ background: 'transparent', width: '100%', height: '100%' }}
          onCreated={({ gl, scene, camera }) => {
            gl.setClearColor(0x000000, 0)
            scene.background = null
            camera.lookAt(0, 0.05, 0)
          }}
        >
          <ambientLight intensity={0.45} />
          <directionalLight position={[3, 4, 2]} intensity={0.75} color="#FFF8E7" />
          <directionalLight position={[-2, 1, -2]} intensity={0.28} color="#8FB39E" />
          <CompoundScene />
          <ContactShadows
            position={[0, -1.05, 0]}
            opacity={0.28}
            scale={6}
            blur={2.6}
            far={3}
            color="#04110C"
          />
          <Environment preset="city" environmentIntensity={0.28} background={false} />
        </Canvas>
      </Suspense>
    </div>
  )
}
