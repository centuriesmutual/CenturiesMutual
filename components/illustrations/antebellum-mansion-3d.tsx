'use client'

import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Environment,
  Float,
  ContactShadows,
  RoundedBox,
} from '@react-three/drei'
import * as THREE from 'three'

const IVORY = '#F4EFE4'
const IVORY_DEEP = '#E6DECF'
const SHUTTER = '#1A3A2C'
const WINDOW = '#A8D4C8'
const GOLD = '#C9A53E'
const TRIM = '#F7F3EE'
const ROOF = '#2A241C'
const BRICK = '#8B6B52'
const LAWN = '#1E4A34'

function Column({
  position,
  height = 2.35,
}: {
  position: [number, number, number]
  height?: number
}) {
  return (
    <group position={position}>
      {/* Pedestal */}
      <mesh position={[0, 0.08, 0]} castShadow>
        <boxGeometry args={[0.28, 0.16, 0.28]} />
        <meshStandardMaterial color={TRIM} roughness={0.55} metalness={0.05} />
      </mesh>
      {/* Shaft */}
      <mesh position={[0, height / 2 + 0.16, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.125, height, 20]} />
        <meshStandardMaterial color={IVORY} roughness={0.42} metalness={0.08} />
      </mesh>
      {/* Capital */}
      <mesh position={[0, height + 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.12, 0.14, 20]} />
        <meshStandardMaterial color={TRIM} roughness={0.45} metalness={0.1} />
      </mesh>
      <mesh position={[0, height + 0.32, 0]}>
        <boxGeometry args={[0.34, 0.08, 0.34]} />
        <meshStandardMaterial color={IVORY_DEEP} roughness={0.5} />
      </mesh>
    </group>
  )
}

function WindowBay({
  position,
  width = 0.38,
  height = 0.55,
  withShutters = true,
}: {
  position: [number, number, number]
  width?: number
  height?: number
  withShutters?: boolean
}) {
  const shutterW = 0.1
  return (
    <group position={position}>
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[width, height, 0.04]} />
        <meshStandardMaterial
          color={WINDOW}
          emissive="#6FAE9A"
          emissiveIntensity={0.25}
          metalness={0.2}
          roughness={0.25}
        />
      </mesh>
      {/* Mullion */}
      <mesh position={[0, 0, 0.045]}>
        <boxGeometry args={[0.03, height, 0.02]} />
        <meshStandardMaterial color={TRIM} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.045]}>
        <boxGeometry args={[width, 0.03, 0.02]} />
        <meshStandardMaterial color={TRIM} roughness={0.5} />
      </mesh>
      {/* Frame */}
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[width + 0.08, height + 0.08, 0.03]} />
        <meshStandardMaterial color={IVORY_DEEP} roughness={0.55} />
      </mesh>
      {withShutters ? (
        <>
          <mesh position={[-(width / 2 + shutterW / 2 + 0.02), 0, 0.03]}>
            <boxGeometry args={[shutterW, height + 0.04, 0.03]} />
            <meshStandardMaterial color={SHUTTER} roughness={0.6} />
          </mesh>
          <mesh position={[width / 2 + shutterW / 2 + 0.02, 0, 0.03]}>
            <boxGeometry args={[shutterW, height + 0.04, 0.03]} />
            <meshStandardMaterial color={SHUTTER} roughness={0.6} />
          </mesh>
        </>
      ) : null}
    </group>
  )
}

function Balustrade({
  width,
  position,
  z = 0.55,
}: {
  width: number
  position: [number, number, number]
  z?: number
}) {
  const count = Math.max(6, Math.round(width / 0.28))
  const posts = useMemo(() => {
    const arr: number[] = []
    for (let i = 0; i < count; i++) {
      arr.push(-width / 2 + (i / (count - 1)) * width)
    }
    return arr
  }, [count, width])

  return (
    <group position={position}>
      <mesh position={[0, 0.28, z]}>
        <boxGeometry args={[width + 0.1, 0.05, 0.08]} />
        <meshStandardMaterial color={TRIM} roughness={0.5} />
      </mesh>
      {posts.map((x) => (
        <mesh key={x} position={[x, 0.14, z]}>
          <cylinderGeometry args={[0.025, 0.03, 0.28, 10]} />
          <meshStandardMaterial color={IVORY} roughness={0.48} />
        </mesh>
      ))}
    </group>
  )
}

