'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, ContactShadows, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

function WalletScene() {
  const group = useRef<THREE.Group>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (!group.current) return
    group.current.rotation.y = Math.sin(t * 0.32) * 0.22
    group.current.position.y = -0.05 + Math.sin(t * 0.5) * 0.04
  })

  return (
    <Float speed={0.85} rotationIntensity={0.1} floatIntensity={0.22}>
      <group ref={group} position={[0, -0.05, 0]} scale={1.05}>
        <RoundedBox args={[2.2, 1.35, 0.18]} radius={0.12} position={[0, 0.1, 0]}>
          <meshStandardMaterial color="#0F3D2E" metalness={0.25} roughness={0.4} />
        </RoundedBox>
        <RoundedBox args={[2.05, 0.55, 0.06]} radius={0.04} position={[0, 0.35, 0.12]}>
          <meshStandardMaterial color="#C9A53E" metalness={0.45} roughness={0.35} />
        </RoundedBox>
        <mesh position={[0.7, -0.15, 0.15]}>
          <cylinderGeometry args={[0.22, 0.22, 0.05, 32]} />
          <meshStandardMaterial
            color="#E8C45A"
            emissive="#C9A53E"
            emissiveIntensity={0.35}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0.55, -0.05, 0.2]} rotation={[0.4, 0.2, 0.1]}>
          <cylinderGeometry args={[0.2, 0.2, 0.05, 32]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.7} roughness={0.28} />
        </mesh>
        <pointLight position={[0.6, 0.2, 1]} color="#FFD56A" intensity={1.1} distance={4} />
      </group>
    </Float>
  )
}

export function RewardsWallet3D({ className = '' }: { className?: string }) {
  return (
    <div className={`relative h-full w-full bg-transparent ${className}`} aria-hidden>
      <Suspense fallback={null}>
        <Canvas
          dpr={[1, 1.75]}
          camera={{ position: [0, 0.25, 4.2], fov: 34, near: 0.1, far: 40 }}
          gl={{ antialias: true, alpha: true, premultipliedAlpha: false }}
          style={{ background: 'transparent', width: '100%', height: '100%' }}
          onCreated={({ gl, scene, camera }) => {
            gl.setClearColor(0x000000, 0)
            scene.background = null
            camera.lookAt(0, 0.1, 0)
          }}
        >
          <ambientLight intensity={0.45} />
          <directionalLight position={[3, 4, 2]} intensity={0.75} color="#FFF8E7" />
          <directionalLight position={[-2, 1, -2]} intensity={0.3} color="#8FB39E" />
          <WalletScene />
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
