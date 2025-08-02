export type Move =
  | "R"
  | "R'"
  | "R2"
  | "L"
  | "L'"
  | "L2"
  | "U"
  | "U'"
  | "U2"
  | "D"
  | "D'"
  | "D2"
  | "F"
  | "F'"
  | "F2"
  | "B"
  | "B'"
  | "B2"
  | "M"
  | "M'"
  | "M2"
  | "E"
  | "E'"
  | "E2"
  | "S"
  | "S'"
  | "S2"

export interface CubeState {
  front: string[][]
  back: string[][]
  right: string[][]
  left: string[][]
  up: string[][]
  down: string[][]
}

export function createSolvedCube(): CubeState {
  return {
    front: [
      ["G", "G", "G"],
      ["G", "G", "G"],
      ["G", "G", "G"],
    ],
    back: [
      ["B", "B", "B"],
      ["B", "B", "B"],
      ["B", "B", "B"],
    ],
    right: [
      ["R", "R", "R"],
      ["R", "R", "R"],
      ["R", "R", "R"],
    ],
    left: [
      ["O", "O", "O"],
      ["O", "O", "O"],
      ["O", "O", "O"],
    ],
    up: [
      ["W", "W", "W"],
      ["W", "W", "W"],
      ["W", "W", "W"],
    ],
    down: [
      ["Y", "Y", "Y"],
      ["Y", "Y", "Y"],
      ["Y", "Y", "Y"],
    ],
  }
}

export function scrambleCube(cubeState: CubeState): CubeState {
  const moves: Move[] = [
    "R",
    "R'",
    "R2",
    "L",
    "L'",
    "L2",
    "U",
    "U'",
    "U2",
    "D",
    "D'",
    "D2",
    "F",
    "F'",
    "F2",
    "B",
    "B'",
    "B2",
  ]
  let newState = { ...cubeState }

  // Generate 20-25 random moves for scrambling
  const numMoves = 20 + Math.floor(Math.random() * 6)
  for (let i = 0; i < numMoves; i++) {
    const randomMove = moves[Math.floor(Math.random() * moves.length)]
    newState = applyMove(newState, randomMove)
  }

  return newState
}

export function applyMove(cubeState: CubeState, move: Move): CubeState {
  // This is a simplified implementation
  // In a real application, you would implement the actual cube rotation logic

  // For demonstration, we'll just return a slightly modified state
  const newState = JSON.parse(JSON.stringify(cubeState)) as CubeState

  // Simulate some basic move effects (this is not accurate cube logic)
  switch (move) {
    case "R":
      // Rotate right face clockwise and adjacent edges
      newState.right = rotateClockwise(newState.right)
      break
    case "R'":
      // Rotate right face counterclockwise
      newState.right = rotateCounterClockwise(newState.right)
      break
    case "U":
      // Rotate up face clockwise
      newState.up = rotateClockwise(newState.up)
      break
    case "U'":
      // Rotate up face counterclockwise
      newState.up = rotateCounterClockwise(newState.up)
      break
    // Add more cases as needed
  }

  return newState
}

function rotateClockwise(face: string[][]): string[][] {
  return [
    [face[2][0], face[1][0], face[0][0]],
    [face[2][1], face[1][1], face[0][1]],
    [face[2][2], face[1][2], face[0][2]],
  ]
}

function rotateCounterClockwise(face: string[][]): string[][] {
  return [
    [face[0][2], face[1][2], face[2][2]],
    [face[0][1], face[1][1], face[2][1]],
    [face[0][0], face[1][0], face[2][0]],
  ]
}

export function isSolved(cubeState: CubeState): boolean {
  const solvedState = createSolvedCube()
  return JSON.stringify(cubeState) === JSON.stringify(solvedState)
}
