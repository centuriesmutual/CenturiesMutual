'use client'

import { Suspense, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'

const GOLD = '#C9A53E'
const BLACK_GLOSS = '#101010'
const BLACK_SOFT = '#1A1A1A'
const BLACK_DEEP = '#0A0A0A'
const IVORY = '#F4EEE4'
const EBONY = '#141210'
const FELT = '#7A1F2B'

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
    ref.current.rotation.y = -0.6 + Math.sin(t * 0.12) * 0.018
  })
  return <group ref={ref}>{children}</group>
}

/**
 * Grand piano plan silhouette. Front (keyboard) edge at z = 0, straight bass
 * side on the left, treble side curving in to a rounded tail at z ≈ -2.2.
 */
function useGrandShape() {
  return useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-1.0, 0)
    s.lineTo(1.0, 0)
    s.lineTo(1.0, 0.7)
    s.quadraticCurveTo(1.02, 1.65, 0.25, 2.0)
    s.quadraticCurveTo(-0.55, 2.3, -1.0, 1.45)
    s.lineTo(-1.0, 0)
    s.closePath()
    return s
  }, [])
}

function useCaseGeometry(shape: THREE.Shape) {
  return useMemo(() => {
    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 0.34,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.015,
      bevelSegments: 2,
      curveSegments: 24,
    })
    // Lay flat: shape XY plane -> XZ plane, extrusion becomes height
    geom.rotateX(-Math.PI / 2)
    geom.computeVertexNormals()
    return geom
  }, [shape])
}

function useLidGeometry(shape: THREE.Shape) {
  return useMemo(() => {
    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 0.04,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.008,
      bevelSegments: 1,
      curveSegments: 24,
    })
    geom.rotateX(-Math.PI / 2)
    geom.computeVertexNormals()
    return geom
  }, [shape])
}

const glossBlack = new THREE.MeshStandardMaterial({
  color: BLACK_GLOSS,
  metalness: 0.35,
  roughness: 0.22,
})
const softBlack = new THREE.MeshStandardMaterial({
  color: BLACK_SOFT,
  metalness: 0.2,
  roughness: 0.45,
})
const deepBlack = new THREE.MeshStandardMaterial({
  color: BLACK_DEEP,
  metalness: 0.25,
  roughness: 0.35,
})
const brass = new THREE.MeshStandardMaterial({
  color: GOLD,
  metalness: 0.65,
  roughness: 0.28,
})

function Keyboard() {
  const whiteKeys = useMemo(() => {
    const count = 29
    const width = 1.76
    const keyW = width / count
    return Array.from({ length: count }, (_, i) => ({
      x: -width / 2 + keyW / 2 + i * keyW,
      w: keyW * 0.94,
      i,
    }))
  }, [])

  const blackKeys = useMemo(() => {
    const count = 29
    const width = 1.76
    const keyW = width / count
    const pattern = [0, 1, 3, 4, 5] // C# D# F# G# A# offsets within an octave
    const keys: { x: number }[] = []
    for (let oct = 0; oct < 5; oct++) {
      for (const p of pattern) {
        const idx = oct * 7 + p
        if (idx >= count - 1) continue
        keys.push({ x: -width / 2 + keyW + idx * keyW })
      }
    }
    return keys
  }, [])

  return (
    <group position={[0, 0.85, 0.14]}>
      {/* Key bed extending forward of the case */}
      <mesh material={deepBlack} position={[0, -0.045, 0]}>
        <boxGeometry args={[2.0, 0.07, 0.34]} />
      </mesh>
      {/* Cheek blocks at both ends */}
      {[-0.94, 0.94].map((x) => (
        <mesh key={x} material={glossBlack} position={[x, 0.015, 0]}>
          <boxGeometry args={[0.11, 0.06, 0.34]} />
        </mesh>
      ))}
      {/* Felt strip behind keys */}
      <mesh position={[0, 0.015, -0.155]}>
        <boxGeometry args={[1.76, 0.012, 0.03]} />
        <meshStandardMaterial color={FELT} metalness={0.05} roughness={0.85} />
      </mesh>
      {whiteKeys.map((k) => (
        <mesh key={`w-${k.i}`} position={[k.x, 0, 0.02]}>
          <boxGeometry args={[k.w, 0.028, 0.3]} />
          <meshStandardMaterial color={IVORY} metalness={0.04} roughness={0.4} />
        </mesh>
      ))}
      {blackKeys.map((k, i) => (
        <mesh key={`b-${i}`} position={[k.x, 0.024, -0.045]}>
          <boxGeometry args={[0.034, 0.032, 0.19]} />
          <meshStandardMaterial color={EBONY} metalness={0.25} roughness={0.3} />
        </mesh>
      ))}
      {/* Fallboard raised behind the keys with gold maker line */}
      <mesh material={glossBlack} position={[0, 0.075, -0.19]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[1.98, 0.12, 0.03]} />
      </mesh>
      <mesh material={brass} position={[0, 0.075, -0.172]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[0.5, 0.008, 0.032]} />
      </mesh>
    </group>
  )
}

