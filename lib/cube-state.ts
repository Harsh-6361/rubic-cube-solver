export interface CubeState {
  faces: {
    front: string[]
    back: string[]
    left: string[]
    right: string[]
    top: string[]
    bottom: string[]
  }
  size: number
}

export function generateSolvedCube(size: number): CubeState {
  const faceSize = size * size
  return {
    faces: {
      front: Array(faceSize).fill("white"),
      back: Array(faceSize).fill("yellow"),
      left: Array(faceSize).fill("orange"),
      right: Array(faceSize).fill("red"),
      top: Array(faceSize).fill("green"),
      bottom: Array(faceSize).fill("blue"),
    },
    size,
  }
}

export function generateScrambledCube(size: number): CubeState {
  // Start with solved cube
  let cube = generateSolvedCube(size)

  // Apply random moves to scramble
  const moves = ["F", "B", "R", "L", "U", "D", "F'", "B'", "R'", "L'", "U'", "D'"]
  const scrambleMoves = size === 2 ? 10 : size === 3 ? 25 : 35

  for (let i = 0; i < scrambleMoves; i++) {
    const randomMove = moves[Math.floor(Math.random() * moves.length)]
    cube = applyMove(cube, randomMove)
  }

  return cube
}

export function applyMove(cube: CubeState, move: string): CubeState {
  const newCube = JSON.parse(JSON.stringify(cube)) // Deep copy
  const size = cube.size

  switch (move) {
    case "F":
      rotateFaceClockwise(newCube.faces.front, size)
      rotateFrontAdjacent(newCube, size, false)
      break
    case "F'":
      rotateFaceCounterClockwise(newCube.faces.front, size)
      rotateFrontAdjacent(newCube, size, true)
      break
    case "B":
      rotateFaceClockwise(newCube.faces.back, size)
      rotateBackAdjacent(newCube, size, false)
      break
    case "B'":
      rotateFaceCounterClockwise(newCube.faces.back, size)
      rotateBackAdjacent(newCube, size, true)
      break
    case "R":
      rotateFaceClockwise(newCube.faces.right, size)
      rotateRightAdjacent(newCube, size, false)
      break
    case "R'":
      rotateFaceCounterClockwise(newCube.faces.right, size)
      rotateRightAdjacent(newCube, size, true)
      break
    case "L":
      rotateFaceClockwise(newCube.faces.left, size)
      rotateLeftAdjacent(newCube, size, false)
      break
    case "L'":
      rotateFaceCounterClockwise(newCube.faces.left, size)
      rotateLeftAdjacent(newCube, size, true)
      break
    case "U":
      rotateFaceClockwise(newCube.faces.top, size)
      rotateTopAdjacent(newCube, size, false)
      break
    case "U'":
      rotateFaceCounterClockwise(newCube.faces.top, size)
      rotateTopAdjacent(newCube, size, true)
      break
    case "D":
      rotateFaceClockwise(newCube.faces.bottom, size)
      rotateBottomAdjacent(newCube, size, false)
      break
    case "D'":
      rotateFaceCounterClockwise(newCube.faces.bottom, size)
      rotateBottomAdjacent(newCube, size, true)
      break
    case "F2":
      return applyMove(applyMove(cube, "F"), "F")
    case "B2":
      return applyMove(applyMove(cube, "B"), "B")
    case "R2":
      return applyMove(applyMove(cube, "R"), "R")
    case "L2":
      return applyMove(applyMove(cube, "L"), "L")
    case "U2":
      return applyMove(applyMove(cube, "U"), "U")
    case "D2":
      return applyMove(applyMove(cube, "D"), "D")
  }

  return newCube
}

function rotateFaceClockwise(face: string[], size: number) {
  const temp = [...face]
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      face[i * size + j] = temp[(size - 1 - j) * size + i]
    }
  }
}

function rotateFaceCounterClockwise(face: string[], size: number) {
  const temp = [...face]
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      face[i * size + j] = temp[j * size + (size - 1 - i)]
    }
  }
}

// Proper adjacent face rotations for each move
function rotateFrontAdjacent(cube: CubeState, size: number, reverse: boolean) {
  const temp = []

  // Save top bottom row
  for (let i = 0; i < size; i++) {
    temp[i] = cube.faces.top[(size - 1) * size + i]
  }

  if (!reverse) {
    // Top <- Left
    for (let i = 0; i < size; i++) {
      cube.faces.top[(size - 1) * size + i] = cube.faces.left[(size - 1 - i) * size + (size - 1)]
    }
    // Left <- Bottom
    for (let i = 0; i < size; i++) {
      cube.faces.left[i * size + (size - 1)] = cube.faces.bottom[i]
    }
    // Bottom <- Right
    for (let i = 0; i < size; i++) {
      cube.faces.bottom[i] = cube.faces.right[(size - 1 - i) * size]
    }
    // Right <- Top (temp)
    for (let i = 0; i < size; i++) {
      cube.faces.right[i * size] = temp[i]
    }
  } else {
    // Reverse direction
    for (let i = 0; i < size; i++) {
      cube.faces.top[(size - 1) * size + i] = cube.faces.right[i * size]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.right[i * size] = cube.faces.bottom[size - 1 - i]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.bottom[i] = cube.faces.left[i * size + (size - 1)]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.left[i * size + (size - 1)] = temp[size - 1 - i]
    }
  }
}

