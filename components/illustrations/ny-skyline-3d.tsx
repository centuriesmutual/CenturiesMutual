'use client'

import { Suspense, useEffect, useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'

/* Night palette — deep Centuries Mutual greens with warm gold light */
const BG = '#0B1D13'
const GOLD = '#C9A53E'
const WINDOW_WARM = '#F2D488'
const WINDOW_DEEP = '#E0B85C'
const FACADES = ['#12291B', '#0F2317', '#16301F', '#0D1F14', '#182F20', '#101F16']
const STREET = '#132720'
const GROUND = '#0A1A11'

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

/** Deterministic PRNG so the lit-window pattern is stable per building. */
function makeRand(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/** Two canvas textures per facade: color map + emissive map (lit windows only). */
function useWindowTextures(base: string, cols: number, rows: number, litRatio: number, seed: number) {
  return useMemo(() => {
    const cell = 16
    const w = cols * cell
    const h = rows * cell

    const colorCanvas = document.createElement('canvas')
    colorCanvas.width = w
    colorCanvas.height = h
    const cctx = colorCanvas.getContext('2d')!
    cctx.fillStyle = base
    cctx.fillRect(0, 0, w, h)

    const emissiveCanvas = document.createElement('canvas')
    emissiveCanvas.width = w
    emissiveCanvas.height = h
    const ectx = emissiveCanvas.getContext('2d')!
    ectx.fillStyle = '#000000'
    ectx.fillRect(0, 0, w, h)

    const rand = makeRand(seed)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cell + 4
        const y = r * cell + 3
        if (rand() < litRatio) {
          const shade = rand() < 0.45 ? WINDOW_WARM : WINDOW_DEEP
          cctx.fillStyle = shade
          cctx.fillRect(x, y, 8, 10)
          ectx.fillStyle = shade
          ectx.fillRect(x, y, 8, 10)
        } else {
          cctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
          cctx.fillRect(x, y, 8, 10)
        }
      }
    }

    const map = new THREE.CanvasTexture(colorCanvas)
    map.colorSpace = THREE.SRGBColorSpace
    map.anisotropy = 4
    const emissiveMap = new THREE.CanvasTexture(emissiveCanvas)
    emissiveMap.colorSpace = THREE.SRGBColorSpace
    emissiveMap.anisotropy = 4
    return { map, emissiveMap }
  }, [base, cols, rows, litRatio, seed])
}

type RoofKind = 'water' | 'antenna' | 'boxes' | 'none'

/** Rooftop clutter — water tanks, HVAC boxes, antennas with beacons. */
function RoofDetails({ kind, w, d }: { kind: RoofKind; w: number; d: number }) {
  if (kind === 'none') return null
  return (
    <group>
      {kind === 'water' && (
        <group position={[w * 0.2, 0, -d * 0.15]}>
          {/* Legs + tank + conical lid */}
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 0.1, 4]} />
            <meshStandardMaterial color="#1E3527" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.16, 0]}>
            <cylinderGeometry args={[0.055, 0.06, 0.14, 10]} />
            <meshStandardMaterial color="#24402F" roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.26, 0]}>
            <coneGeometry args={[0.062, 0.06, 10]} />
            <meshStandardMaterial color="#1B3325" roughness={0.85} />
          </mesh>
        </group>
      )}
      {kind === 'antenna' && (
        <group position={[0, 0, 0]}>
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.006, 0.012, 0.28, 6]} />
            <meshStandardMaterial color="#2A4634" metalness={0.3} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.014, 8, 8]} />
            <meshBasicMaterial color="#E06A4E" />
          </mesh>
        </group>
      )}
      {kind === 'boxes' && (
        <group>
          <mesh position={[-w * 0.18, 0.035, d * 0.1]}>
            <boxGeometry args={[0.1, 0.07, 0.08]} />
            <meshStandardMaterial color="#1E3527" roughness={0.9} />
          </mesh>
          <mesh position={[w * 0.15, 0.025, -d * 0.12]}>
            <boxGeometry args={[0.07, 0.05, 0.07]} />
            <meshStandardMaterial color="#24402F" roughness={0.9} />
          </mesh>
        </group>
      )}
    </group>
  )
}

