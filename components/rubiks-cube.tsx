"use client"
import { useRef, useEffect, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"
import type { CubeState, Move } from "@/lib/cube-state"

interface CubeProps {
  cubeState: CubeState
  isAnimating: boolean
  onAnimationComplete: () => void
  currentMove?: Move | null
  animationSpeed: number
}

interface CubieProps {
  position: [number, number, number]
  colors: (string | null)[]
  isAnimating: boolean
  targetRotation?: THREE.Euler
  animationSpeed: number
}

function Cubie({ position, colors, isAnimating, targetRotation, animationSpeed }: CubieProps) {
  const meshRef = useRef<THREE.Group>(null)
  const [currentRotation, setCurrentRotation] = useState(new THREE.Euler(0, 0, 0))

  useFrame(() => {
    if (meshRef.current && isAnimating && targetRotation) {
      // Smooth rotation animation
      const speed = animationSpeed * 0.1
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotation.x, speed)
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotation.y, speed)
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetRotation.z, speed)
    }
  })

  const faceColors = [
    colors[0] || "#000000", // right
    colors[1] || "#000000", // left
    colors[2] || "#000000", // top
    colors[3] || "#000000", // bottom
    colors[4] || "#000000", // front
    colors[5] || "#000000", // back
  ]

  return (
    <group ref={meshRef} position={position}>
      <mesh>
        <boxGeometry args={[0.95, 0.95, 0.95]} />
        {faceColors.map((color, index) => (
          <meshStandardMaterial key={index} attach={`material-${index}`} color={color} />
        ))}
      </mesh>
      {/* Black edges */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(0.95, 0.95, 0.95)]} />
        <lineBasicMaterial color="#000000" linewidth={2} />
      </lineSegments>
    </group>
  )
}

function CubeScene({ cubeState, isAnimating, onAnimationComplete, currentMove, animationSpeed }: CubeProps) {
  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (isAnimating && currentMove) {
      // Animation logic here
      const timer = setTimeout(() => {
        onAnimationComplete()
      }, 1000 / animationSpeed)
      return () => clearTimeout(timer)
    }
  }, [isAnimating, currentMove, animationSpeed, onAnimationComplete])

  const renderCubies = () => {
    const cubies = []

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          // Skip the center cubie (invisible)
          if (x === 0 && y === 0 && z === 0) continue

          const position: [number, number, number] = [x, y, z]
          const colors = getCubieColors(x, y, z, cubeState)

          cubies.push(
            <Cubie
              key={`${x}-${y}-${z}`}
              position={position}
              colors={colors}
              isAnimating={isAnimating}
              animationSpeed={animationSpeed}
            />,
          )
        }
      }
    }

    return cubies
  }

  return <group ref={groupRef}>{renderCubies()}</group>
}

function getCubieColors(x: number, y: number, z: number, cubeState: CubeState): (string | null)[] {
  const colors: (string | null)[] = [null, null, null, null, null, null]

  // Map cube state to colors based on position
  // This is a simplified mapping - you may need to adjust based on your cube state structure

  // Right face (x = 1)
  if (x === 1) colors[0] = getColorFromState(cubeState.right, y + 1, z + 1)
  // Left face (x = -1)
  if (x === -1) colors[1] = getColorFromState(cubeState.left, y + 1, z + 1)
  // Top face (y = 1)
  if (y === 1) colors[2] = getColorFromState(cubeState.up, x + 1, z + 1)
  // Bottom face (y = -1)
  if (y === -1) colors[3] = getColorFromState(cubeState.down, x + 1, z + 1)
  // Front face (z = 1)
  if (z === 1) colors[4] = getColorFromState(cubeState.front, x + 1, y + 1)
  // Back face (z = -1)
  if (z === -1) colors[5] = getColorFromState(cubeState.back, x + 1, y + 1)

  return colors
}

function getColorFromState(face: string[][], row: number, col: number): string {
  if (row < 0 || row >= 3 || col < 0 || col >= 3) return "#000000"

  const colorMap: { [key: string]: string } = {
    W: "#ffffff", // White
    R: "#ff0000", // Red
    B: "#0000ff", // Blue
    O: "#ff8800", // Orange
    G: "#00ff00", // Green
    Y: "#ffff00", // Yellow
  }

  return colorMap[face[row][col]] || "#000000"
}

export function RubiksCube({ cubeState, isAnimating, onAnimationComplete, currentMove, animationSpeed }: CubeProps) {
  return (
    <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [4, 4, 4], fov: 50 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />

        <CubeScene
          cubeState={cubeState}
          isAnimating={isAnimating}
          onAnimationComplete={onAnimationComplete}
          currentMove={currentMove}
          animationSpeed={animationSpeed}
        />

        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={3} maxDistance={10} />
      </Canvas>
    </div>
  )
}
