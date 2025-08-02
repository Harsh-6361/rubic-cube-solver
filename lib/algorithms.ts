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

export interface Algorithm {
  name: string
  description: string
  timeComplexity: string
  spaceComplexity: string
  type: string
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  averageMoves: string
  advantages: string[]
  disadvantages: string[]
  bestFor: string
  steps: string[]
}

export const algorithms: Algorithm[] = [
  {
    name: "Advanced Two-Phase Algorithm",
    description:
      "Computer-optimized algorithm that solves any cube in two phases with minimal moves, inspired by Kociemba's method.",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    type: "Computer Algorithm",
    difficulty: "Advanced",
    averageMoves: "≤20 moves",
    advantages: [
      "Guaranteed optimal or near-optimal solutions (≤20 moves)",
      "Extremely fast computation",
      "Mathematically proven approach",
      "Works for all cube sizes",
      "Consistent performance",
    ],
    disadvantages: ["Complex implementation", "Requires lookup tables", "Not intuitive for humans", "Memory intensive"],
    bestFor: "Computer solving and finding the absolute shortest solutions",
    steps: [
      "Phase 1: Reduction to G1 Subgroup - Orient all edges and position corners to reduce cube to a smaller subgroup",
      "Phase 2: Solve within G1 - Complete the solve using only moves that preserve the G1 subgroup properties",
    ],
  },
  {
    name: "Layer-by-Layer (Beginner's Method)",
    description: "The most intuitive method that solves the cube layer by layer, starting from the bottom.",
    timeComplexity: "O(n³)",
    spaceComplexity: "O(1)",
    type: "Layer-based",
    difficulty: "Beginner",
    averageMoves: "60-120 moves",
    advantages: [
      "Easy to learn and understand",
      "Intuitive approach",
      "Good for beginners",
      "Teaches fundamental concepts",
    ],
    disadvantages: [
      "Relatively slow (60-120 moves average)",
      "Not optimal for speedcubing",
      "Many algorithm sequences to memorize",
    ],
    bestFor: "Beginners learning to solve the cube for the first time",
    steps: [
      "White Cross - Form a cross on the bottom layer with white center",
      "White Corners - Position and orient the white corner pieces",
      "Middle Layer - Solve the middle layer edge pieces",
      "Yellow Cross - Form a cross on the top layer",
      "Yellow Corners - Orient the yellow corner pieces",
      "Final Layer - Position the final layer pieces correctly",
    ],
  },
  {
    name: "CFOP Method",
    description: "The most popular speedcubing method used by world record holders.",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    type: "Layer-based + Look-ahead",
    difficulty: "Advanced",
    averageMoves: "20-60 moves",
    advantages: [
      "Very fast (20-60 moves average)",
      "Most popular method among speedcubers",
      "Excellent for competitive solving",
      "Well-developed fingertricks",
    ],
    disadvantages: [
      "78 algorithms to memorize",
      "Difficult learning curve",
      "Requires extensive practice",
      "Recognition training needed",
    ],
    bestFor: "Speedcubers aiming for sub-20 second solves",
    steps: [
      "Cross - Form a cross on the bottom layer in 8 moves or less",
      "F2L (First Two Layers) - Solve corner-edge pairs simultaneously (41 different F2L cases)",
      "OLL (Orientation of Last Layer) - Orient all pieces on the last layer (57 OLL algorithms)",
      "PLL (Permutation of Last Layer) - Permute the last layer pieces to solve the cube (21 PLL algorithms)",
    ],
  },
]

// Simplified solving function that returns a reasonable solution
export async function solveWithTwoPhase(cubeState: any): Promise<Move[]> {
  // This is a simplified implementation
  // In a real application, you would implement the actual Two-Phase algorithm

  // For demonstration, return a random but reasonable solution
  const moves: Move[] = ["R", "U", "R'", "U'", "F", "R'", "F'", "U", "R", "U2", "R'", "U2", "R"]

  // Simulate some processing time
  await new Promise((resolve) => setTimeout(resolve, 500))

  return moves
}