function AntebellumMansion() {
  const group = useRef<THREE.Group>(null)
  const columnXs = [-2.1, -1.26, -0.42, 0.42, 1.26, 2.1]

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (!group.current) return
    group.current.rotation.y = -0.35 + Math.sin(t * 0.18) * 0.08
    group.current.position.y = -0.55 + Math.sin(t * 0.4) * 0.025
  })

  return (
    <Float speed={0.55} rotationIntensity={0.04} floatIntensity={0.12}>
      <group ref={group} position={[0, -0.55, 0]} scale={0.92}>
        {/* Lawn base */}
        <mesh position={[0, -0.08, 0.2]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[4.8, 48]} />
          <meshStandardMaterial color={LAWN} roughness={0.9} />
        </mesh>

        {/* Main body */}
        <RoundedBox args={[5.2, 2.7, 2.4]} radius={0.04} position={[0, 1.35, 0]} castShadow receiveShadow>
          <meshStandardMaterial color={IVORY} roughness={0.48} metalness={0.06} />
        </RoundedBox>

        {/* Side wings */}
        <RoundedBox args={[1.35, 2.1, 2.0]} radius={0.03} position={[-3.15, 1.05, -0.1]} castShadow>
          <meshStandardMaterial color={IVORY_DEEP} roughness={0.5} />
        </RoundedBox>
        <RoundedBox args={[1.35, 2.1, 2.0]} radius={0.03} position={[3.15, 1.05, -0.1]} castShadow>
          <meshStandardMaterial color={IVORY_DEEP} roughness={0.5} />
        </RoundedBox>

        {/* Hip roof main */}
        <mesh position={[0, 2.95, 0]} castShadow>
          <boxGeometry args={[5.5, 0.18, 2.7]} />
          <meshStandardMaterial color={ROOF} roughness={0.65} metalness={0.1} />
        </mesh>
        <mesh position={[0, 3.35, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[2.15, 0.85, 4]} />
          <meshStandardMaterial color={ROOF} roughness={0.62} />
        </mesh>

        {/* Wing roofs */}
        <mesh position={[-3.15, 2.25, -0.1]} castShadow>
          <boxGeometry args={[1.5, 0.12, 2.2]} />
          <meshStandardMaterial color={ROOF} roughness={0.65} />
        </mesh>
        <mesh position={[3.15, 2.25, -0.1]} castShadow>
          <boxGeometry args={[1.5, 0.12, 2.2]} />
          <meshStandardMaterial color={ROOF} roughness={0.65} />
        </mesh>

        {/* Chimneys */}
        {([-1.6, 1.6] as const).map((x) => (
          <group key={x} position={[x, 3.55, -0.35]}>
            <mesh castShadow>
              <boxGeometry args={[0.32, 0.7, 0.32]} />
              <meshStandardMaterial color={BRICK} roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.4, 0]}>
              <boxGeometry args={[0.38, 0.1, 0.38]} />
              <meshStandardMaterial color="#6A5040" roughness={0.65} />
            </mesh>
          </group>
        ))}

        {/* Portico entablature */}
        <mesh position={[0, 2.55, 1.35]} castShadow>
          <boxGeometry args={[4.7, 0.22, 1.15]} />
          <meshStandardMaterial color={IVORY} roughness={0.45} />
        </mesh>
        <mesh position={[0, 2.72, 1.35]}>
          <boxGeometry args={[4.85, 0.08, 1.25]} />
          <meshStandardMaterial color={GOLD} metalness={0.35} roughness={0.4} />
        </mesh>

        {/* Pediment */}
        <mesh position={[0, 3.2, 1.58]} castShadow>
          <extrudeGeometry
            args={[
              (() => {
                const shape = new THREE.Shape()
                shape.moveTo(-1.7, 0)
                shape.lineTo(1.7, 0)
                shape.lineTo(0, 0.95)
                shape.lineTo(-1.7, 0)
                return shape
              })(),
              { depth: 0.22, bevelEnabled: false },
            ]}
          />
          <meshStandardMaterial color={IVORY} roughness={0.48} />
        </mesh>
        <mesh position={[0, 3.35, 1.82]}>
          <boxGeometry args={[0.32, 0.32, 0.06]} />
          <meshStandardMaterial color={GOLD} metalness={0.45} roughness={0.35} />
        </mesh>

        {/* Columns */}
        {columnXs.map((x) => (
          <Column key={x} position={[x, 0.12, 1.55]} height={2.2} />
        ))}

        {/* Upper balcony */}
        <mesh position={[0, 1.55, 1.42]} castShadow>
          <boxGeometry args={[4.5, 0.08, 0.85]} />
          <meshStandardMaterial color={IVORY_DEEP} roughness={0.5} />
        </mesh>
        <Balustrade width={4.3} position={[0, 1.55, 0]} z={0.72} />

        {/* Front stair mass */}
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={i}
            position={[0, 0.08 + i * 0.12, 2.05 + i * 0.18]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[3.2 - i * 0.15, 0.12, 0.35]} />
            <meshStandardMaterial color={i % 2 === 0 ? '#D8D0C4' : '#CFC6B8'} roughness={0.65} />
          </mesh>
        ))}

        {/* Entry door */}
        <mesh position={[0, 0.85, 1.22]} castShadow>
          <boxGeometry args={[0.55, 1.25, 0.08]} />
          <meshStandardMaterial color="#3A2A1C" roughness={0.55} metalness={0.1} />
        </mesh>
        <mesh position={[0.18, 0.85, 1.27]}>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshStandardMaterial color={GOLD} metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Fanlight */}
        <mesh position={[0, 1.55, 1.23]}>
          <cylinderGeometry args={[0.28, 0.28, 0.05, 16, 1, false, 0, Math.PI]} />
          <meshStandardMaterial
            color={WINDOW}
            emissive="#7FBEA8"
            emissiveIntensity={0.3}
            roughness={0.3}
          />
        </mesh>

        {/* Front windows — ground */}
        {([-1.55, -0.8, 0.8, 1.55] as const).map((x) => (
          <WindowBay key={`g-${x}`} position={[x, 0.95, 1.22]} height={0.62} />
        ))}
        {/* Front windows — upper */}
        {([-1.55, -0.8, 0.8, 1.55] as const).map((x) => (
          <WindowBay key={`u-${x}`} position={[x, 2.05, 1.22]} height={0.5} />
        ))}
        {/* Wing windows */}
        {([-3.15, 3.15] as const).map((x) => (
          <group key={`w-${x}`}>
            <WindowBay position={[x, 0.85, 0.92]} width={0.32} height={0.5} />
            <WindowBay position={[x, 1.65, 0.92]} width={0.32} height={0.45} />
          </group>
        ))}

        {/* Portico floor */}
        <mesh position={[0, 0.14, 1.45]} receiveShadow>
          <boxGeometry args={[4.6, 0.1, 1.2]} />
          <meshStandardMaterial color="#E8E0D4" roughness={0.7} />
        </mesh>

        {/* Soft interior porch light */}
        <pointLight position={[0, 2.0, 1.6]} color="#FFE6A8" intensity={0.85} distance={5} />
        <pointLight position={[0, 1.0, 2.2]} color="#C9A53E" intensity={0.35} distance={4} />
      </group>
    </Float>
  )
}

