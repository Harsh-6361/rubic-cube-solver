"use client"
import { useRef, useEffect, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"
import type { CubeState, Move } from "@/lib/cube-state"

interface CubePieceProps {
  position: [number, number, number]
  colors: string[]
  size?: number
  isAnimating?: boolean
  animationSpeed?: number
}

function CubePiece({ position, colors, size = 0.95, isAnimating = false, animationSpeed = 1 }: CubePieceProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current && isAnimating) {
      meshRef.current.rotation.y += 0.01 * animationSpeed
    }
  })

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
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(size, size, size)]} />
        <lineBasicMaterial color="#000000" linewidth={1} />
      </lineSegments>
    </mesh>
  )
}

interface CubeSceneProps {
  cubeState: CubeState
  isAnimating?: boolean
  onAnimationComplete?: () => void
  currentMove?: Move | null
  animationSpeed?: number
}

function CubeScene({
  cubeState,
  isAnimating = false,
  onAnimationComplete,
  currentMove,
  animationSpeed = 1,
}: CubeSceneProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [animationTimer, setAnimationTimer] = useState<NodeJS.Timeout | null>(null)

  useFrame(() => {
    if (groupRef.current && isAnimating && currentMove) {
      // Gentle rotation during animation
      groupRef.current.rotation.y += 0.005 * animationSpeed
    }
  })

  useEffect(() => {
    if (isAnimating && onAnimationComplete) {
      if (animationTimer) {
        clearTimeout(animationTimer)
      }

      const timer = setTimeout(() => {
        onAnimationComplete()
      }, 1000 / animationSpeed)

      setAnimationTimer(timer)

      return () => {
        if (timer) clearTimeout(timer)
      }
    }
  }, [isAnimating, onAnimationComplete, animationSpeed, currentMove])

  const renderCube = () => {
    const pieces = []
    const size = cubeState.size || 3

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        for (let z = 0; z < size; z++) {
          // Skip internal pieces that aren't visible
          const isVisible = x === 0 || x === size - 1 || y === 0 || y === size - 1 || z === 0 || z === size - 1

          if (!isVisible) continue

          const position: [number, number, number] = [
            (x - (size - 1) / 2) * 1.05,
            (y - (size - 1) / 2) * 1.05,
            (z - (size - 1) / 2) * 1.05,
          ]

          // Determine colors for each face of this piece
          const colors = ["black", "black", "black", "black", "black", "black"]

          // Only show colors on external faces
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

          pieces.push(
            <CubePiece
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

    return pieces
  }

  return <group ref={groupRef}>{renderCube()}</group>
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
  return (
    <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [8, 8, 8], fov: 50 }} gl={{ antialias: true, alpha: false }} dpr={[1, 2]}>
        {/* Lighting setup */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-10, -10, -5]} intensity={0.3} />
        <pointLight position={[5, -5, 5]} intensity={0.2} />

        {/* Cube Scene */}
        <CubeScene
          cubeState={cubeState}
          isAnimating={isAnimating}
          onAnimationComplete={onAnimationComplete}
          currentMove={currentMove}
          animationSpeed={animationSpeed}
        />

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxDistance={20}
          minDistance={5}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  )
}
