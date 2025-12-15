"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text3D, Center, Float, Environment } from "@react-three/drei"
import type * as THREE from "three"

function FloatingGeometry() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
      meshRef.current.rotation.y += 0.005
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.5, 0.5, 128, 32]} />
        <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.1} envMapIntensity={1.5} />
      </mesh>
    </Float>
  )
}

function Logo3D() {
  return (
    <Center>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
        <Text3D
          font="/fonts/Inter_Bold.json"
          size={1.2}
          height={0.3}
          curveSegments={32}
          bevelEnabled
          bevelThickness={0.03}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={8}
        >
          DRIPZI
          <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} envMapIntensity={2} />
        </Text3D>
      </Float>
    </Center>
  )
}

export function Hero3D() {
  return (
    <div className="h-screen w-full">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <group position={[0, 1, 0]}>
          <Logo3D />
        </group>

        <group position={[3, -1, 0]} scale={0.5}>
          <FloatingGeometry />
        </group>

        <Environment preset="city" />
        <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.5} />
      </Canvas>
    </div>
  )
}
