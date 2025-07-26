"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { animated, useSpring } from "@react-spring/three"
import type { Group } from "three"
import type { CubeState } from "@/lib/cube-state"

interface RubiksCubeProps {
  state: CubeState
  size: 2 | 3 | 4
  animatingMove?: string | null
  onAnimationComplete?: () => void
}

const colors = {
  white: "#ffffff",
  yellow: "#ffd700",
  red: "#dc143c",
  orange: "#ff8c00",
  blue: "#0066cc",
  green: "#228b22",
  black: "#2c2c2c", // For internal faces
}

function CubePiece({
  position,
  faceColors,
  size,
  isAnimating,
  animationRotation,
}: {
  position: [number, number, number]
  faceColors: { [key: string]: string }
  size: number
  isAnimating: boolean
  animationRotation: any
}) {
  const meshRef = useRef<any>(null)

  // Create materials for each face (right, left, top, bottom, front, back)
  const materials = [
    { color: faceColors.right || colors.black },
    { color: faceColors.left || colors.black },
    { color: faceColors.top || colors.black },
    { color: faceColors.bottom || colors.black },
    { color: faceColors.front || colors.black },
    { color: faceColors.back || colors.black },
  ]

  return (
    <animated.mesh ref={meshRef} position={position} rotation={isAnimating ? animationRotation : [0, 0, 0]}>
      <boxGeometry args={[size * 0.95, size * 0.95, size * 0.95]} />
      {materials.map((material, index) => (
        <meshStandardMaterial key={index} attach={`material-${index}`} color={material.color} />
      ))}
    </animated.mesh>
  )
}

export function RubiksCube({ state, size, animatingMove, onAnimationComplete }: RubiksCubeProps) {
  const groupRef = useRef<Group>(null)
  const [autoRotate, setAutoRotate] = useState(true)

  // Animation spring for face rotations
  const { rotation } = useSpring({
    rotation: animatingMove ? getRotationForMove(animatingMove) : [0, 0, 0],
    config: { duration: 600 },
    onRest: () => {
      if (animatingMove && onAnimationComplete) {
        onAnimationComplete()
      }
    },
  })

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate && !animatingMove) {
      groupRef.current.rotation.y += delta * 0.2
      groupRef.current.rotation.x += delta * 0.1
    }
  })

  const pieceSize = 1
  const spacing = pieceSize * 1.05
  const offset = ((size - 1) * spacing) / 2

  const pieces = []

  // Generate cube pieces with proper face colors
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      for (let z = 0; z < size; z++) {
        // Only render visible pieces (not internal pieces)
        const isVisible = x === 0 || x === size - 1 || y === 0 || y === size - 1 || z === 0 || z === size - 1

        if (isVisible) {
          const position: [number, number, number] = [x * spacing - offset, y * spacing - offset, z * spacing - offset]

          // Determine which faces are visible and their colors
          const faceColors: { [key: string]: string } = {}

          // Map cube positions to face colors from state
          if (x === 0) faceColors.left = getFaceColor(state, "left", x, y, z, size)
          if (x === size - 1) faceColors.right = getFaceColor(state, "right", x, y, z, size)
          if (y === 0) faceColors.bottom = getFaceColor(state, "bottom", x, y, z, size)
          if (y === size - 1) faceColors.top = getFaceColor(state, "top", x, y, z, size)
          if (z === 0) faceColors.back = getFaceColor(state, "back", x, y, z, size)
          if (z === size - 1) faceColors.front = getFaceColor(state, "front", x, y, z, size)

          // Check if this piece should be animated
          const shouldAnimate = animatingMove && shouldPieceAnimate(x, y, z, size, animatingMove)

          pieces.push(
            <CubePiece
              key={`${x}-${y}-${z}`}
              position={position}
              faceColors={faceColors}
              size={pieceSize}
              isAnimating={shouldAnimate}
              animationRotation={shouldAnimate ? rotation : [0, 0, 0]}
            />,
          )
        }
      }
    }
  }

  return (
    <group ref={groupRef} onPointerEnter={() => setAutoRotate(false)} onPointerLeave={() => setAutoRotate(true)}>
      {pieces}
    </group>
  )
}

function getFaceColor(
  state: CubeState,
  face: keyof CubeState["faces"],
  x: number,
  y: number,
  z: number,
  size: number,
): string {
  // Map 3D position to 2D face array index
  let index = 0

  switch (face) {
    case "front": // z === size - 1
      index = (size - 1 - y) * size + x
      break
    case "back": // z === 0
      index = (size - 1 - y) * size + (size - 1 - x)
      break
    case "left": // x === 0
      index = (size - 1 - y) * size + z
      break
    case "right": // x === size - 1
      index = (size - 1 - y) * size + (size - 1 - z)
      break
    case "top": // y === size - 1
      index = z * size + x
      break
    case "bottom": // y === 0
      index = (size - 1 - z) * size + x
      break
  }

  const color = state.faces[face][index] || "black"
  return colors[color as keyof typeof colors] || colors.black
}

function getRotationForMove(move: string): [number, number, number] {
  const angle = Math.PI / 2

  switch (move) {
    case "F":
      return [0, 0, -angle]
    case "F'":
      return [0, 0, angle]
    case "B":
      return [0, 0, angle]
    case "B'":
      return [0, 0, -angle]
    case "R":
      return [-angle, 0, 0]
    case "R'":
      return [angle, 0, 0]
    case "L":
      return [angle, 0, 0]
    case "L'":
      return [-angle, 0, 0]
    case "U":
      return [0, -angle, 0]
    case "U'":
      return [0, angle, 0]
    case "D":
      return [0, angle, 0]
    case "D'":
      return [0, -angle, 0]
    default:
      return [0, 0, 0]
  }
}

function shouldPieceAnimate(x: number, y: number, z: number, size: number, move: string): boolean {
  switch (move) {
    case "F":
    case "F'":
      return z === size - 1
    case "B":
    case "B'":
      return z === 0
    case "R":
    case "R'":
      return x === size - 1
    case "L":
    case "L'":
      return x === 0
    case "U":
    case "U'":
      return y === size - 1
    case "D":
    case "D'":
      return y === 0
    default:
      return false
  }
}
