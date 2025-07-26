"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, Zap, Target, CheckCircle } from "lucide-react"

interface AlgorithmVisualizerProps {
  currentStep: string
  progress: number
  currentMove: string | null
  totalMoves: number
  isSolving: boolean
}

export function AlgorithmVisualizer({
  currentStep,
  progress,
  currentMove,
  totalMoves,
  isSolving,
}: AlgorithmVisualizerProps) {
  const getStepIcon = () => {
    if (progress === 0) return <Brain className="h-5 w-5 text-blue-500" />
    if (progress < 50) return <Zap className="h-5 w-5 text-yellow-500" />
    if (progress < 100) return <Target className="h-5 w-5 text-orange-500" />
    return <CheckCircle className="h-5 w-5 text-green-500" />
  }

  const getPhaseInfo = () => {
    if (progress < 10) return { phase: "Initialization", description: "Analyzing cube state and preparing algorithm" }
    if (progress < 50) return { phase: "Phase 1", description: "Edge orientation and corner positioning" }
    if (progress < 90) return { phase: "Phase 2", description: "Applying solution moves" }
    if (progress < 100) return { phase: "Final Phase", description: "Completing permutation" }
    return { phase: "Complete", description: "Cube successfully solved!" }
  }

  const phaseInfo = getPhaseInfo()

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStepIcon()}
          Two-Phase Algorithm Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{phaseInfo.phase}</span>
            <span className="text-gray-600">{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} className="w-full h-2" />
        </div>

        {/* Current Step */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm">Current Step</h4>
            {isSolving && (
              <Badge variant="secondary" className="animate-pulse">
                Processing...
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-700">{currentStep || "Ready to solve"}</p>
          <p className="text-xs text-gray-500 mt-1">{phaseInfo.description}</p>
        </div>

        {/* Current Move Display */}
        {currentMove && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-sm text-blue-800">Current Move</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-mono font-bold text-blue-600">{currentMove}</span>
                  <span className="text-sm text-blue-600">{getMoveDescription(currentMove)}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-blue-600">Move Progress</div>
                <div className="text-sm font-semibold text-blue-800">
                  {Math.max(0, Math.floor(((progress - 60) / 40) * totalMoves))} / {totalMoves}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Algorithm Phases */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className={`p-3 rounded-lg border-2 ${progress >= 10 && progress < 60 ? "border-yellow-300 bg-yellow-50" : progress >= 60 ? "border-green-300 bg-green-50" : "border-gray-200 bg-gray-50"}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${progress >= 10 ? "bg-green-500" : "bg-gray-300"}`} />
              <h5 className="font-semibold text-xs">Phase 1</h5>
            </div>
            <p className="text-xs text-gray-600">Edge Orientation</p>
            <p className="text-xs text-gray-600">Corner Positioning</p>
          </div>

          <div
            className={`p-3 rounded-lg border-2 ${progress >= 60 && progress < 100 ? "border-yellow-300 bg-yellow-50" : progress >= 100 ? "border-green-300 bg-green-50" : "border-gray-200 bg-gray-50"}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${progress >= 60 ? "bg-green-500" : "bg-gray-300"}`} />
              <h5 className="font-semibold text-xs">Phase 2</h5>
            </div>
            <p className="text-xs text-gray-600">Final Permutation</p>
            <p className="text-xs text-gray-600">Solution Complete</p>
          </div>
        </div>

        {/* Algorithm Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-gray-50 rounded p-2">
            <div className="text-xs text-gray-600">Complexity</div>
            <div className="font-semibold text-sm">O(1)</div>
          </div>
          <div className="bg-gray-50 rounded p-2">
            <div className="text-xs text-gray-600">Max Moves</div>
            <div className="font-semibold text-sm">≤20</div>
          </div>
          <div className="bg-gray-50 rounded p-2">
            <div className="text-xs text-gray-600">Type</div>
            <div className="font-semibold text-sm">2-Phase</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function getMoveDescription(move: string): string {
  const descriptions: { [key: string]: string } = {
    F: "Front Clockwise",
    "F'": "Front Counter-CW",
    F2: "Front 180°",
    B: "Back Clockwise",
    "B'": "Back Counter-CW",
    B2: "Back 180°",
    R: "Right Clockwise",
    "R'": "Right Counter-CW",
    R2: "Right 180°",
    L: "Left Clockwise",
    "L'": "Left Counter-CW",
    L2: "Left 180°",
    U: "Up Clockwise",
    "U'": "Up Counter-CW",
    U2: "Up 180°",
    D: "Down Clockwise",
    "D'": "Down Counter-CW",
    D2: "Down 180°",
  }
  return descriptions[move] || "Unknown Move"
}
