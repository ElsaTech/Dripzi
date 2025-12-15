"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { TextureLoader } from "three"
import { Float, OrbitControls } from "@react-three/drei"
import * as THREE from "three"
import { tagConfig, type TagPosition } from "@/lib/tag-config"

function StringTag() {
  const meshRef = useRef<THREE.Mesh>(null)
  const stringRef = useRef<THREE.Mesh>(null)
  
  // Load the tag texture
  const texture = useLoader(TextureLoader, "images/image_banner.png")
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle swaying motion
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05
    }
    
    if (stringRef.current) {
      // String follows tag movement with slight delay
      stringRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5 - 0.2) * 0.05
    }
  })

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <group>
        {/* String/Rope */}
        <mesh ref={stringRef} position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 2.4, 8]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
        </mesh>
        
        {/* Tag */}
        <mesh ref={meshRef} position={[0, 0, 0]}>
          <planeGeometry args={[1.2, 1.8]} />
          <meshStandardMaterial 
            map={texture}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Tag shadow/depth */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[1.2, 1.8]} />
          <meshStandardMaterial color="#000000" transparent opacity={0.3} />
        </mesh>
      </group>
    </Float>
  )
}

interface AnimatedTagProps {
  className?: string
  size?: "sm" | "md" | "lg"
  position?: TagPosition
}

export function AnimatedTag({ 
  className = "", 
  size = tagConfig.size,
  position = tagConfig.position 
}: AnimatedTagProps) {
  const [isVisible, setIsVisible] = useState(tagConfig.enabled)
  
  const sizeMap = {
    sm: "h-32 w-32",
    md: "h-48 w-48", 
    lg: "h-64 w-64"
  }

  if (!isVisible || !tagConfig.enabled) return null

  const positionClass = tagConfig.positions[position] || tagConfig.positions['fixed-top-right']

  return (
    <div className={`${positionClass} ${sizeMap[size]} ${className}`}>
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, 2]} intensity={0.3} />
        
        <StringTag />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate={tagConfig.autoRotate}
          autoRotateSpeed={tagConfig.autoRotateSpeed}
        />
      </Canvas>
      
      {/* Close button for easy removal */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 z-10 h-6 w-6 rounded-full bg-black/20 text-white opacity-0 hover:opacity-100 transition-opacity"
        title="Hide tag"
      >
        ×
      </button>
    </div>
  )
}