/** Generic tower — box with glowing windowed side faces, dark roof, parapet. */
function Tower({
  position,
  w,
  h,
  d,
  color,
  seed,
  lit = 0.42,
  roof = 'none',
}: {
  position: [number, number, number]
  w: number
  h: number
  d: number
  color: string
  seed: number
  lit?: number
  roof?: RoofKind
}) {
  const cols = Math.max(3, Math.round(w * 10))
  const rows = Math.max(5, Math.round(h * 10))
  const { map, emissiveMap } = useWindowTextures(color, cols, rows, lit, seed)
  const materials = useMemo(() => {
    const side = new THREE.MeshStandardMaterial({
      map,
      emissiveMap,
      emissive: new THREE.Color('#FFE3A1'),
      emissiveIntensity: 0.9,
      metalness: 0.08,
      roughness: 0.8,
    })
    const roofColor = new THREE.Color(color).multiplyScalar(0.6)
    const roofMat = new THREE.MeshStandardMaterial({ color: roofColor, roughness: 0.92 })
    return [side, side, roofMat, roofMat, side, side]
  }, [map, emissiveMap, color])

  return (
    <group position={position}>
      <mesh position={[0, h / 2, 0]} material={materials}>
        <boxGeometry args={[w, h, d]} />
      </mesh>
      {/* Parapet lip catches light along the roofline */}
      <mesh position={[0, h + 0.012, 0]}>
        <boxGeometry args={[w + 0.02, 0.024, d + 0.02]} />
        <meshStandardMaterial color="#2C4936" metalness={0.15} roughness={0.7} />
      </mesh>
      <group position={[0, h + 0.024, 0]}>
        <RoofDetails kind={roof} w={w} d={d} />
      </group>
    </group>
  )
}

/** Empire State Building — stepped setbacks, lit crown, mast with beacon. */
function EmpireState({ position }: { position: [number, number, number] }) {
  const color = FACADES[1]
  return (
    <group position={position}>
      <Tower position={[0, 0, 0]} w={1.05} h={1.15} d={1.05} color={color} seed={101} lit={0.45} />
      <Tower position={[0, 1.17, 0]} w={0.8} h={1.0} d={0.8} color={color} seed={102} lit={0.42} />
      <Tower position={[0, 2.19, 0]} w={0.58} h={0.75} d={0.58} color={color} seed={103} lit={0.42} />
      <Tower position={[0, 2.96, 0]} w={0.38} h={0.3} d={0.38} color={color} seed={104} lit={0.55} />
      {/* Lit crown */}
      <mesh position={[0, 3.4, 0]}>
        <cylinderGeometry args={[0.07, 0.16, 0.2, 12]} />
        <meshStandardMaterial
          color="#3A5240"
          emissive={GOLD}
          emissiveIntensity={0.55}
          metalness={0.2}
          roughness={0.5}
        />
      </mesh>
      <mesh position={[0, 3.72, 0]}>
        <cylinderGeometry args={[0.014, 0.03, 0.5, 8]} />
        <meshStandardMaterial color="#2A4634" metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0, 4.0, 0]}>
        <sphereGeometry args={[0.022, 10, 10]} />
        <meshBasicMaterial color="#E06A4E" />
      </mesh>
    </group>
  )
}

/** Chrysler Building — dark tower, glowing gilded tiered crown, needle. */
function Chrysler({ position }: { position: [number, number, number] }) {
  const color = FACADES[4]
  const crown = [
    { r: 0.26, h: 0.14 },
    { r: 0.21, h: 0.13 },
    { r: 0.16, h: 0.12 },
    { r: 0.115, h: 0.11 },
    { r: 0.075, h: 0.1 },
    { r: 0.04, h: 0.09 },
  ]
  let cy = 0
  const tiers = crown.map((t) => {
    const y = cy + t.h / 2
    cy += t.h * 0.82
    return { ...t, y }
  })
  return (
    <group position={position}>
      <Tower position={[0, 0, 0]} w={0.62} h={2.05} d={0.62} color={color} seed={201} lit={0.45} />
      <group position={[0, 2.08, 0]}>
        {tiers.map((t, i) => (
          <mesh key={i} position={[0, t.y, 0]}>
            <cylinderGeometry args={[t.r * 0.72, t.r, t.h, 20]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#8C7434' : '#6E5A26'}
              emissive={i % 2 === 0 ? WINDOW_WARM : GOLD}
              emissiveIntensity={0.45}
              metalness={0.5}
              roughness={0.35}
            />
          </mesh>
        ))}
        <mesh position={[0, cy + 0.2, 0]}>
          <coneGeometry args={[0.018, 0.42, 8]} />
          <meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={0.35} metalness={0.5} roughness={0.3} />
        </mesh>
      </group>
    </group>
  )
}

/** One World Trade — tapered dark glass with a lit spire beacon. */
function OneWTC({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.11, 0]}>
        <boxGeometry args={[0.62, 0.22, 0.62]} />
        <meshStandardMaterial color={FACADES[2]} metalness={0.1} roughness={0.75} />
      </mesh>
      <mesh position={[0, 1.62, 0]} rotation={[0, Math.PI / 4, 0]}>
        <cylinderGeometry args={[0.26, 0.44, 2.8, 4]} />
        <meshStandardMaterial color="#163523" metalness={0.6} roughness={0.25} />
      </mesh>
      {/* Lit crown band */}
      <mesh position={[0, 3.02, 0]} rotation={[0, Math.PI / 4, 0]}>
        <cylinderGeometry args={[0.245, 0.26, 0.07, 4]} />
        <meshStandardMaterial color="#3A5240" emissive={WINDOW_WARM} emissiveIntensity={0.6} roughness={0.5} />
      </mesh>
      <mesh position={[0, 3.5, 0]}>
        <cylinderGeometry args={[0.008, 0.026, 0.8, 8]} />
        <meshStandardMaterial color="#2A4634" metalness={0.35} roughness={0.45} />
      </mesh>
      <mesh position={[0, 3.92, 0]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshBasicMaterial color={WINDOW_WARM} />
      </mesh>
    </group>
  )
}

