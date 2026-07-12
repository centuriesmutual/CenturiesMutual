'use client'

import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

const GOLD = '#C9A53E'

/* Warm travertine palette — all trim unified to one tan */
const TIER_COLORS = ['#D8CBAE', '#CFC0A0', '#C4B492']
const CORNICE = '#C8B48D'
const ATTIC = '#DDD2B8'
const ARENA = '#D4C4A0'
const SEATS = '#D8CBAE'
const SHADOWED = '#B8A47A'
/* Warm interior — lighter so the bowl reads clearly */
const INTERIOR = '#B89F74'

/** Renders once (frameloop="demand"); nudge a few extra frames while assets settle. */
function InvalidateOnSettle() {
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    invalidate()
    const ids = [150, 400, 900, 1600].map((ms) => window.setTimeout(() => invalidate(), ms))
    return () => ids.forEach((id) => window.clearTimeout(id))
  }, [invalidate])
  return null
}

/** Wall segment with a real arched opening, extruded — the building block of each arcade. */
function useArchGeometry(width: number, height: number, depth: number) {
  return useMemo(() => {
    const archW = width * 0.5
    const archR = archW / 2
    const springY = height * 0.6

    const shape = new THREE.Shape()
    shape.moveTo(-width / 2, 0)
    shape.lineTo(width / 2, 0)
    shape.lineTo(width / 2, height)
    shape.lineTo(-width / 2, height)
    shape.closePath()

    const hole = new THREE.Path()
    hole.moveTo(-archR, 0)
    hole.lineTo(-archR, springY)
    hole.absarc(0, springY, archR, Math.PI, 0, true)
    hole.lineTo(archR, 0)
    hole.closePath()
    shape.holes.push(hole)

    const geom = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false })
    geom.translate(0, 0, -depth / 2)
    geom.computeVertexNormals()
    return geom
  }, [width, height, depth])
}

function ArcadeTier({
  radius,
  y,
  height,
  color,
  segments = 26,
  pilasters = true,
}: {
  radius: number
  y: number
  height: number
  color: string
  segments?: number
  pilasters?: boolean
}) {
  const segAngle = (Math.PI * 2) / segments
  const chord = 2 * radius * Math.tan(segAngle / 2) * 1.05
  const geom = useArchGeometry(chord, height, 0.24)
  const material = useMemo(
    () => new THREE.MeshStandardMaterial({ color, metalness: 0.04, roughness: 0.82 }),
    [color],
  )
  const pilasterMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: CORNICE, metalness: 0.05, roughness: 0.78 }),
    [],
  )

  const keystoneY = height * 0.6 + (chord * 0.5) / 2 - 0.01

  const items = useMemo(
    () =>
      Array.from({ length: segments }, (_, i) => {
        const a = (i + 0.5) * segAngle
        const b = i * segAngle
        return {
          x: Math.cos(a) * radius,
          z: Math.sin(a) * radius,
          rotY: Math.PI / 2 - a,
          kx: Math.cos(a) * (radius + 0.015),
          kz: Math.sin(a) * (radius + 0.015),
          px: Math.cos(b) * (radius + 0.02),
          pz: Math.sin(b) * (radius + 0.02),
          protY: Math.PI / 2 - b,
        }
      }),
    [segments, segAngle, radius],
  )

  return (
    <group position={[0, y, 0]}>
      {items.map((p, i) => (
        <mesh
          key={`w-${i}`}
          geometry={geom}
          material={material}
          position={[p.x, 0, p.z]}
          rotation={[0, p.rotY, 0]}
        />
      ))}
      {items.map((p, i) => (
        <mesh
          key={`k-${i}`}
          material={pilasterMat}
          position={[p.kx, keystoneY, p.kz]}
          rotation={[0, p.rotY, 0]}
        >
          <boxGeometry args={[0.055, 0.1, 0.06]} />
        </mesh>
      ))}
      {pilasters &&
        items.map((p, i) => (
          <mesh
            key={`p-${i}`}
            material={pilasterMat}
            position={[p.px, height / 2, p.pz]}
            rotation={[0, p.protY, 0]}
          >
            <boxGeometry args={[0.075, height, 0.07]} />
          </mesh>
        ))}
    </group>
  )
}

