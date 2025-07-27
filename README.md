# Rubik's Cube Solver

A full-featured, interactive Rubik's Cube Solver app built with TypeScript, React, and 3D visualization. Solve 2x2x2, 3x3x3, and 4x4x4 cubes using multiple algorithms, visualize solutions step-by-step, and experiment with famous scramble patterns.

---

## ✨ Features

- **3D Interactive Visualization**: Rotate, zoom, and inspect cubes in real time.
- **Multiple Cube Sizes**: Supports 2x2x2, 3x3x3, and 4x4x4 cubes.
- **Algorithm Selection**: Choose between Layer-by-Layer (Beginner), CFOP (Speedcubing), and Advanced Two-Phase algorithms.
- **Step-by-Step Solution Playback**: Watch the cube solve itself move-by-move, with animated transitions.
- **Manual Control**: Input your own move sequences, undo moves, and apply moves directly.
- **Pattern Scrambles**: Instantly apply famous scramble patterns (Superflip, Checkerboard, Cube in Cube, etc.).
- **Performance Metrics**: View time taken, move count, and compare algorithm efficiency.
- **Modern, Responsive UI**: Built with Tailwind CSS, shadcn/ui, and React Three Fiber.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- pnpm (or npm/yarn)
- Modern browser (for 3D visualization)

### Installation

```bash
git clone https://github.com/Harsh-6361/rubic-cube-solver.git
cd rubic-cube-solver
pnpm install
```

### Running the App

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧩 How It Works

### Cube Modeling

- The cube is modeled as a `CubeState` with six faces, each a flat array of colors.
- Moves (F, B, R, L, U, D and their inverses/doubles) rotate faces and update stickers per standard Rubik's Cube logic.
- State transitions use pure functions for predictability and animation.

### Solving Algorithms

Implemented in `lib/algorithms.ts`:

1. **Layer-by-Layer (Beginner)**
   - Solves the cube layer by layer.
   - Easy to understand, but not optimal for speed.

2. **CFOP (Speedcubing)**
   - Cross, F2L, OLL, PLL.
   - Fast and efficient, but requires memorization.

3. **Advanced Two-Phase (Kociemba-inspired)**
   - Computer-optimized, minimal moves.
   - Uses theoretical group reduction for efficient solutions.

Each algorithm exposes:
- Metadata (time/space complexity, description)
- A `solve` function returning the move sequence and solved state.

### Move Engine

- All moves are simulated as real cube moves, updating both state and visualization.
- Manual and automated moves use the same engine.

### Visualization

- 3D rendering via React Three Fiber.
- Animations for move application and solution playback.
- Visual highlight of current move and step.

---

## 🕹 Usage Guide

1. **Select Cube Size**: 2x2, 3x3, or 4x4.
2. **Scramble the Cube**:
   - Use "Random" for a random sequence.
   - Apply a famous pattern from the "Scramble Patterns" panel.
3. **Choose Algorithm**: Pick your preferred solving method.
4. **Solve the Cube**:
   - Click "Solve" to watch the solution play out.
   - Use animation controls for step-by-step, pause, resume, or skip.
5. **Manual Moves**:
   - Enter move sequences to scramble or experiment.
   - Undo steps as needed.
6. **View Solution**:
   - See move count, time taken, and algorithm efficiency.
   - Inspect each move in the solution.

---

## 📂 Project Structure

```
.
├── app/                # Next.js app directory & entrypoint
├── components/         # UI components (3D cube, controls, dialogs, visualizer)
├── lib/                # Core logic: cube state, move engine, algorithms, patterns
├── public/             # Static assets
├── styles/             # Tailwind CSS and custom styles
├── hooks/              # React hooks (UI helpers)
├── package.json        # Project dependencies and scripts
└── README.md           # You're here!
```

---

## ⚙️ Extending / Developer Guide

- **Add New Algorithms**:  
  Implement a new entry in `lib/algorithms.ts` with metadata and a `solve` function.
- **Add Patterns**:  
  Add to `lib/scramble-patterns.ts` with a name, description, and move list.
- **Support Larger Cubes**:  
  Cube state and move logic are dimension-agnostic, but algorithm logic may need extension.

---

## 📊 Algorithm Comparison

The app includes a comparison tool (`components/algorithm-comparison.tsx`) to benchmark different algorithms on the same scramble, reporting:
- Time taken
- Number of moves
- Efficiency score

---

## 🔬 Core Files Explained

- **lib/cube-state.ts**:  
  Models the cube, provides move logic, scramble/solved generation, and checks for solved state.

- **lib/algorithms.ts**:  
  Implements solving algorithms, including metadata, step lists, and move generation logic.

- **components/rubiks-cube.tsx**:  
  3D rendering and animation of the cube.

- **components/cube-solver.tsx**:  
  Main UI logic: user input, solution playback, and cube state management.

- **lib/scramble-patterns.ts**:  
  Famous scramble and pattern move lists.

See in-code documentation for further detail.

---

## 📚 References & Credits

- [Kociemba's Two-Phase Algorithm](https://kociemba.org/)
- [CFOP Method for Speedcubing](https://ruwix.com/the-rubiks-cube/advanced-cfop-fridrich/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [shadcn/ui](https://ui.shadcn.com/)
- All algorithms and move logic adapted and simplified for educational use.

---

## 🧑‍💻 Author

**Harsh Vardhan**  
[GitHub](https://github.com/Harsh-6361)

---

## 📄 License

[MIT](LICENSE)

---

Enjoy exploring, learning, and solving Rubik's Cubes visually and interactively!