function rotateBackAdjacent(cube: CubeState, size: number, reverse: boolean) {
  const temp = []

  for (let i = 0; i < size; i++) {
    temp[i] = cube.faces.top[i]
  }

  if (!reverse) {
    for (let i = 0; i < size; i++) {
      cube.faces.top[i] = cube.faces.right[i * size + (size - 1)]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.right[i * size + (size - 1)] = cube.faces.bottom[(size - 1) * size + (size - 1 - i)]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.bottom[(size - 1) * size + i] = cube.faces.left[(size - 1 - i) * size]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.left[i * size] = temp[i]
    }
  } else {
    for (let i = 0; i < size; i++) {
      cube.faces.top[i] = cube.faces.left[i * size]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.left[i * size] = cube.faces.bottom[(size - 1) * size + (size - 1 - i)]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.bottom[(size - 1) * size + i] = cube.faces.right[(size - 1 - i) * size + (size - 1)]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.right[i * size + (size - 1)] = temp[i]
    }
  }
}

function rotateRightAdjacent(cube: CubeState, size: number, reverse: boolean) {
  const temp = []

  for (let i = 0; i < size; i++) {
    temp[i] = cube.faces.top[i * size + (size - 1)]
  }

  if (!reverse) {
    for (let i = 0; i < size; i++) {
      cube.faces.top[i * size + (size - 1)] = cube.faces.front[i * size + (size - 1)]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.front[i * size + (size - 1)] = cube.faces.bottom[i * size + (size - 1)]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.bottom[i * size + (size - 1)] = cube.faces.back[(size - 1 - i) * size]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.back[i * size] = temp[size - 1 - i]
    }
  } else {
    for (let i = 0; i < size; i++) {
      cube.faces.top[i * size + (size - 1)] = cube.faces.back[(size - 1 - i) * size]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.back[i * size] = cube.faces.bottom[(size - 1 - i) * size + (size - 1)]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.bottom[i * size + (size - 1)] = cube.faces.front[i * size + (size - 1)]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.front[i * size + (size - 1)] = temp[i]
    }
  }
}

function rotateLeftAdjacent(cube: CubeState, size: number, reverse: boolean) {
  const temp = []

  for (let i = 0; i < size; i++) {
    temp[i] = cube.faces.top[i * size]
  }

  if (!reverse) {
    for (let i = 0; i < size; i++) {
      cube.faces.top[i * size] = cube.faces.back[(size - 1 - i) * size + (size - 1)]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.back[i * size + (size - 1)] = cube.faces.bottom[(size - 1 - i) * size]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.bottom[i * size] = cube.faces.front[i * size]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.front[i * size] = temp[i]
    }
  } else {
    for (let i = 0; i < size; i++) {
      cube.faces.top[i * size] = cube.faces.front[i * size]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.front[i * size] = cube.faces.bottom[i * size]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.bottom[i * size] = cube.faces.back[(size - 1 - i) * size + (size - 1)]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.back[i * size + (size - 1)] = temp[size - 1 - i]
    }
  }
}

function rotateTopAdjacent(cube: CubeState, size: number, reverse: boolean) {
  const temp = []

  for (let i = 0; i < size; i++) {
    temp[i] = cube.faces.front[i]
  }

  if (!reverse) {
    for (let i = 0; i < size; i++) {
      cube.faces.front[i] = cube.faces.right[i]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.right[i] = cube.faces.back[i]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.back[i] = cube.faces.left[i]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.left[i] = temp[i]
    }
  } else {
    for (let i = 0; i < size; i++) {
      cube.faces.front[i] = cube.faces.left[i]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.left[i] = cube.faces.back[i]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.back[i] = cube.faces.right[i]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.right[i] = temp[i]
    }
  }
}

function rotateBottomAdjacent(cube: CubeState, size: number, reverse: boolean) {
  const temp = []

  for (let i = 0; i < size; i++) {
    temp[i] = cube.faces.front[(size - 1) * size + i]
  }

  if (!reverse) {
    for (let i = 0; i < size; i++) {
      cube.faces.front[(size - 1) * size + i] = cube.faces.left[(size - 1) * size + i]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.left[(size - 1) * size + i] = cube.faces.back[(size - 1) * size + i]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.back[(size - 1) * size + i] = cube.faces.right[(size - 1) * size + i]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.right[(size - 1) * size + i] = temp[i]
    }
  } else {
    for (let i = 0; i < size; i++) {
      cube.faces.front[(size - 1) * size + i] = cube.faces.right[(size - 1) * size + i]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.right[(size - 1) * size + i] = cube.faces.back[(size - 1) * size + i]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.back[(size - 1) * size + i] = cube.faces.left[(size - 1) * size + i]
    }
    for (let i = 0; i < size; i++) {
      cube.faces.left[(size - 1) * size + i] = temp[i]
    }
  }
}

export function isSolved(cube: CubeState): boolean {
  const faces = cube.faces
  return Object.values(faces).every((face) => {
    const firstColor = face[0]
    return face.every((color) => color === firstColor)
  })
}