/** Street with moving-traffic light dots — gold headlights, red taillights. */
function Street({
  z,
  length = 11,
  seed,
}: {
  z: number
  length?: number
  seed: number
}) {
  const cars = useMemo(() => {
    const rand = makeRand(seed)
    return Array.from({ length: 26 }, () => ({
      x: (rand() - 0.5) * length,
      lane: rand() < 0.5 ? -0.06 : 0.06,
      red: rand() < 0.45,
    }))
  }, [seed, length])

  return (
    <group position={[0, 0.005, z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[length, 0.34]} />
        <meshStandardMaterial color={STREET} roughness={0.9} />
      </mesh>
      {/* Lane line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <planeGeometry args={[length, 0.008]} />
        <meshBasicMaterial color="#2E4A38" />
      </mesh>
      {cars.map((c, i) => (
        <mesh key={i} position={[c.x, 0.012, c.lane]}>
          <boxGeometry args={[0.05, 0.012, 0.02]} />
          <meshBasicMaterial color={c.red ? '#D96A4E' : '#F5DD9C'} />
        </mesh>
      ))}
    </group>
  )
}

/** Cross street running toward the camera. */
function CrossStreet({ x, seed }: { x: number; seed: number }) {
  const cars = useMemo(() => {
    const rand = makeRand(seed)
    return Array.from({ length: 10 }, () => ({
      z: rand() * 4.4 - 0.8,
      lane: rand() < 0.5 ? -0.05 : 0.05,
      red: rand() < 0.45,
    }))
  }, [seed])
  return (
    <group position={[x, 0.004, 1.4]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.3, 4.6]} />
        <meshStandardMaterial color={STREET} roughness={0.9} />
      </mesh>
      {cars.map((c, i) => (
        <mesh key={i} position={[c.lane, 0.012, c.z - 1.4]}>
          <boxGeometry args={[0.02, 0.012, 0.05]} />
          <meshBasicMaterial color={c.red ? '#D96A4E' : '#F5DD9C'} />
        </mesh>
      ))}
    </group>
  )
}

function Skyline() {
  return (
    <group position={[0, -1.35, 0]}>
      {/* Ground */}
      <mesh position={[0, 0, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16, 12]} />
        <meshStandardMaterial color={GROUND} roughness={0.95} />
      </mesh>

      {/* Far row — hazy silhouettes swallowed by fog */}
      <group position={[0, 0, -3.6]}>
        <Tower position={[-4.2, 0, 0]} w={0.6} h={1.7} d={0.5} color={FACADES[3]} seed={21} lit={0.25} />
        <Tower position={[-3.2, 0, 0.2]} w={0.5} h={2.3} d={0.45} color={FACADES[5]} seed={22} lit={0.28} />
        <Tower position={[-1.6, 0, -0.1]} w={0.55} h={1.9} d={0.5} color={FACADES[3]} seed={23} lit={0.25} />
        <Tower position={[0.2, 0, 0.1]} w={0.48} h={2.6} d={0.44} color={FACADES[5]} seed={24} lit={0.28} />
        <Tower position={[1.7, 0, -0.15]} w={0.62} h={1.6} d={0.5} color={FACADES[3]} seed={25} lit={0.25} />
        <Tower position={[3.1, 0, 0.1]} w={0.5} h={2.1} d={0.45} color={FACADES[5]} seed={26} lit={0.28} />
        <Tower position={[4.2, 0, -0.05]} w={0.56} h={1.5} d={0.48} color={FACADES[3]} seed={27} lit={0.25} />
      </group>

      {/* Back row */}
      <group position={[0, 0, -2.3]}>
        <Tower position={[-3.5, 0, 0]} w={0.55} h={1.5} d={0.5} color={FACADES[5]} seed={31} lit={0.35} roof="antenna" />
        <Tower position={[-2.6, 0, 0.2]} w={0.45} h={1.95} d={0.45} color={FACADES[0]} seed={32} lit={0.38} />
        <Tower position={[-0.65, 0, -0.1]} w={0.5} h={1.7} d={0.5} color={FACADES[5]} seed={33} lit={0.35} roof="water" />
        <Tower position={[1.25, 0, 0.1]} w={0.42} h={2.25} d={0.42} color={FACADES[0]} seed={34} lit={0.38} roof="antenna" />
        <Tower position={[2.95, 0, -0.1]} w={0.6} h={1.4} d={0.5} color={FACADES[5]} seed={35} lit={0.35} roof="boxes" />
        <Tower position={[3.8, 0, 0.15]} w={0.4} h={1.8} d={0.4} color={FACADES[0]} seed={36} lit={0.38} />
      </group>

      <Street z={-1.75} seed={71} />

      {/* Mid row — landmarks */}
      <group position={[0, 0, -1.15]}>
        <Tower position={[-3.65, 0, 0]} w={0.65} h={1.25} d={0.55} color={FACADES[3]} seed={41} lit={0.42} roof="water" />
        <EmpireState position={[-2.25, 0, 0]} />
        <Tower position={[-1.1, 0, 0.1]} w={0.55} h={1.68} d={0.5} color={FACADES[0]} seed={42} lit={0.42} roof="boxes" />
        <Chrysler position={[-0.15, 0, -0.15]} />
        <Tower position={[0.78, 0, 0.15]} w={0.5} h={1.38} d={0.45} color={FACADES[3]} seed={43} lit={0.46} roof="water" />
        <OneWTC position={[1.85, 0, 0]} />
        <Tower position={[2.9, 0, 0.1]} w={0.6} h={1.55} d={0.5} color={FACADES[1]} seed={44} lit={0.42} roof="antenna" />
        <Tower position={[3.75, 0, -0.05]} w={0.5} h={1.1} d={0.45} color={FACADES[3]} seed={45} lit={0.42} roof="boxes" />
      </group>

      <Street z={-0.5} seed={72} />

      {/* Front row — lower blocks, brightest windows */}
      <group position={[0, 0, 0.25]}>
        <Tower position={[-3.1, 0, 0]} w={0.5} h={0.62} d={0.4} color={FACADES[2]} seed={51} lit={0.55} roof="water" />
        <Tower position={[-1.6, 0, 0.05]} w={0.6} h={0.85} d={0.42} color={FACADES[4]} seed={52} lit={0.55} roof="boxes" />
        <Tower position={[-0.35, 0, -0.02]} w={0.42} h={0.5} d={0.38} color={FACADES[2]} seed={56} lit={0.55} />
        <Tower position={[0.65, 0, 0]} w={0.55} h={0.72} d={0.4} color={FACADES[2]} seed={53} lit={0.55} roof="water" />
        <Tower position={[2.45, 0, 0.05]} w={0.62} h={0.9} d={0.42} color={FACADES[4]} seed={54} lit={0.55} roof="antenna" />
        <Tower position={[3.55, 0, 0]} w={0.45} h={0.55} d={0.38} color={FACADES[2]} seed={55} lit={0.55} />
      </group>

      <Street z={0.95} seed={73} />
      <CrossStreet x={-2.7} seed={81} />
      <CrossStreet x={0.25} seed={82} />
      <CrossStreet x={3.2} seed={83} />
    </group>
  )
}

function Scene() {
  return (
    <>
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 7, 15.5]} />
      <InvalidateOnSettle />
      {/* Moonlit night — dim cool key, warm city glow from below */}
      <ambientLight intensity={0.32} color="#3C5A48" />
      <directionalLight position={[4, 8, 3]} intensity={0.5} color="#8FB39E" />
      <directionalLight position={[-5, 3, 4]} intensity={0.2} color="#6E8A79" />
      <pointLight position={[0, -0.4, 2]} intensity={0.7} distance={9} color="#E8C57A" />
      <Skyline />
      <Environment preset="night" />
    </>
  )
}

export function NySkyline3D({ className }: { className?: string }) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: 'min(380px, 72vw)',
        minHeight: 240,
        borderRadius: 20,
        overflow: 'hidden',
        background: BG,
        border: '1px solid #1E3A2B',
        boxShadow: '0 24px 60px -30px rgba(4, 18, 11, 0.55)',
      }}
    >
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center font-sans text-sm text-[#8FB39E]">
            Loading…
          </div>
        }
      >
        <Canvas
          frameloop="demand"
          camera={{ position: [0, 2.6, 8.6], fov: 35 }}
          dpr={[1, 1.75]}
          gl={{ antialias: true }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  )
}
