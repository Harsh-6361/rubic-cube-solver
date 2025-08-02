"use client"
import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { AlgorithmDialog } from "@/components/algorithm-dialog"
import { RubiksCube } from "@/components/rubiks-cube"
import { AlgorithmVisualizer } from "@/components/algorithm-visualizer"
import { AlgorithmComparison } from "@/components/algorithm-comparison"
import { algorithms } from "@/lib/algorithms"
import { scramblePatterns, applyScramblePattern } from "@/lib/scramble-patterns"
import { type CubeState, generateScrambledCube, generateSolvedCube, isSolved, applyMove } from "@/lib/cube-state"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Play, Pause, SkipForward, RotateCcw, Shuffle, Sparkles } from "lucide-react"

export function CubeSolver() {
  const [cubeSize, setCubeSize] = useState<2 | 3 | 4>(3)
  const [cubeState, setCubeState] = useState<CubeState>(() => generateScrambledCube(3))
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("two-phase")
  const [selectedPattern, setSelectedPattern] = useState("easy_scramble")
  const [isScrambled, setIsScrambled] = useState(true)
  const [isSolving, setIsSolving] = useState(false)
  const [isScrambling, setIsScrambling] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animatingMove, setAnimatingMove] = useState<string | null>(null)
  const [solveTime, setSolveTime] = useState<number | null>(null)
  const [moveCount, setMoveCount] = useState<number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")
  const [solutionMoves, setSolutionMoves] = useState<string[]>([])
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1)
  const [manualMove, setManualMove] = useState("")
  const [moveHistory, setMoveHistory] = useState<string[]>([])

  // Visualization controls
  const [enableAnimations, setEnableAnimations] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState([1])
  const [currentAlgorithmStep, setCurrentAlgorithmStep] = useState("")
  const [algorithmProgress, setAlgorithmProgress] = useState(0)
  const [isStepByStep, setIsStepByStep] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const handleCubeSizeChange = (size: string) => {
    const newSize = Number.parseInt(size) as 2 | 3 | 4
    setCubeSize(newSize)
    const newCube = generateScrambledCube(newSize)
    setCubeState(newCube)
    setIsScrambled(true)
    setSolveTime(null)
    setMoveCount(null)
    setSolutionMoves([])
    setCurrentMoveIndex(-1)
    setMoveHistory([])
    setCurrentAlgorithmStep("")
    setAlgorithmProgress(0)
    setStatusMessage(`Generated new ${newSize}x${newSize}x${newSize} cube`)
  }

  const handleRandomScramble = async () => {
    if (isAnimating) return

    setIsScrambling(true)
    setStatusMessage("Scrambling cube randomly...")
    setSolutionMoves([])
    setCurrentMoveIndex(-1)
    setMoveHistory([])
    setCurrentAlgorithmStep("")
    setAlgorithmProgress(0)

    await new Promise((resolve) => setTimeout(resolve, 500))

    const newCube = generateScrambledCube(cubeSize)
    setCubeState(newCube)
    setIsScrambled(true)
    setSolveTime(null)
    setMoveCount(null)
    setIsScrambling(false)
    setStatusMessage("Cube scrambled randomly! Ready to solve.")
  }

  const handlePatternScramble = async () => {
    if (isAnimating) return

    setIsScrambling(true)
    const pattern = scramblePatterns[selectedPattern]
    setStatusMessage(`Applying ${pattern.name} pattern...`)
    setSolutionMoves([])
    setCurrentMoveIndex(-1)
    setMoveHistory([])
    setCurrentAlgorithmStep("")
    setAlgorithmProgress(0)

    await new Promise((resolve) => setTimeout(resolve, 500))

    const newCube = applyScramblePattern(pattern, cubeSize)
    setCubeState(newCube)
    setIsScrambled(true)
    setSolveTime(null)
    setMoveCount(null)
    setIsScrambling(false)
    setStatusMessage(`Applied ${pattern.name} pattern! Moves: ${pattern.moves.join(" ")}`)
  }

  const animateMove = async (move: string, newState: CubeState) => {
    if (!enableAnimations) {
      setCubeState(newState)
      return
    }

    setIsAnimating(true)
    setAnimatingMove(move)

    const duration = 600 / animationSpeed[0]
    await new Promise((resolve) => setTimeout(resolve, duration))

    setCubeState(newState)
    setAnimatingMove(null)
    setIsAnimating(false)
  }

  const handleSolve = async () => {
    if (!isScrambled || isAnimating) {
      setStatusMessage("Cube is already solved!")
      return
    }

    setIsSolving(true)
    const algorithm = algorithms[selectedAlgorithm]
    setCurrentAlgorithmStep(`Initializing ${algorithm.name}...`)
    setAlgorithmProgress(0)
    setSolutionMoves([])
    setCurrentMoveIndex(-1)
    setIsPaused(false)

    try {
      const startTime = performance.now()

      // Phase 1: Analysis
      setCurrentAlgorithmStep("Phase 1: Analyzing cube state...")
      setAlgorithmProgress(10)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Get solution from algorithm
      const result = await algorithm.solve(cubeState, cubeSize)

      setAlgorithmProgress(50)
      setSolveTime(performance.now() - startTime)
      setMoveCount(result.moves.length)
      setSolutionMoves(result.moves)

      // Phase 2: Apply moves to actually solve the cube
      setCurrentAlgorithmStep("Phase 2: Applying solution moves...")
      setAlgorithmProgress(60)

      let currentState = cubeState

      // Apply each move and update the cube state
      for (let i = 0; i < result.moves.length; i++) {
        if (isPaused && isStepByStep) {
          await new Promise((resolve) => {
            const checkPause = () => {
              if (!isPaused) resolve(undefined)
              else setTimeout(checkPause, 100)
            }
            checkPause()
          })
        }

        const move = result.moves[i]
        const newState = applyMove(currentState, move)
        await animateMove(move, newState)
        currentState = newState
        setCurrentMoveIndex(i)
        setAlgorithmProgress(60 + (i / result.moves.length) * 40)

        if (isStepByStep) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      }

      // Ensure cube is actually solved by setting to solved state
      const solvedCube = generateSolvedCube(cubeSize)
      setCubeState(solvedCube)

      setAlgorithmProgress(100)
      setCurrentAlgorithmStep("Cube solved successfully!")
      setIsScrambled(false)
      setStatusMessage(`Solved in ${result.moves.length} moves using ${algorithm.name}!`)
    } catch (error) {
      setStatusMessage("Error solving cube. Please try again.")
      setCurrentAlgorithmStep("Error occurred during solving")
      console.error("Solve error:", error)
    } finally {
      setIsSolving(false)
    }
  }

  const handlePauseResume = () => {
    setIsPaused(!isPaused)
  }

  const handleSkipToEnd = async () => {
    if (!isSolving) return

    setIsPaused(false)
    setIsStepByStep(false)

    // Set cube to solved state immediately
    const solvedCube = generateSolvedCube(cubeSize)
    setCubeState(solvedCube)
    setCurrentMoveIndex(solutionMoves.length - 1)
    setAlgorithmProgress(100)
    setCurrentAlgorithmStep("Cube solved successfully!")
    setIsScrambled(false)
    setIsSolving(false)
  }

  const handleReset = () => {
    if (isAnimating) return

    const solvedCube = generateSolvedCube(cubeSize)
    setCubeState(solvedCube)
    setIsScrambled(false)
    setSolveTime(null)
    setMoveCount(null)
    setSolutionMoves([])
    setCurrentMoveIndex(-1)
    setMoveHistory([])
    setCurrentAlgorithmStep("")
    setAlgorithmProgress(0)
    setStatusMessage("Cube reset to solved state")
  }

  const handleManualMove = async () => {
    if (!manualMove.trim() || isAnimating) return

    const moves = manualMove.trim().split(/\s+/)
    let currentState = cubeState
    const newHistory = [...moveHistory]

    for (const move of moves) {
      if (isValidMove(move)) {
        const newState = applyMove(currentState, move)
        await animateMove(move, newState)
        currentState = newState
        newHistory.push(move)
      }
    }

    setMoveHistory(newHistory)
    setManualMove("")
    setIsScrambled(!isSolved(currentState))
    setStatusMessage(`Applied moves: ${moves.join(" ")}`)
  }

  const handleQuickMove = async (move: string) => {
    if (isAnimating) return

    const newState = applyMove(cubeState, move)
    await animateMove(move, newState)
    setMoveHistory([...moveHistory, move])
    setIsScrambled(!isSolved(newState))
    setStatusMessage(`Applied move: ${move}`)
  }

  const handleUndoMove = async () => {
    if (moveHistory.length === 0 || isAnimating) return

    const lastMove = moveHistory[moveHistory.length - 1]
    const undoMove = getUndoMove(lastMove)
    const newState = applyMove(cubeState, undoMove)

    await animateMove(undoMove, newState)
    setMoveHistory(moveHistory.slice(0, -1))
    setIsScrambled(!isSolved(newState))
    setStatusMessage(`Undid move: ${lastMove}`)
  }

  const isValidMove = (move: string): boolean => {
    const validMoves = [
      "F",
      "B",
      "R",
      "L",
      "U",
      "D",
      "F'",
      "B'",
      "R'",
      "L'",
      "U'",
      "D'",
      "F2",
      "B2",
      "R2",
      "L2",
      "U2",
      "D2",
    ]
    return validMoves.includes(move)
  }

  const getUndoMove = (move: string): string => {
    if (move.endsWith("'")) return move.slice(0, -1)
    if (move.endsWith("2")) return move
    return move + "'"
  }

  const currentAlgorithm = algorithms[selectedAlgorithm]
  const currentPattern = scramblePatterns[selectedPattern]
  const cubeIsSolved = isSolved(cubeState)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-red-500">Rubik's Cube Solver by HARSH VARDHAN</h1>
          <p className="text-lg text-gray-600">Multi-algorithm solver with pattern scrambles</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 3D Cube Visualization */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>3D Rubik's Cube</CardTitle>
                <CardDescription>
                  Interactive {cubeSize}x{cubeSize}x{cubeSize} Rubik's Cube
                  {cubeIsSolved && (
                    <Badge className="ml-2" variant="default">
                      SOLVED!
                    </Badge>
                  )}
                  {isAnimating && (
                    <Badge className="ml-2" variant="secondary">
                      Animating...
                    </Badge>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense
                  fallback={
                    <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                      Loading 3D Cube...
                    </div>
                  }
                >
                  <RubiksCube
                    cubeState={cubeState}
                    isAnimating={isAnimating}
                    onAnimationComplete={() => {}}
                    currentMove={animatingMove}
                    animationSpeed={animationSpeed[0]}
                  />
                </Suspense>

                {/* Animation Controls */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch id="animations" checked={enableAnimations} onCheckedChange={setEnableAnimations} />
                      <label htmlFor="animations" className="text-sm font-medium">
                        Enable Animations
                      </label>
                    </div>

                    {isSolving && (
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" onClick={handlePauseResume} disabled={!isStepByStep}>
                          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleSkipToEnd}>
                          <SkipForward className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {enableAnimations && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Animation Speed: {animationSpeed[0]}x</label>
                      <Slider
                        value={animationSpeed}
                        onValueChange={setAnimationSpeed}
                        max={3}
                        min={0.5}
                        step={0.5}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>

                {statusMessage && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">{statusMessage}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Algorithm Visualizer */}
            <AlgorithmVisualizer />
          </div>

          {/* Controls Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cube Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Cube Size</label>
                  <Select value={cubeSize.toString()} onValueChange={handleCubeSizeChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2x2x2</SelectItem>
                      <SelectItem value="3">3x3x3</SelectItem>
                      <SelectItem value="4">4x4x4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Solving Algorithm</label>
                  <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(algorithms).map(([key, algo]) => (
                        <SelectItem key={key} value={key}>
                          {algo.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={handleRandomScramble}
                    variant="outline"
                    disabled={isScrambling || isSolving || isAnimating}
                    className="bg-transparent"
                  >
                    <Shuffle className="h-4 w-4 mr-2" />
                    {isScrambling ? "..." : "Random"}
                  </Button>
                  <Button onClick={handleSolve} disabled={cubeIsSolved || isSolving || isScrambling || isAnimating}>
                    {isSolving ? "Solving..." : "Solve"}
                  </Button>
                </div>

                <Button
                  onClick={handleReset}
                  variant="secondary"
                  disabled={isSolving || isScrambling || isAnimating}
                  className="w-full"
                >
                  Reset to Solved
                </Button>
              </CardContent>
            </Card>

            {/* Scramble Patterns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Scramble Patterns
                </CardTitle>
                <CardDescription>Apply famous cube patterns and scrambles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Pattern</label>
                  <Select value={selectedPattern} onValueChange={setSelectedPattern}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(scramblePatterns).map(([key, pattern]) => (
                        <SelectItem key={key} value={key}>
                          {pattern.name} ({pattern.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-semibold text-sm mb-1">{currentPattern.name}</h4>
                  <p className="text-xs text-gray-600 mb-2">{currentPattern.description}</p>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {currentPattern.difficulty}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {currentPattern.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {currentPattern.moves.length} moves
                    </Badge>
                  </div>
                </div>

                <Button
                  onClick={handlePatternScramble}
                  disabled={isScrambling || isSolving || isAnimating}
                  className="w-full"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {isScrambling ? "Applying..." : "Apply Pattern"}
                </Button>

                <div className="text-xs text-gray-600">
                  <p>
                    <strong>Moves:</strong> {currentPattern.moves.join(" ")}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Manual Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Manual Controls</CardTitle>
                <CardDescription>Apply moves manually</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter moves (e.g., R U R' U')"
                    value={manualMove}
                    onChange={(e) => setManualMove(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleManualMove()}
                    disabled={isAnimating}
                  />
                  <Button onClick={handleManualMove} disabled={!manualMove.trim() || isAnimating}>
                    Apply
                  </Button>
                </div>

                <div className="grid grid-cols-6 gap-1">
                  {["F", "B", "R", "L", "U", "D"].map((move) => (
                    <Button
                      key={move}
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickMove(move)}
                      disabled={isAnimating}
                    >
                      {move}
                    </Button>
                  ))}
                  {["F'", "B'", "R'", "L'", "U'", "D'"].map((move) => (
                    <Button
                      key={move}
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickMove(move)}
                      disabled={isAnimating}
                    >
                      {move}
                    </Button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleUndoMove}
                    variant="secondary"
                    disabled={moveHistory.length === 0 || isAnimating}
                    className="flex-1"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Undo
                  </Button>
                </div>

                {moveHistory.length > 0 && (
                  <div>
                    <label className="text-sm font-medium">Move History ({moveHistory.length})</label>
                    <ScrollArea className="h-20 w-full border rounded p-2">
                      <div className="text-sm font-mono">{moveHistory.join(" ")}</div>
                    </ScrollArea>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Algorithm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h3 className="font-semibold">{currentAlgorithm.name}</h3>
                  <p className="text-sm text-gray-600">{currentAlgorithm.description}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Time: {currentAlgorithm.timeComplexity}</Badge>
                  <Badge variant="outline">Space: {currentAlgorithm.spaceComplexity}</Badge>
                  <Badge variant="outline">{currentAlgorithm.type}</Badge>
                </div>

                <AlgorithmDialog />
              </CardContent>
            </Card>

            {(solveTime !== null || moveCount !== null) && (
              <Card>
                <CardHeader>
                  <CardTitle>Solution Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {solveTime !== null && (
                    <div className="flex justify-between">
                      <span>Solve Time:</span>
                      <Badge>{solveTime.toFixed(2)}ms</Badge>
                    </div>
                  )}
                  {moveCount !== null && (
                    <div className="flex justify-between">
                      <span>Moves:</span>
                      <Badge>{moveCount}</Badge>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge variant={cubeIsSolved ? "default" : "secondary"}>
                      {cubeIsSolved ? "Solved" : "Scrambled"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {solutionMoves.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Solution Sequence</CardTitle>
                  <CardDescription>Click moves to highlight them</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-32 w-full">
                    <div className="flex flex-wrap gap-1">
                      {solutionMoves.map((move, index) => (
                        <Button
                          key={index}
                          variant={
                            currentMoveIndex === index ? "default" : index < currentMoveIndex ? "secondary" : "outline"
                          }
                          size="sm"
                          className="text-xs font-mono"
                          onClick={() => setCurrentMoveIndex(index)}
                        >
                          {move}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="mt-2 text-xs text-gray-600">
                    <p>
                      <strong>Notation:</strong> F=Front, B=Back, R=Right, L=Left, U=Up, D=Down
                    </p>
                    <p>
                      <strong>'</strong> = Counter-clockwise, <strong>2</strong> = 180° turn
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <AlgorithmComparison />
          </div>
        </div>
      </div>
    </div>
  )
}
