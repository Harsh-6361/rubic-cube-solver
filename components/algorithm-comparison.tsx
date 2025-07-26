"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { algorithms } from "@/lib/algorithms"
import { generateScrambledCube } from "@/lib/cube-state"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

interface ComparisonResult {
  algorithm: string
  time: number
  moves: number
  name: string
  efficiency: number
}

export function AlgorithmComparison() {
  const [cubeSize, setCubeSize] = useState<2 | 3 | 4>(3)
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<ComparisonResult[]>([])
  const [progress, setProgress] = useState(0)
  const [currentAlgorithm, setCurrentAlgorithm] = useState("")

  const runComparison = async () => {
    setIsRunning(true)
    setResults([])
    setProgress(0)
    setCurrentAlgorithm("")

    const algorithmKeys = Object.keys(algorithms)
    const newResults: ComparisonResult[] = []

    for (let i = 0; i < algorithmKeys.length; i++) {
      const algorithmKey = algorithmKeys[i]
      const algorithm = algorithms[algorithmKey]

      setCurrentAlgorithm(algorithm.name)
      setProgress((i / algorithmKeys.length) * 100)

      try {
        // Generate a fresh scrambled cube for each algorithm
        const cubeState = generateScrambledCube(cubeSize)
        const startTime = performance.now()

        const result = await algorithm.solve(cubeState, cubeSize)
        const endTime = performance.now()

        const efficiency = Math.max(0, 100 - result.moves.length / 2 - (endTime - startTime) / 10)

        newResults.push({
          algorithm: algorithmKey,
          name: algorithm.name,
          time: endTime - startTime,
          moves: result.moves.length,
          efficiency: Math.round(efficiency),
        })
      } catch (error) {
        console.error(`Error with ${algorithm.name}:`, error)
        newResults.push({
          algorithm: algorithmKey,
          name: algorithm.name,
          time: -1, // Error indicator
          moves: -1,
          efficiency: 0,
        })
      }

      setResults([...newResults])
    }

    setProgress(100)
    setCurrentAlgorithm("")
    setIsRunning(false)
  }

  const validResults = results.filter((r) => r.time > 0)

  const chartData = validResults.map((result) => ({
    name: result.name.split(" ")[0], // Shorten names for chart
    time: Math.round(result.time),
    moves: result.moves,
    efficiency: result.efficiency,
  }))

  const bestTime = validResults.length > 0 ? Math.min(...validResults.map((r) => r.time)) : 0
  const bestMoves = validResults.length > 0 ? Math.min(...validResults.map((r) => r.moves)) : 0
  const bestEfficiency = validResults.length > 0 ? Math.max(...validResults.map((r) => r.efficiency)) : 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Algorithm Performance Comparison</CardTitle>
          <CardDescription>
            Compare different solving algorithms on a {cubeSize}x{cubeSize}x{cubeSize} cube
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex gap-2">
              {[2, 3, 4].map((size) => (
                <Button
                  key={size}
                  variant={cubeSize === size ? "default" : "outline"}
                  onClick={() => setCubeSize(size as 2 | 3 | 4)}
                  disabled={isRunning}
                >
                  {size}x{size}
                </Button>
              ))}
            </div>
            <Button onClick={runComparison} disabled={isRunning} className="ml-auto">
              {isRunning ? "Running..." : "Run Comparison"}
            </Button>
          </div>

          {isRunning && (
            <div className="mb-4">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600 mt-2">
                Progress: {progress.toFixed(0)}%{currentAlgorithm && ` - Testing: ${currentAlgorithm}`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {validResults.length > 0 && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Fastest Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{bestTime.toFixed(2)}ms</div>
                <p className="text-sm text-gray-600">{validResults.find((r) => r.time === bestTime)?.name}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Fewest Moves</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{bestMoves}</div>
                <p className="text-sm text-gray-600">{validResults.find((r) => r.moves === bestMoves)?.name}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Best Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{bestEfficiency}%</div>
                <p className="text-sm text-gray-600">
                  {validResults.find((r) => r.efficiency === bestEfficiency)?.name}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Execution Time (ms)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="time" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Number of Moves</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="moves" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Efficiency Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Algorithm Efficiency Comparison</CardTitle>
              <CardDescription>Overall efficiency based on speed and move count</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="efficiency" stroke="#8b5cf6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Detailed Results */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.map((result, index) => {
                  const algorithm = algorithms[result.algorithm]
                  const isError = result.time < 0
                  const isBestTime = result.time === bestTime && !isError
                  const isBestMoves = result.moves === bestMoves && !isError

                  return (
                    <div
                      key={result.algorithm}
                      className={`border rounded-lg p-4 ${isBestTime || isBestMoves ? "border-green-300 bg-green-50" : ""}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold flex items-center gap-2">
                            {algorithm.name}
                            {isBestTime && (
                              <Badge variant="default" className="text-xs">
                                Fastest
                              </Badge>
                            )}
                            {isBestMoves && (
                              <Badge variant="default" className="text-xs">
                                Fewest Moves
                              </Badge>
                            )}
                          </h3>
                          <p className="text-sm text-gray-600">{algorithm.description}</p>
                        </div>
                        <div className="text-right">
                          {!isError ? (
                            <div className="space-y-1">
                              <div>
                                <Badge variant="secondary">{result.time.toFixed(2)}ms</Badge>
                                <Badge variant="outline" className="ml-2">
                                  {result.moves} moves
                                </Badge>
                              </div>
                              <Badge variant="default" className="bg-purple-600">
                                {result.efficiency}% efficiency
                              </Badge>
                            </div>
                          ) : (
                            <Badge variant="destructive">Error</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <Badge variant="outline">Time: {algorithm.timeComplexity}</Badge>
                        <Badge variant="outline">Space: {algorithm.spaceComplexity}</Badge>
                        <Badge variant="outline">{algorithm.type}</Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
