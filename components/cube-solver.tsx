"use client"
import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RubiksCube } from "./rubiks-cube"
import { AlgorithmDialog } from "./algorithm-dialog"
import { AlgorithmComparison } from "./algorithm-comparison"
import { AlgorithmVisualizer } from "./algorithm-visualizer"
import { type CubeState, createSolvedCube, scrambleCube, type Move, applyMove, isSolved } from "@/lib/cube-state"
import { solveWithTwoPhase } from "@/lib/algorithms"
import { scramblePatterns } from "@/lib/scramble-patterns"
import { Shuffle, Play, RotateCcw, Timer, Zap, Settings, Palette, BookOpen } from "lucide-react"

export function CubeSolver() {
  const [cubeState, setCubeState] = useState<CubeState>(createSolvedCube())
  const [isScrambled, setIsScrambled] = useState(false)
  const [isSolving, setIsSolving] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [solutionMoves, setSolutionMoves] = useState<Move[]>([])
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0)
  const [showAnimations, setShowAnimations] = useState(true)
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [manualMoves, setManualMoves] = useState("")
  const [moveHistory, setMoveHistory] = useState<Move[]>([])
  const [selectedPattern, setSelectedPattern] = useState<string>("")
  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 10)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning])

  const formatTime = (centiseconds: number) => {
    const minutes = Math.floor(centiseconds / 6000)
    const seconds = Math.floor((centiseconds % 6000) / 100)
    const cs = centiseconds % 100
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${cs.toString().padStart(2, "0")}`
  }

  const handleScramble = useCallback(() => {
    const scrambled = scrambleCube(cubeState)
    setCubeState(scrambled)
    setIsScrambled(true)
    setSolutionMoves([])
    setCurrentMoveIndex(0)
    setMoveHistory([])
    setTimer(0)
    setIsTimerRunning(true)
  }, [cubeState])

  const handlePatternScramble = useCallback((patternMoves: string) => {
    let newState = createSolvedCube()
    const moves = patternMoves.split(" ").filter((move) => move.trim())

    moves.forEach((moveStr) => {
      const move = parseMove(moveStr.trim())
      if (move) {
        newState = applyMove(newState, move)
      }
    })

    setCubeState(newState)
    setIsScrambled(true)
    setSolutionMoves([])
    setCurrentMoveIndex(0)
    setMoveHistory([])
    setTimer(0)
    setIsTimerRunning(true)
  }, [])

  const parseMove = (moveStr: string): Move | null => {
    const moveMap: { [key: string]: Move } = {
      R: "R",
      "R'": "R'",
      R2: "R2",
      L: "L",
      "L'": "L'",
      L2: "L2",
      U: "U",
      "U'": "U'",
      U2: "U2",
      D: "D",
      "D'": "D'",
      D2: "D2",
      F: "F",
      "F'": "F'",
      F2: "F2",
      B: "B",
      "B'": "B'",
      B2: "B2",
      M: "M",
      "M'": "M'",
      M2: "M2",
      E: "E",
      "E'": "E'",
      E2: "E2",
      S: "S",
      "S'": "S'",
      S2: "S2",
    }
    return moveMap[moveStr] || null
  }

  const handleSolve = useCallback(async () => {
    if (!isScrambled || isSolving) return

    setIsSolving(true)
    try {
      const solution = await solveWithTwoPhase(cubeState)
      setSolutionMoves(solution)
      setCurrentMoveIndex(0)

      if (showAnimations) {
        setIsAnimating(true)
      } else {
        // Apply all moves instantly
        let newState = cubeState
        solution.forEach((move) => {
          newState = applyMove(newState, move)
        })
        setCubeState(newState)
        setIsScrambled(false)
        setIsTimerRunning(false)
      }
    } catch (error) {
      console.error("Solving failed:", error)
    } finally {
      setIsSolving(false)
    }
  }, [cubeState, isScrambled, isSolving, showAnimations])

  const handleAnimationComplete = useCallback(() => {
    if (currentMoveIndex < solutionMoves.length) {
      const move = solutionMoves[currentMoveIndex]
      const newState = applyMove(cubeState, move)
      setCubeState(newState)
      setCurrentMoveIndex((prev) => prev + 1)

      if (currentMoveIndex + 1 >= solutionMoves.length) {
        setIsAnimating(false)
        setIsScrambled(false)
        setIsTimerRunning(false)
      }
    }
  }, [cubeState, solutionMoves, currentMoveIndex])

  const handleManualMove = useCallback(() => {
    const moves = manualMoves.split(" ").filter((move) => move.trim())
    let newState = cubeState
    const newMoveHistory = [...moveHistory]

    moves.forEach((moveStr) => {
      const move = parseMove(moveStr.trim())
      if (move) {
        newState = applyMove(newState, move)
        newMoveHistory.push(move)
      }
    })

    setCubeState(newState)
    setMoveHistory(newMoveHistory)
    setManualMoves("")

    if (isSolved(newState)) {
      setIsScrambled(false)
      setIsTimerRunning(false)
    }
  }, [manualMoves, cubeState, moveHistory])

  const handleReset = useCallback(() => {
    setCubeState(createSolvedCube())
    setIsScrambled(false)
    setSolutionMoves([])
    setCurrentMoveIndex(0)
    setMoveHistory([])
    setIsAnimating(false)
    setTimer(0)
    setIsTimerRunning(false)
  }, [])

  const currentMove = isAnimating && currentMoveIndex < solutionMoves.length ? solutionMoves[currentMoveIndex] : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🧩 Rubik's Cube Solver</h1>
          <p className="text-lg text-gray-600">Advanced 3D cube solver with multiple algorithms and patterns</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Cube Display */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="h-5 w-5" />
                    Timer: {formatTime(timer)}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant={isScrambled ? "destructive" : "default"}>
                      {isScrambled ? "Scrambled" : "Solved"}
                    </Badge>
                    {isSolving && <Badge variant="secondary">Solving...</Badge>}
                    {isAnimating && <Badge variant="outline">Animating</Badge>}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <RubiksCube
                  cubeState={cubeState}
                  isAnimating={isAnimating}
                  onAnimationComplete={handleAnimationComplete}
                  currentMove={currentMove}
                  animationSpeed={animationSpeed}
                />

                <div className="mt-6 flex flex-wrap gap-3 justify-center">
                  <Button onClick={handleScramble} variant="outline" className="flex items-center gap-2 bg-transparent">
                    <Shuffle className="h-4 w-4" />
                    Scramble
                  </Button>

                  <Button
                    onClick={handleSolve}
                    disabled={!isScrambled || isSolving || isAnimating}
                    className="flex items-center gap-2"
                  >
                    <Zap className="h-4 w-4" />
                    {isSolving ? "Solving..." : "Solve"}
                  </Button>

                  <Button onClick={handleReset} variant="outline" className="flex items-center gap-2 bg-transparent">
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>

                  <AlgorithmDialog />
                  <AlgorithmComparison />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            <Tabs defaultValue="controls" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="controls">
                  <Settings className="h-4 w-4 mr-1" />
                  Controls
                </TabsTrigger>
                <TabsTrigger value="patterns">
                  <Palette className="h-4 w-4 mr-1" />
                  Patterns
                </TabsTrigger>
                <TabsTrigger value="algorithm">
                  <BookOpen className="h-4 w-4 mr-1" />
                  Algorithm
                </TabsTrigger>
              </TabsList>

              <TabsContent value="controls" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Animation Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="animations">Show Animations</Label>
                      <Switch id="animations" checked={showAnimations} onCheckedChange={setShowAnimations} />
                    </div>

                    <div className="space-y-2">
                      <Label>Animation Speed: {animationSpeed}x</Label>
                      <Slider
                        value={[animationSpeed]}
                        onValueChange={(value) => setAnimationSpeed(value[0])}
                        max={3}
                        min={0.5}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Manual Controls</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="manual-moves">Enter Moves (e.g., R U R' U')</Label>
                      <div className="flex gap-2">
                        <Input
                          id="manual-moves"
                          value={manualMoves}
                          onChange={(e) => setManualMoves(e.target.value)}
                          placeholder="R U R' U'"
                          className="flex-1"
                        />
                        <Button onClick={handleManualMove} size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {moveHistory.length > 0 && (
                      <div className="space-y-2">
                        <Label>Move History ({moveHistory.length} moves)</Label>
                        <ScrollArea className="h-20 w-full rounded border p-2">
                          <div className="text-sm font-mono">{moveHistory.join(" ")}</div>
                        </ScrollArea>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="patterns" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Scramble Patterns</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Select value={selectedPattern} onValueChange={setSelectedPattern}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a pattern" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(scramblePatterns).map(([category, patterns]) => (
                          <div key={category}>
                            <div className="px-2 py-1 text-sm font-semibold text-gray-500 uppercase">{category}</div>
                            {patterns.map((pattern) => (
                              <SelectItem key={pattern.name} value={pattern.name}>
                                {pattern.name} - {pattern.difficulty}
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedPattern && (
                      <div className="space-y-3">
                        {Object.values(scramblePatterns)
                          .flat()
                          .find((p) => p.name === selectedPattern) && (
                          <>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold">{selectedPattern}</h4>
                                <Badge variant="outline">
                                  {
                                    Object.values(scramblePatterns)
                                      .flat()
                                      .find((p) => p.name === selectedPattern)?.difficulty
                                  }
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {
                                  Object.values(scramblePatterns)
                                    .flat()
                                    .find((p) => p.name === selectedPattern)?.description
                                }
                              </p>
                              <div className="text-xs font-mono bg-white p-2 rounded border">
                                {
                                  Object.values(scramblePatterns)
                                    .flat()
                                    .find((p) => p.name === selectedPattern)?.moves
                                }
                              </div>
                            </div>
                            <Button
                              onClick={() => {
                                const pattern = Object.values(scramblePatterns)
                                  .flat()
                                  .find((p) => p.name === selectedPattern)
                                if (pattern) handlePatternScramble(pattern.moves)
                              }}
                              className="w-full"
                            >
                              Apply Pattern
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="algorithm" className="space-y-4">
                <AlgorithmVisualizer />
              </TabsContent>
            </Tabs>

            {/* Solution Display */}
            {solutionMoves.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Solution ({solutionMoves.length} moves)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-32 w-full rounded border p-3">
                    <div className="text-sm font-mono space-y-1">
                      {solutionMoves.map((move, index) => (
                        <span
                          key={index}
                          className={`inline-block mr-2 px-2 py-1 rounded ${
                            index === currentMoveIndex && isAnimating
                              ? "bg-blue-500 text-white"
                              : index < currentMoveIndex
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {move}
                        </span>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
