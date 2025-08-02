"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function AlgorithmVisualizer() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Algorithm Process</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Current Step</span>
            <Badge variant="secondary">Analysis</Badge>
          </div>
          <Progress value={25} className="h-2" />
        </div>

        <div className="text-sm text-gray-600">
          <p>The Two-Phase algorithm is analyzing the cube state to determine the optimal solution path.</p>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Process Steps:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Cube state analysis
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Phase 1: Edge orientation
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              Phase 2: Final solving
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              Solution verification
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
