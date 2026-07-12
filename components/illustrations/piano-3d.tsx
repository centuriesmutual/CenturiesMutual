'use client'

import { Suspense, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'

const GOLD = '#C9A53E'
const WOOD = '#3A2416'
const WOOD_LIGHT = '#5C3A24'
const WOOD_EDGE = '#2A180F'
const IVORY = '#F4EEE4'
const EBONY = '#171412'
const BRASS = '#C9A53E'

function InvalidateOnSettle() {
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    invalidate()
    const ids = [150, 400, 900, 1600].map((ms) => window.setTimeout(() => invalidate(), ms))
    return () => ids.forEach((id) => window.clearTimeout(id))
  }, [invalidate])
  return null
}

/** Soft float — same quiet drift as the membership card. */
function SoftFloat({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    ref.current.position.y = Math.sin(t * 0.2) * 0.028
    ref.current.rotation.y = 0.42 + Math.sin(t * 0.12) * 0.018
  })
  return <group ref={ref}>{children}</group>
}

function useGrandBodyGeometry() {
  return useMemo(() => {
    const shape = new THREE.Shape()
    // Grand piano top silhouette (plan view), extruded for the case depth
    shape.moveTo(-1.55, -0.55)
    shape.lineTo(0.55, -0.55)
    shape.quadraticCurveTo(1.75, -0.45, 1.85, 0.15)
    shape.quadraticCurveTo(1.7, 0.72, 0.35, 0.78)
    shape.lineTo(-1.55, 0.78)
    shape.closePath()
    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 0.42,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2,
    })
    geom.rotateX(-Math.PI / 2)
    geom.translate(0, 0.21, 0)
    geom.computeVertexNormals()
    return geom
  }, [])
}

function Keyboard() {
  const whiteKeys = useMemo(() => {
    const notes = 26
    return Array.from({ length: notes }, (_, i) => {
      const x = -1.28 + i * 0.098
      return { x, i }
    })
  }, [])

  const blackKeys = useMemo(() => {
    // Pattern relative to white keys: C# D#  F# G# A#
    const pattern = [0, 1, 3, 4, 5]
    const keys: { x: number }[] = []
    for (let octave = 0; octave < 4; octave++) {
      for (const p of pattern) {
        const whiteIndex = octave * 7 + p
        if (whiteIndex >= 25) continue
        keys.push({ x: -1.28 + whiteIndex * 0.098 + 0.065 })
      }
    }
    return keys
  }, [])

  return (
    <group position={[0.05, 0.445, 0.62]}>
      {/* Key bed */}
      <mesh position={[0, -0.04, 0]}>
        <boxGeometry args={[2.7, 0.06, 0.42]} />
        <meshStandardMaterial color={WOOD_EDGE} metalness={0.08} roughness={0.7} />
      </mesh>
      {whiteKeys.map((k) => (
        <mesh key={`w-${k.i}`} position={[k.x, 0, 0]}>
          <boxGeometry args={[0.09, 0.035, 0.36]} />
          <meshStandardMaterial color={IVORY} metalness={0.05} roughness={0.45} />
        </mesh>
      ))}
      {blackKeys.map((k, i) => (
        <mesh key={`b-${i}`} position={[k.x, 0.025, -0.04]}>
          <boxGeometry args={[0.055, 0.045, 0.22]} />
          <meshStandardMaterial color={EBONY} metalness={0.15} roughness={0.35} />
        </mesh>
      ))}
      {/* Fallboard lip */}
      <mesh position={[0, 0.05, -0.2]}>
        <boxGeometry args={[2.72, 0.08, 0.05]} />
        <meshStandardMaterial color={WOOD} metalness={0.08} roughness={0.65} />
      </mesh>
    </group>
  )
}

function MusicStand() {
  return (
    <group position={[-0.15, 0.72, 0.35]}>
      <mesh rotation={[-0.35, 0, 0]}>
        <boxGeometry args={[0.85, 0.02, 0.42]} />
        <meshStandardMaterial color={WOOD_LIGHT} metalness={0.08} roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.08, 0.18]} rotation={[-0.35, 0, 0]}>
        <boxGeometry args={[0.85, 0.035, 0.03]} />
        <meshStandardMaterial color={WOOD} metalness={0.08} roughness={0.65} />
      </mesh>
      {/* Sheet hint */}
      <mesh position={[0, 0.02, 0]} rotation={[-0.35, 0, 0]}>
        <boxGeometry args={[0.42, 0.002, 0.3]} />
        <meshStandardMaterial color="#F7F3EE" metalness={0.02} roughness={0.9} />
      </mesh>
    </group>
  )
}

