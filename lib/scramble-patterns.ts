import type { CubeState } from "./cube-state"
import { applyMove, generateSolvedCube } from "./cube-state"

export interface ScramblePattern {
  name: string
  description: string
  moves: string[]
  difficulty: string
  category: string
}

export const scramblePatterns: Record<string, ScramblePattern> = {
  superflip: {
    name: "Superflip",
    description: "The most famous cube pattern - all edges are flipped but in correct positions",
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
    category: "Pattern",
  },

  cross: {
    name: "Cross Pattern",
    description: "Creates a cross pattern on each face",
    moves: ["F", "B", "R", "L", "U", "D"],
    difficulty: "Easy",
    category: "Pattern",
  },

  cube_in_cube: {
    name: "Cube in Cube",
    description: "Creates smaller cubes within each face",
    moves: ["F", "L", "F", "U'", "R", "U", "F2", "L2", "U'", "L'", "B", "D'", "B'", "L2", "U"],
    difficulty: "Intermediate",
    category: "Pattern",
  },

  flower: {
    name: "Flower Pattern",
    description: "Creates flower-like patterns on opposite faces",
    moves: ["R", "U", "R'", "F", "R", "F'", "U", "R", "U2", "R'", "U2", "R"],
    difficulty: "Intermediate",
    category: "Pattern",
  },

  spiral: {
    name: "Spiral",
    description: "Creates spiral patterns around the cube",
    moves: ["R", "U", "R'", "U", "R", "U2", "R'", "L'", "U'", "L", "U'", "L'", "U2", "L"],
    difficulty: "Intermediate",
    category: "Pattern",
  },

  dots: {
    name: "Six Dots",
    description: "Creates dot patterns on each face center",
    moves: ["U", "D'", "R", "L'", "F", "B'", "U", "D'"],
    difficulty: "Easy",
    category: "Pattern",
  },

  stripes: {
    name: "Stripes",
    description: "Creates striped patterns across faces",
    moves: ["F", "U", "F", "R", "L'", "F", "D'", "F", "U", "F", "L", "R'", "F"],
    difficulty: "Intermediate",
    category: "Pattern",
  },

  tetris: {
    name: "Tetris",
    description: "Creates Tetris-like block patterns",
    moves: ["L", "R", "F", "B", "U", "D", "L", "R"],
    difficulty: "Easy",
    category: "Fun",
  },

  anaconda: {
    name: "Anaconda",
    description: "Creates snake-like patterns wrapping around the cube",
    moves: ["L", "U", "B'", "U'", "R", "L'", "B", "R'", "F", "B'", "D", "R", "D'", "F'"],
    difficulty: "Advanced",
    category: "Complex",
  },

  python: {
    name: "Python",
    description: "Another snake pattern with different characteristics",
    moves: ["R", "U'", "R'", "U'", "F", "R", "F'", "U", "R", "U2", "R'", "U2", "R"],
    difficulty: "Advanced",
    category: "Complex",
  },

  gift_box: {
    name: "Gift Box",
    description: "Creates a gift box ribbon pattern",
    moves: ["F", "R", "U", "R'", "U'", "R", "U", "R'", "U'", "F'"],
    difficulty: "Intermediate",
    category: "Fun",
  },

  easy_scramble: {
    name: "Easy Scramble",
    description: "Simple scramble for beginners",
    moves: ["R", "U", "R'", "U'", "F", "U", "F'"],
    difficulty: "Beginner",
    category: "Practice",
  },

  medium_scramble: {
    name: "Medium Scramble",
    description: "Moderate scramble for intermediate solvers",
    moves: ["R", "U2", "R'", "D", "R", "U'", "R'", "D'", "R2", "U", "R'", "U'", "R", "U'", "R'"],
    difficulty: "Intermediate",
    category: "Practice",
  },

  hard_scramble: {
    name: "Hard Scramble",
    description: "Complex scramble for advanced solvers",
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
    difficulty: "Advanced",
    category: "Practice",
  },

  competition_scramble: {
    name: "Competition Style",
    description: "WCA-style random scramble sequence",
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
    category: "Competition",
  },
}

export function applyScramblePattern(pattern: ScramblePattern, cubeSize: number): CubeState {
  let cube = generateSolvedCube(cubeSize)

  for (const move of pattern.moves) {
    cube = applyMove(cube, move)
  }

  return cube
}

export function getPatternsByCategory(category: string): ScramblePattern[] {
  return Object.values(scramblePatterns).filter((pattern) => pattern.category === category)
}

export function getPatternsByDifficulty(difficulty: string): ScramblePattern[] {
  return Object.values(scramblePatterns).filter((pattern) => pattern.difficulty === difficulty)
}
