"use client"
import { useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import type * as THREE from "three"
import type { CubeState, Move } from "@/lib/cube-state"

interface CubePieceProps {
  position: [number, number, number]
  colors: string[]
  size?: number
}

function CubePiece({ position, colors, size = 0.95 }: CubePieceProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  const colorMap: { [key: string]: string } = {
    white: "#ffffff",
    yellow: "#ffff00",
    red: "#ff0000",
    orange: "#ff8000",
    green: "#00ff00",
    blue: "#0000ff",
    black: "#000000",
  }

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[size, size, size]} />
      {colors.map((color, index) => (
        <meshStandardMaterial key={index} attach={`material-${index}`} color={colorMap[color] || "#cccccc"} />
      ))}
    </mesh>
  )
}

interface RubiksCubeProps {
  cubeState: CubeState
  isAnimating?: boolean
  onAnimationComplete?: () => void
  currentMove?: Move | null
  animationSpeed?: number
}

export function RubiksCube({
  cubeState,
  isAnimating = false,
  onAnimationComplete,
  currentMove,
  animationSpeed = 1,
}: RubiksCubeProps) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (groupRef.current && isAnimating) {
      groupRef.current.rotation.y += 0.01 * animationSpeed
    }
  })

  useEffect(() => {
    if (isAnimating && onAnimationComplete) {
      const timer = setTimeout(() => {
        onAnimationComplete()
      }, 1000 / animationSpeed)
      return () => clearTimeout(timer)
    }
  }, [isAnimating, onAnimationComplete, animationSpeed])

  const renderCube = () => {
    const pieces = []
    const size = cubeState.size || 3

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        for (let z = 0; z < size; z++) {
          const position: [number, number, number] = [
            (x - (size - 1) / 2) * 1.1,
            (y - (size - 1) / 2) * 1.1,
            (z - (size - 1) / 2) * 1.1,
          ]

          // Determine colors for each face of this piece
          const colors = ["white", "white", "white", "white", "white", "white"]

          // Front face (z = size-1)
          if (z === size - 1) {
            const faceIndex = y * size + x
            colors[4] = cubeState.faces.front[faceIndex] || "white"
          }

          // Back face (z = 0)
          if (z === 0) {
            const faceIndex = y * size + (size - 1 - x)
            colors[5] = cubeState.faces.back[faceIndex] || "yellow"
          }

          // Right face (x = size-1)
          if (x === size - 1) {
            const faceIndex = y * size + z
            colors[0] = cubeState.faces.right[faceIndex] || "red"
          }

          // Left face (x = 0)
          if (x === 0) {
            const faceIndex = y * size + (size - 1 - z)
            colors[1] = cubeState.faces.left[faceIndex] || "orange"
          }

          // Top face (y = size-1)
          if (y === size - 1) {
            const faceIndex = z * size + x
            colors[2] = cubeState.faces.top[faceIndex] || "green"
          }

          // Bottom face (y = 0)
          if (y === 0) {
            const faceIndex = (size - 1 - z) * size + x
            colors[3] = cubeState.faces.bottom[faceIndex] || "blue"
          }

          pieces.push(<CubePiece key={`${x}-${y}-${z}`} position={position} colors={colors} />)
        }
      }
    }

    return pieces
  }

  return (
    <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
      <Canvas camera={{ position: [8, 8, 8], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[-10, -10, -5]} intensity={0.3} />

        <group ref={groupRef}>{renderCube()}</group>

        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} maxDistance={20} minDistance={5} />
      </Canvas>
    </div>
  )
}