function Pedals() {
  return (
    <group position={[-0.35, -0.55, 0.55]}>
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.55, 0.04, 0.18]} />
        <meshStandardMaterial color={WOOD_EDGE} metalness={0.1} roughness={0.7} />
      </mesh>
      {[-0.16, 0, 0.16].map((x) => (
        <mesh key={x} position={[x, 0.02, 0.08]} rotation={[0.2, 0, 0]}>
          <boxGeometry args={[0.08, 0.015, 0.14]} />
          <meshStandardMaterial color={BRASS} metalness={0.65} roughness={0.3} />
        </mesh>
      ))}
    </group>
  )
}

function Legs() {
  const posts = [
    [-1.15, 0.45],
    [0.35, 0.45],
    [-1.15, -0.25],
    [0.85, -0.05],
  ] as const
  return (
    <group>
      {posts.map(([x, z], i) => (
        <group key={i} position={[x, -0.35, z]}>
          <mesh>
            <cylinderGeometry args={[0.045, 0.06, 0.7, 10]} />
            <meshStandardMaterial color={WOOD} metalness={0.08} roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.38, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.04, 12]} />
            <meshStandardMaterial color={WOOD_EDGE} metalness={0.1} roughness={0.65} />
          </mesh>
          <mesh position={[0, 0.34, 0]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshStandardMaterial color={BRASS} metalness={0.55} roughness={0.35} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Piano() {
  const body = useGrandBodyGeometry()
  return (
    <SoftFloat>
      <group position={[0, -0.05, 0]} scale={0.95}>
        {/* Case */}
        <mesh geometry={body}>
          <meshStandardMaterial color={WOOD} metalness={0.1} roughness={0.55} />
        </mesh>
        {/* Closed lid plane */}
        <mesh position={[0.05, 0.445, -0.05]} rotation={[0.02, 0, 0]}>
          <boxGeometry args={[3.05, 0.035, 1.15]} />
          <meshStandardMaterial color={WOOD_LIGHT} metalness={0.12} roughness={0.48} />
        </mesh>
        {/* Lid edge gold line */}
        <mesh position={[0.05, 0.465, 0.5]}>
          <boxGeometry args={[2.7, 0.008, 0.02]} />
          <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.35} />
        </mesh>

        <Keyboard />
        <MusicStand />
        <Pedals />
        <Legs />

        {/* Bench */}
        <group position={[-0.2, -0.42, 1.35]}>
          <mesh position={[0, 0.28, 0]}>
            <boxGeometry args={[0.85, 0.07, 0.32]} />
            <meshStandardMaterial color={WOOD} metalness={0.08} roughness={0.65} />
          </mesh>
          {[-0.32, 0.32].map((x) =>
            [-0.1, 0.1].map((z) => (
              <mesh key={`${x}-${z}`} position={[x, 0, z]}>
                <cylinderGeometry args={[0.03, 0.035, 0.5, 8]} />
                <meshStandardMaterial color={WOOD_EDGE} metalness={0.08} roughness={0.7} />
              </mesh>
            )),
          )}
        </group>
      </group>
    </SoftFloat>
  )
}

function WarmShadow() {
  const texture = useMemo(() => {
    const size = 256
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    grad.addColorStop(0, 'rgba(58, 36, 22, 0.35)')
    grad.addColorStop(0.55, 'rgba(58, 36, 22, 0.14)')
    grad.addColorStop(1, 'rgba(58, 36, 22, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])
  return (
    <mesh position={[0, -0.92, 0.2]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[6, 5]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  )
}

function Scene() {
  return (
    <>
      <InvalidateOnSettle />
      <ambientLight intensity={0.55} color="#FFF6E8" />
      <directionalLight position={[5, 8, 4]} intensity={1.35} color="#FFEFD6" />
      <directionalLight position={[-4, 3, 2]} intensity={0.4} color="#EBDFC6" />
      <directionalLight position={[0, 2, 6]} intensity={0.35} color={GOLD} />
      <Piano />
      <WarmShadow />
      <Environment preset="apartment" />
    </>
  )
}

export function Piano3D({ className }: { className?: string }) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: 'min(460px, 62vw)',
        minHeight: 320,
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
          camera={{ position: [2.8, 2.2, 4.6], fov: 34 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  )
}