export function AntebellumMansion3D({ className = '' }: { className?: string }) {
  return (
    <div className={`relative h-full w-full bg-transparent ${className}`} aria-hidden>
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center font-sans text-sm text-[#8FB39E]">
            Loading…
          </div>
        }
      >
        <Canvas
          dpr={[1, 1.75]}
          shadows
          camera={{ position: [4.8, 2.4, 7.2], fov: 32, near: 0.1, far: 50 }}
          gl={{ antialias: true, alpha: true, premultipliedAlpha: false }}
          style={{ background: 'transparent', width: '100%', height: '100%' }}
          onCreated={({ gl, scene, camera }) => {
            gl.setClearColor(0x000000, 0)
            scene.background = null
            camera.lookAt(0, 0.85, 0)
          }}
        >
          <ambientLight intensity={0.42} />
          <directionalLight
            position={[5, 8, 4]}
            intensity={1.15}
            color="#FFF5DF"
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight position={[-4, 3, -2]} intensity={0.35} color="#8FB39E" />
          <hemisphereLight args={['#F7F3EE', '#0F3D2E', 0.35]} />
          <AntebellumMansion />
          <ContactShadows
            position={[0, -1.15, 0]}
            opacity={0.4}
            scale={12}
            blur={2.8}
            far={5}
            color="#04110C"
          />
          <Environment preset="sunset" environmentIntensity={0.4} background={false} />
        </Canvas>
      </Suspense>
    </div>
  )
}
