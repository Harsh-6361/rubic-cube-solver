export interface ScramblePattern {
  name: string
  description: string
  moves: string[]
  difficulty: "Easy" | "Medium" | "Hard" | "Expert"
  category: "Classic" | "Fun" | "Practice" | "Complex"
}

export const scramblePatterns: Record<string, ScramblePattern> = {
  // Classic Patterns
  superflip: {
    name: "Superflip",
    description: "The most famous cube pattern - all edges are flipped",
    moves: [
      "R",
      "U",
      "R'",
      "F",
      "R",
      "F'",
      "U2",
      "R'",
      "U'",
      "R",
      "U",
      "R'",
      "F",
      "R2",
      "U'",
      "R'",
      "U'",
      "R",
      "U",
      "R'",
      "F'",
    ],
    difficulty: "Expert",
    category: "Classic",
  },
  checkerboard: {
    name: "Checkerboard",
    description: "Creates a checkerboard pattern on all faces",
    moves: ["M2", "E2", "S2"],
    difficulty: "Easy",
    category: "Classic",
  },
  cross: {
    name: "Cross Pattern",
    description: "Creates a cross pattern on each face",
    moves: ["F", "B", "R", "L", "U", "D"],
    difficulty: "Easy",
    category: "Classic",
  },

  // Fun Patterns
  cube_in_cube: {
    name: "Cube in Cube",
    description: "Creates smaller cubes within the larger cube faces",
    moves: ["F", "L", "F", "U'", "R", "U", "F2", "L2", "U'", "L'", "B", "D'", "B'", "L2", "U"],
    difficulty: "Hard",
    category: "Fun",
  },
  flower: {
    name: "Flower Pattern",
    description: "Creates flower-like patterns on the faces",
    moves: ["R", "U", "R'", "F", "R", "F'", "U", "R", "U2", "R'", "U2", "R"],
    difficulty: "Medium",
    category: "Fun",
  },
  spiral: {
    name: "Spiral",
    description: "Creates spiral patterns across the cube",
    moves: ["R", "U", "R'", "U", "R", "U2", "R'", "L'", "U'", "L", "U'", "L'", "U2", "L"],
    difficulty: "Medium",
    category: "Fun",
  },
  six_dots: {
    name: "Six Dots",
    description: "Creates dot patterns on each face center",
    moves: ["U", "D'", "R", "L'", "F", "B'", "U", "D'"],
    difficulty: "Easy",
    category: "Fun",
  },
  stripes: {
    name: "Stripes",
    description: "Creates striped patterns across faces",
    moves: ["F", "U", "F", "R", "L'", "F", "D'", "F", "U", "F", "L", "R'", "F"],
    difficulty: "Medium",
    category: "Fun",
  },
  tetris: {
    name: "Tetris",
    description: "Creates Tetris-like block patterns",
    moves: ["L", "R", "F", "B", "U", "D", "L", "R"],
    difficulty: "Easy",
    category: "Fun",
  },
  gift_box: {
    name: "Gift Box",
    description: "Makes the cube look like a wrapped gift",
    moves: ["F", "R", "U", "R'", "U'", "R", "U", "R'", "U'", "F'"],
    difficulty: "Medium",
    category: "Fun",
  },

  // Practice Scrambles
  easy_scramble: {
    name: "Easy Scramble",
    description: "Simple scramble for beginners",
    moves: ["R", "U", "R'", "U'", "F", "U", "F'"],
    difficulty: "Easy",
    category: "Practice",
  },
  medium_scramble: {
    name: "Medium Scramble",
    description: "Moderate scramble for intermediate solvers",
    moves: ["R", "U2", "R'", "D", "R", "U'", "R'", "D'", "R2", "U", "R'", "U'", "R", "U'", "R'"],
    difficulty: "Medium",
    category: "Practice",
  },
  hard_scramble: {
    name: "Hard Scramble",
    description: "Challenging scramble for advanced solvers",
    moves: [
      "R",
      "U",
      "R'",
      "F",
      "R",
      "F'",
      "U2",
      "R'",
      "U'",
      "R",
      "U",
      "R'",
      "F",
      "R",
      "F'",
      "U",
      "R",
      "U2",
      "R'",
      "U2",
      "R",
      "U'",
      "R'",
    ],
    difficulty: "Hard",
    category: "Practice",
  },
  competition_scramble: {
    name: "Competition Scramble",
    description: "Official WCA-style scramble sequence",
    moves: [
      "D2",
      "F",
      "U2",
      "R2",
      "D2",
      "F",
      "D2",
      "L2",
      "F'",
      "R2",
      "U2",
      "R'",
      "B",
      "L",
      "D'",
      "U",
      "L",
      "D2",
      "R'",
      "U'",
    ],
    difficulty: "Expert",
    category: "Practice",
  },

  // Complex Patterns
  anaconda: {
    name: "Anaconda",
    description: "Creates snake-like patterns across the cube",
    moves: ["L", "U", "B'", "U'", "R", "L'", "B", "R'", "F", "B'", "D", "R", "D'", "F'"],
    difficulty: "Expert",
    category: "Complex",
  },
  python: {
    name: "Python",
    description: "Another snake-like pattern with different characteristics",
    moves: ["R", "U'", "R'", "U'", "F", "R", "F'", "U", "R", "U2", "R'", "U2", "R"],
    difficulty: "Hard",
    category: "Complex",
  },
}

export function applyScramblePattern(pattern: ScramblePattern, cubeSize: number): import("./cube-state").CubeState {
  const { generateSolvedCube, applyMove } = require("./cube-state")
  let cube = generateSolvedCube(cubeSize)

  pattern.moves.forEach((move) => {
    cube = applyMove(cube, move)
  })

  return cube
}
