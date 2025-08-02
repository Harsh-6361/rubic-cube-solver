export interface ScramblePattern {
  name: string
  moves: string
  difficulty: "Easy" | "Medium" | "Hard" | "Expert"
  description: string
}

export const scramblePatterns: Record<string, ScramblePattern[]> = {
  classic: [
    {
      name: "Superflip",
      moves: "R U R' F R F' U2 R' U' R U R' F R2 U' R' U' R U R' F'",
      difficulty: "Expert",
      description: "All edges are flipped but in correct positions - the most famous cube pattern",
    },
    {
      name: "Checkerboard",
      moves: "M2 E2 S2",
      difficulty: "Easy",
      description: "Creates a checkerboard pattern on all faces",
    },
    {
      name: "Cross Pattern",
      moves: "F B R L U D",
      difficulty: "Easy",
      description: "Creates cross patterns on opposite faces",
    },
  ],
  fun: [
    {
      name: "Cube in Cube",
      moves: "F L F U' R U F2 L2 U' L' B D' B' L2 U",
      difficulty: "Hard",
      description: "Creates the illusion of a smaller cube inside the larger one",
    },
    {
      name: "Flower Pattern",
      moves: "R U R' F R F' U R U2 R' U2 R",
      difficulty: "Medium",
      description: "Creates flower-like patterns on multiple faces",
    },
    {
      name: "Spiral",
      moves: "R U R' U R U2 R' L' U' L U' L' U2 L",
      difficulty: "Medium",
      description: "Creates spiral patterns around the cube",
    },
    {
      name: "Six Dots",
      moves: "U D' R L' F B' U D'",
      difficulty: "Easy",
      description: "Creates dot patterns on all six faces",
    },
    {
      name: "Stripes",
      moves: "F U F R L' F D' F U F L R' F",
      difficulty: "Medium",
      description: "Creates striped patterns across faces",
    },
    {
      name: "Tetris",
      moves: "L R F B U D L R",
      difficulty: "Easy",
      description: "Creates Tetris-like block patterns",
    },
    {
      name: "Gift Box",
      moves: "F R U R' U' R U R' U' F'",
      difficulty: "Medium",
      description: "Makes the cube look like a wrapped gift box",
    },
  ],
  practice: [
    {
      name: "Easy Scramble",
      moves: "R U R' U' F U F'",
      difficulty: "Easy",
      description: "Simple scramble for beginners to practice solving",
    },
    {
      name: "Medium Scramble",
      moves: "R U2 R' D R U' R' D' R2 U R' U' R U' R'",
      difficulty: "Medium",
      description: "Moderate scramble for intermediate solvers",
    },
    {
      name: "Hard Scramble",
      moves: "R U R' F R F' U2 R' U' R U R' F R F' U R U2 R' U2 R U' R'",
      difficulty: "Hard",
      description: "Complex scramble for advanced practice",
    },
    {
      name: "Competition Scramble",
      moves: "D2 F U2 R2 D2 F D2 L2 F' R2 U2 R' B L D' U L D2 R' U'",
      difficulty: "Expert",
      description: "Official WCA-style competition scramble",
    },
  ],
  complex: [
    {
      name: "Anaconda",
      moves: "L U B' U' R L' B R' F B' D R D' F'",
      difficulty: "Hard",
      description: "Creates snake-like patterns winding around the cube",
    },
    {
      name: "Python",
      moves: "R U' R' U' F R F' U R U2 R' U2 R",
      difficulty: "Hard",
      description: "Another serpentine pattern with different characteristics",
    },
  ],
}
