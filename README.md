# Rubik's Cube Solver

## Overview

This project is a Rubik's Cube Solver designed for the **Design Dexterity Challenge** hackathon. It implements an algorithm to solve a standard 3x3 Rubik's Cube (and other sizes, e.g., 2x2, 4x4) from any scrambled state, mimicking real-world solving logic through a sequence of valid moves. The project features a clean, interactive UI, supports algorithm benchmarking, and is extensible for different cube sizes.

---

## Features

- **Accurate Cube Modeling:** Internal state representation of the cube using efficient data structures.
- **Complete Move Engine:** Supports all standard Rubik's Cube moves (U, D, L, R, F, B, and their inverses).
- **Solving Algorithm:** Systematic, modular, and scalable approach capable of solving any scramble.
- **Algorithm Comparison:** Benchmark multiple solving strategies for efficiency and moves count.
- **Visual Simulation:** Interactive web UI to scramble, solve, and visualize the cube state and moves.
- **Scalability:** Supports 2x2, 3x3, and 4x4 cubes with ease.
- **Bonus:** Clean code, modular design, and potential for easy extension (e.g., user-defined patterns).

---

## Table of Contents

- [Project Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [How Cube Solving Works](#how-cube-solving-works)
- [Demo & Screenshots](#demo--screenshots)
- [How to Run](#how-to-run)
- [Usage](#usage)
- [Performance & Benchmarking](#performance--benchmarking)
- [Contributing](#contributing)
- [Credits](#credits)
- [License](#license)

---

## Architecture

- **Frontend:** React (TypeScript), modular UI components.
- **Logic:** Cube state and algorithms implemented in pure TypeScript modules.
- **Entry Points:**  
  - `components/cube-solver.tsx` — Main UI logic for scrambling, solving, and visualizing.
  - `lib/cube-state.ts` — Core cube state, move application, and random scrambling.
  - `lib/algorithms.ts` — Solving algorithms, benchmarking logic, and algorithm metadata.

---

## How Cube Solving Works

### Problem Breakdown

- **State Modeling:** The cube is represented as a set of faces, each face as an array of stickers.
- **Move Engine:** Implements all standard moves (U, D, L, R, F, B, and their inverses/rotations), modifying the cube state accordingly.
- **Solving Algorithm:**  
  1. Analyze current cube state vs. solved state.
  2. Generate a sequence of valid moves to reach the solved state.
  3. Apply moves and validate with each step.
  4. Benchmark algorithms for time and move count.

### Data Structures

- **CubeState:** Object storing each face's stickers and cube size.
- **Move Sequences:** Arrays of strings representing moves (e.g., `["F", "U'", "R2"]`).

### State Prediction & Validation

- After each move, the new state is predicted and checked for correctness.
- Algorithms simulate and verify solution before presenting to the user.

---

## Demo & Screenshots


<img width="1919" height="933" alt="Screenshot 2025-08-03 121205" src="https://github.com/user-attachments/assets/6a19ea0d-ad7e-4d6f-a86a-60cb31b64672" />
<img width="1918" height="932" alt="Screenshot 2025-08-03 121220" src="https://github.com/user-attachments/assets/73de0823-d052-4902-b43a-9cc765d1ba4c" />
<img width="506" height="241" alt="Screenshot 2025-08-03 121234" src="https://github.com/user-attachments/assets/bf0345de-865e-4ce1-9eae-aeeecaba7d8b" />
<img width="476" height="586" alt="Screenshot 2025-08-03 121250" src="https://github.com/user-attachments/assets/9a30bdf1-1a44-4671-a81c-e8cb47607c51" />
<img width="1919" height="933" alt="Screenshot 2025-08-03 121147" src="https://github.com/user-attachments/assets/4e21abcf-f42e-4fab-bc73-dbcaab9260d1" />

![Scrambled Cube Example](./screenshots/scrambled-cube.png)
![Solving Animation](./screenshots/solving.gif)
![Algorithm Comparison Chart](./screenshots/algorithm-comparison.png)

---

## How to Run

### Prerequisites

- Node.js (>= 16.x)
- npm or yarn

### Setup

\`\`\`bash
git clone https://github.com/Harsh-6361/rubic-cube-solver.git
cd rubic-cube-solver
npm install    # or yarn
\`\`\`

### Development

\`\`\`bash
npm run dev    # or yarn dev
\`\`\`
- Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

\`\`\`bash
npm run build
npm start
\`\`\`

---

## Usage

1. **Choose Cube Size:** Select 2x2, 3x3, or 4x4.
2. **Scramble the Cube:** Use random or patterned scrambles.
3. **Solve:** Click "Solve" to auto-solve the cube and watch the moves animate.
4. **Algorithm Comparison:** Use the comparison tab to benchmark different algorithms for moves and time.

---

## Performance & Benchmarking

- The app benchmarks algorithms for:
  - **Solving time (ms)**
  - **Number of moves**
  - **Efficiency score**
- Visual charts are provided in the UI for comparison.

---

## Contributing

Want to improve this project?
- Fork the repo and submit a pull request.
- Suggestions and bug reports are welcome via GitHub Issues.

---

## Credits

- Developed by [Harsh-6361](https://github.com/Harsh-6361) for the Design Dexterity Challenge.
- Inspired by classic Rubik's Cube solving algorithms and open-source UI component libraries.

---

## License

This project is licensed under the MIT License.