function Cornice({ radius, y, tube = 0.055 }: { radius: number; y: number; tube?: number }) {
  return (
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, tube, 10, 96]} />
      <meshStandardMaterial color={CORNICE} metalness={0.06} roughness={0.72} />
    </mesh>
  )
}

/** Attic story — full solid top band with pilaster rhythm and small square windows. */
function AtticBand({ radius, y, height }: { radius: number; y: number; height: number }) {
  const n = 26
  const decorations = useMemo(
    () =>
      Array.from({ length: n }, (_, i) => {
        const pa = (i / n) * Math.PI * 2
        const wa = ((i + 0.5) / n) * Math.PI * 2
        return {
          px: Math.cos(pa) * (radius + 0.02),
          pz: Math.sin(pa) * (radius + 0.02),
          protY: Math.PI / 2 - pa,
          wx: Math.cos(wa) * (radius + 0.01),
          wz: Math.sin(wa) * (radius + 0.01),
          wrotY: Math.PI / 2 - wa,
          hasWindow: i % 2 === 0,
        }
      }),
    [radius],
  )

  return (
    <group position={[0, y, 0]}>
      <mesh>
        <cylinderGeometry args={[radius, radius, height, 96, 1, true]} />
        <meshStandardMaterial color={ATTIC} metalness={0.04} roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
      {decorations.map((d, i) => (
        <group key={i}>
          <mesh position={[d.px, 0, d.pz]} rotation={[0, d.protY, 0]}>
            <boxGeometry args={[0.08, height, 0.06]} />
            <meshStandardMaterial color={CORNICE} metalness={0.05} roughness={0.8} />
          </mesh>
          {d.hasWindow && (
            <mesh position={[d.wx, 0.02, d.wz]} rotation={[0, d.wrotY, 0]}>
              <boxGeometry args={[0.11, 0.14, 0.05]} />
              <meshStandardMaterial color={SHADOWED} metalness={0.03} roughness={0.9} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  )
}

/** Warm tan grounding shadow — radial gradient, never gray. */
function WarmShadow({ y, radius }: { y: number; radius: number }) {
  const texture = useMemo(() => {
    const size = 256
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    grad.addColorStop(0, 'rgba(148, 122, 74, 0.42)')
    grad.addColorStop(0.55, 'rgba(160, 136, 90, 0.24)')
    grad.addColorStop(1, 'rgba(170, 148, 104, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])
  return (
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[radius * 2, radius * 2]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  )
}

/** Gold finials around the crown — evenly spaced masts with gilded tips. */
function CrownFinials({ radius, y }: { radius: number; y: number }) {
  const n = 13
  const posts = useMemo(
    () =>
      Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2
        return { x: Math.cos(a) * radius, z: Math.sin(a) * radius }
      }),
    [radius],
  )
  return (
    <group position={[0, y, 0]}>
      {posts.map((p, i) => (
        <group key={i} position={[p.x, 0, p.z]}>
          <mesh position={[0, 0.09, 0]}>
            <cylinderGeometry args={[0.012, 0.016, 0.18, 8]} />
            <meshStandardMaterial color={CORNICE} metalness={0.1} roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.028, 12, 12]} />
            <meshStandardMaterial color={GOLD} metalness={0.5} roughness={0.35} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/** Interior seating bowl — stepped rings, radial aisles, and vomitoria openings. */
function SeatingBowl() {
  const rings = [
    { r: 1.62, y: 0.16, h: 0.12 },
    { r: 1.48, y: 0.05, h: 0.12 },
    { r: 1.34, y: -0.06, h: 0.12 },
    { r: 1.2, y: -0.17, h: 0.12 },
    { r: 1.06, y: -0.28, h: 0.12 },
    { r: 0.92, y: -0.39, h: 0.12 },
  ]

  /* Radial stair aisles cutting down through the seating */
  const aisleCount = 10
  const aisles = useMemo(
    () =>
      Array.from({ length: aisleCount }, (_, i) => {
        const a = (i / aisleCount) * Math.PI * 2 + 0.12
        return { a, x: Math.cos(a), z: Math.sin(a) }
      }),
    [],
  )

  /* Dark vomitoria (tunnel mouths) at the top of the bowl */
  const vomCount = 10
  const voms = useMemo(
    () =>
      Array.from({ length: vomCount }, (_, i) => {
        const a = ((i + 0.5) / vomCount) * Math.PI * 2 + 0.12
        return { x: Math.cos(a) * 1.66, z: Math.sin(a) * 1.66, rotY: Math.PI / 2 - a }
      }),
    [],
  )

  return (
    <group>
      {rings.map((ring, i) => (
        <mesh key={i} position={[0, ring.y, 0]}>
          <cylinderGeometry args={[ring.r, ring.r + 0.1, ring.h, 72]} />
          <meshStandardMaterial color={SEATS} metalness={0.04} roughness={0.85} />
        </mesh>
      ))}

      {/* Radial aisles — darker tan strips descending the bowl */}
      {aisles.map((p, i) => {
        const midR = 1.28
        return (
          <mesh
            key={`aisle-${i}`}
            position={[p.x * midR, -0.1, p.z * midR]}
            rotation={[0, -p.a, -0.62]}
          >
            <boxGeometry args={[0.78, 0.015, 0.09]} />
            <meshStandardMaterial color={INTERIOR} metalness={0.03} roughness={0.9} />
          </mesh>
        )
      })}

      {/* Vomitoria — shaded tunnel mouths at the bowl rim */}
      {voms.map((p, i) => (
        <mesh key={`vom-${i}`} position={[p.x, 0.26, p.z]} rotation={[0, p.rotY, 0]}>
          <boxGeometry args={[0.14, 0.1, 0.06]} />
          <meshStandardMaterial color="#9A8258" metalness={0.02} roughness={0.95} />
        </mesh>
      ))}

      {/* Podium wall around the arena — casts a reading of depth at the base */}
      <mesh position={[0, -0.38, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.12, 64, 1, true]} />
        <meshStandardMaterial color={INTERIOR} metalness={0.03} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>

      {/* Arena floor with center detail */}
      <mesh position={[0, -0.44, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.88, 56]} />
        <meshStandardMaterial color={ARENA} metalness={0.03} roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.435, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.52, 0.56, 48]} />
        <meshStandardMaterial color={CORNICE} metalness={0.04} roughness={0.85} />
      </mesh>
      <mesh position={[0, -0.43, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.16, 32]} />
        <meshStandardMaterial color={GOLD} metalness={0.35} roughness={0.5} />
      </mesh>
    </group>
  )
}

/** Formal entry plaza — steps and flanking obelisk pair for a finished composition. */
function EntryPlaza() {
  return (
    <group position={[0, -0.62, 2.15]}>
      {/* Steps */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, i * 0.055, -i * 0.14]}>
          <boxGeometry args={[1.5 - i * 0.18, 0.055, 0.32]} />
          <meshStandardMaterial color={TIER_COLORS[0]} metalness={0.03} roughness={0.88} />
        </mesh>
      ))}
      {/* Flanking obelisks */}
      {[-0.95, 0.95].map((x) => (
        <group key={x} position={[x, 0, 0.1]}>
          <mesh position={[0, 0.16, 0]}>
            <boxGeometry args={[0.16, 0.1, 0.16]} />
            <meshStandardMaterial color={CORNICE} metalness={0.04} roughness={0.82} />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.035, 0.06, 0.6, 4]} />
            <meshStandardMaterial color={ATTIC} metalness={0.04} roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.85, 0]}>
            <coneGeometry args={[0.05, 0.1, 4]} />
            <meshStandardMaterial color={GOLD} metalness={0.4} roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Colosseum() {
  const groupRef = useRef<THREE.Group>(null)
  const invalidate = useThree((s) => s.invalidate)

  /* Enable self-shadowing on every mesh so arches, cornices, and the bowl
     carry real depth instead of flat unshaded fills. */
  useEffect(() => {
    groupRef.current?.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true
        obj.receiveShadow = true
      }
    })
    invalidate()
  }, [invalidate])

  return (
    <group ref={groupRef} position={[0, -0.12, 0]} rotation={[0.05, 0.5, 0]} scale={0.84}>
      {/* Ground plinth — warm tan, no gray */}
      <mesh position={[0, -0.66, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[3.0, 72]} />
        <meshStandardMaterial color="#E9DAB2" metalness={0.02} roughness={0.95} />
      </mesh>
      <WarmShadow y={-0.652} radius={2.7} />
      <mesh position={[0, -0.62, 0]}>
        <cylinderGeometry args={[2.35, 2.42, 0.08, 72]} />
        <meshStandardMaterial color="#D9C89D" metalness={0.03} roughness={0.9} />
      </mesh>

      {/* Inner backing walls — arches open onto deep shaded stone, not the page background */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[1.75, 1.75, 1.16, 72, 1, true]} />
        <meshStandardMaterial color="#C4AE88" metalness={0.03} roughness={0.94} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.84, 0]}>
        <cylinderGeometry args={[1.79, 1.79, 0.52, 72, 1, true]} />
        <meshStandardMaterial color="#C4AE88" metalness={0.03} roughness={0.94} side={THREE.DoubleSide} />
      </mesh>

      {/* Complete outer wall — three arcaded stories + attic, full circumference */}
      <ArcadeTier radius={1.98} y={-0.58} height={0.56} color={TIER_COLORS[0]} />
      <Cornice radius={2.01} y={0.005} />
      <ArcadeTier radius={1.96} y={0.03} height={0.52} color={TIER_COLORS[1]} />
      <Cornice radius={1.99} y={0.575} />
      <ArcadeTier radius={1.94} y={0.6} height={0.48} color={TIER_COLORS[2]} />
      <Cornice radius={1.97} y={1.105} />
      <AtticBand radius={1.93} y={1.3} height={0.36} />
      <Cornice radius={1.96} y={1.49} tube={0.06} />
      <CrownFinials radius={1.93} y={1.52} />

      <SeatingBowl />
      <EntryPlaza />
    </group>
  )
}

function Scene() {
  return (
    <>
      <InvalidateOnSettle />
      {/* Bright warm key so the interior bowl stays readable */}
      <ambientLight intensity={0.62} color="#FFF6E8" />
      <directionalLight
        position={[6, 9, 5]}
        intensity={1.45}
        color="#FFEFD6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-camera-near={1}
        shadow-camera-far={25}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-5, 3, -4]} intensity={0.45} color="#EBDFC6" />
      <directionalLight position={[0, 4, 0]} intensity={0.55} color="#FFF2D8" />
      <directionalLight position={[0, 2, 7]} intensity={0.3} color={GOLD} />
      <Colosseum />
      <ContactShadows
        position={[0, -0.98, 0]}
        opacity={0.28}
        scale={12}
        blur={2.6}
        far={5}
        color="#7A6540"
      />
      <Environment preset="sunset" />
    </>
  )
}

export function Colosseum3D({ className }: { className?: string }) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: 'min(420px, 70vw)',
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
          frameloop="demand"
          shadows="soft"
          camera={{ position: [0, 1.85, 8.4], fov: 34 }}
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