function Legs() {
  // Two front legs under the keyboard corners, one rear leg under the tail
  const spots: ReadonlyArray<[number, number]> = [
    [-0.82, -0.18],
    [0.82, -0.18],
    [-0.3, -1.85],
  ]
  return (
    <group>
      {spots.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          {/* Tapered leg from case bottom to floor */}
          <mesh material={glossBlack} position={[0, 0.28, 0]}>
            <cylinderGeometry args={[0.055, 0.075, 0.56, 12]} />
          </mesh>
          {/* Brass caster */}
          <mesh material={brass} position={[0, 0.025, 0]}>
            <cylinderGeometry args={[0.05, 0.055, 0.05, 12]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function PedalLyre() {
  return (
    <group position={[0, 0, -0.28]}>
      {/* Twin posts down from the case */}
      {[-0.09, 0.09].map((x) => (
        <mesh key={x} material={glossBlack} position={[x, 0.32, 0]} rotation={[0.08, 0, 0]}>
          <boxGeometry args={[0.045, 0.5, 0.045]} />
        </mesh>
      ))}
      {/* Pedal box */}
      <mesh material={deepBlack} position={[0, 0.09, 0.03]}>
        <boxGeometry args={[0.4, 0.07, 0.14]} />
      </mesh>
      {/* Three brass pedals */}
      {[-0.11, 0, 0.11].map((x) => (
        <mesh key={x} material={brass} position={[x, 0.055, 0.115]} rotation={[0.35, 0, 0]}>
          <boxGeometry args={[0.05, 0.014, 0.11]} />
        </mesh>
      ))}
    </group>
  )
}

function Bench() {
  return (
    <group position={[0, 0, 0.78]}>
      <mesh material={glossBlack} position={[0, 0.42, 0]}>
        <boxGeometry args={[0.9, 0.07, 0.34]} />
      </mesh>
      {/* Seat cushion hint */}
      <mesh material={softBlack} position={[0, 0.465, 0]}>
        <boxGeometry args={[0.86, 0.025, 0.3]} />
      </mesh>
      {[-0.38, 0.38].map((x) =>
        [-0.12, 0.12].map((z) => (
          <mesh key={`${x}-${z}`} material={glossBlack} position={[x, 0.2, z]}>
            <cylinderGeometry args={[0.028, 0.038, 0.4, 10]} />
          </mesh>
        )),
      )}
    </group>
  )
}

function Piano() {
  const shape = useGrandShape()
  const caseGeom = useCaseGeometry(shape)
  const lidGeom = useLidGeometry(shape)

  return (
    <SoftFloat>
      {/* Body spans z 0..-2.3; shift so the whole piano sits centered */}
      <group position={[0.1, -0.72, 0.62]} scale={0.92}>
        {/* Case — shape extrudes upward from y=0.52, tail already at -z */}
        <mesh geometry={caseGeom} material={glossBlack} position={[0, 0.52, 0]} />

        {/* Gold pinstripe around the case top edge (front) */}
        <mesh material={brass} position={[0, 0.845, 0.005]}>
          <boxGeometry args={[1.96, 0.006, 0.012]} />
        </mesh>

        {/* Raised lid — hinged on the straight bass (left) side */}
        <group position={[-1.0, 0.9, 0]} rotation={[0, 0, 0.5]}>
          <mesh geometry={lidGeom} material={glossBlack} position={[1.0, 0, 0]} scale={[0.985, 1, 0.985]} />
        </group>

        {/* Lid prop stick from inside the rim to the lid */}
        <mesh material={brass} position={[0.32, 1.2, -0.9]} rotation={[0, 0, -0.25]}>
          <cylinderGeometry args={[0.012, 0.012, 0.75, 8]} />
        </mesh>

        <Keyboard />
        <Legs />
        <PedalLyre />
        <Bench />
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
    grad.addColorStop(0, 'rgba(20, 18, 16, 0.32)')
    grad.addColorStop(0.55, 'rgba(20, 18, 16, 0.13)')
    grad.addColorStop(1, 'rgba(20, 18, 16, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])
  return (
    <mesh position={[0, -0.74, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[6.4, 5.2]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  )
}

function Scene() {
  return (
    <>
      <InvalidateOnSettle />
      <ambientLight intensity={0.6} color="#FFF6E8" />
      <directionalLight position={[5, 8, 4]} intensity={1.4} color="#FFEFD6" />
      <directionalLight position={[-5, 4, 3]} intensity={0.5} color="#EBDFC6" />
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
          camera={{ position: [2.6, 1.9, 4.8], fov: 34 }}
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
