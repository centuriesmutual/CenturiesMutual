'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, RoundedBox, Text, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

const GREEN = '#14432A'
const GOLD = '#C9A53E'
const PAPER = '#FAFCFB'
const BRICK = '#8B6B4A'
const AWNING = '#C9A53E'
const WINDOW = '#A8D4C0'

function GroceryStore() {
  const ref = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    // Soft, slow drift — matched to membership card
    ref.current.position.y = Math.sin(t * 0.2) * 0.028
    ref.current.rotation.y = Math.sin(t * 0.12) * 0.018
  })

  return (
    <Float speed={0.28} rotationIntensity={0.025} floatIntensity={0.05}>
      <group ref={ref} position={[0, -0.15, 0]} scale={1.15}>
        {/* Main building body */}
        <RoundedBox args={[3.2, 2.0, 1.6]} radius={0.06} position={[0, 0.15, 0]}>
          <meshStandardMaterial color={GREEN} metalness={0.12} roughness={0.5} />
        </RoundedBox>

        {/* Roof slab */}
        <RoundedBox args={[3.5, 0.18, 1.9]} radius={0.04} position={[0, 1.25, 0]}>
          <meshStandardMaterial color="#0F3321" metalness={0.15} roughness={0.55} />
        </RoundedBox>

        {/* Awning */}
        <RoundedBox args={[3.0, 0.12, 0.7]} radius={0.03} position={[0, 0.72, 0.95]}>
          <meshStandardMaterial color={AWNING} metalness={0.2} roughness={0.45} />
        </RoundedBox>
        {/* Awning stripes */}
        {([-1.0, -0.33, 0.33, 1.0] as const).map((x) => (
          <mesh key={x} position={[x, 0.72, 0.96]}>
            <boxGeometry args={[0.28, 0.125, 0.72]} />
            <meshStandardMaterial color="#A8882E" metalness={0.15} roughness={0.5} />
          </mesh>
        ))}

        {/* Storefront sign band */}
        <RoundedBox args={[2.4, 0.38, 0.08]} radius={0.02} position={[0, 0.95, 0.82]}>
          <meshStandardMaterial color={PAPER} metalness={0.05} roughness={0.55} />
        </RoundedBox>
        <Text
          position={[0, 0.95, 0.88]}
          fontSize={0.16}
          color={GREEN}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.04}
        >
          MARKET
        </Text>

        {/* Left window */}
        <RoundedBox args={[0.85, 0.7, 0.06]} radius={0.02} position={[-0.85, 0.05, 0.82]}>
          <meshStandardMaterial color={WINDOW} metalness={0.25} roughness={0.3} />
        </RoundedBox>
        {/* Right window */}
        <RoundedBox args={[0.85, 0.7, 0.06]} radius={0.02} position={[0.85, 0.05, 0.82]}>
          <meshStandardMaterial color={WINDOW} metalness={0.25} roughness={0.3} />
        </RoundedBox>
        {/* Window mullions */}
        <mesh position={[-0.85, 0.05, 0.86]}>
          <boxGeometry args={[0.04, 0.7, 0.02]} />
          <meshStandardMaterial color={GREEN} />
        </mesh>
        <mesh position={[0.85, 0.05, 0.86]}>
          <boxGeometry args={[0.04, 0.7, 0.02]} />
          <meshStandardMaterial color={GREEN} />
        </mesh>

        {/* Door */}
        <RoundedBox args={[0.55, 0.95, 0.08]} radius={0.02} position={[0, -0.28, 0.82]}>
          <meshStandardMaterial color="#0F3321" metalness={0.2} roughness={0.45} />
        </RoundedBox>
        <mesh position={[0.18, -0.25, 0.88]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Side brick accent base */}
        <RoundedBox args={[3.25, 0.28, 1.65]} radius={0.03} position={[0, -0.95, 0]}>
          <meshStandardMaterial color={BRICK} metalness={0.08} roughness={0.7} />
        </RoundedBox>

        {/* Produce crates out front */}
        <RoundedBox args={[0.45, 0.28, 0.4]} radius={0.02} position={[-1.15, -0.72, 1.15]}>
          <meshStandardMaterial color="#6B4F32" metalness={0.05} roughness={0.75} />
        </RoundedBox>
        <mesh position={[-1.15, -0.5, 1.15]}>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#C45C3A" metalness={0.05} roughness={0.6} />
        </mesh>
        <mesh position={[-1.0, -0.52, 1.2]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color="#D4A017" metalness={0.05} roughness={0.6} />
        </mesh>

        <RoundedBox args={[0.45, 0.28, 0.4]} radius={0.02} position={[1.15, -0.72, 1.15]}>
          <meshStandardMaterial color="#6B4F32" metalness={0.05} roughness={0.75} />
        </RoundedBox>
        <mesh position={[1.15, -0.52, 1.15]} scale={[1.2, 0.7, 0.8]}>
          <sphereGeometry args={[0.14, 12, 12]} />
          <meshStandardMaterial color="#5A8F3C" metalness={0.05} roughness={0.65} />
        </mesh>
      </group>
    </Float>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 7, 4]} intensity={1.1} />
      <directionalLight position={[-4, 3, 2]} intensity={0.35} color={GOLD} />
      <GroceryStore />
      <ContactShadows position={[0, -1.7, 0]} opacity={0.25} scale={12} blur={2.6} far={5} />
      <Environment preset="apartment" />
    </>
  )
}

export function PayFlow3D({ className }: { className?: string }) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: 'min(380px, 72vw)',
        minHeight: 240,
        background: 'transparent',
      }}
    >
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center bg-transparent font-sans text-sm text-[#55655D]">
            Loading…
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0.6, 7.2], fov: 34 }}
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  )
}
