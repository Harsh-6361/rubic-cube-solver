"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { BookOpen } from "lucide-react"

export function AlgorithmDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <BookOpen className="h-4 w-4" />
          Learn Algorithms
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Rubik's Cube Solving Algorithms</DialogTitle>
          <DialogDescription>Learn about the different algorithms used to solve the Rubik's cube</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Two-Phase Algorithm (Kociemba Method)</h3>
                <div className="flex gap-2">
                  <Badge variant="secondary">O(1) Time</Badge>
                  <Badge variant="outline">Computer</Badge>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Computer-optimized algorithm that solves any cube in two phases with minimal moves, inspired by
                Kociemba's method.
              </p>
              <div className="space-y-2">
                <h4 className="font-medium">How it works:</h4>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Phase 1: Reduction to G1 Subgroup - Orient all edges and position corners</li>
                  <li>• Phase 2: Solve within G1 - Complete the solve using restricted moves</li>
                  <li>• Guaranteed optimal or near-optimal solutions (≤20 moves)</li>
                  <li>• Uses lookup tables for extremely fast computation</li>
                </ul>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Layer-by-Layer (Beginner's Method)</h3>
                <div className="flex gap-2">
                  <Badge variant="secondary">O(n³) Time</Badge>
                  <Badge variant="outline">Beginner</Badge>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                The most intuitive method that solves the cube layer by layer, starting from the bottom.
              </p>
              <div className="space-y-2">
                <h4 className="font-medium">Steps:</h4>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• White Cross - Form a cross on the bottom layer</li>
                  <li>• White Corners - Position and orient white corner pieces</li>
                  <li>• Middle Layer - Solve the middle layer edge pieces</li>
                  <li>• Yellow Cross - Form a cross on the top layer</li>
                  <li>• Yellow Corners - Orient the yellow corner pieces</li>
                  <li>• Final Layer - Position the final layer pieces correctly</li>
                </ul>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">CFOP Method</h3>
                <div className="flex gap-2">
                  <Badge variant="secondary">O(n²) Time</Badge>
                  <Badge variant="outline">Advanced</Badge>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                The most popular speedcubing method used by world record holders.
              </p>
              <div className="space-y-2">
                <h4 className="font-medium">Phases:</h4>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Cross - Form a cross on the bottom layer in 8 moves or less</li>
                  <li>• F2L (First Two Layers) - Solve corner-edge pairs simultaneously</li>
                  <li>• OLL (Orientation of Last Layer) - Orient all pieces on the last layer</li>
                  <li>• PLL (Permutation of Last Layer) - Permute the last layer pieces</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Cube Notation</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>
                <strong>F</strong> = Front, <strong>B</strong> = Back, <strong>R</strong> = Right, <strong>L</strong> =
                Left, <strong>U</strong> = Up, <strong>D</strong> = Down
              </p>
              <p>
                <strong>'</strong> = Counter-clockwise turn, <strong>2</strong> = 180° turn
              </p>
              <p>Example: R = Right face clockwise, R' = Right face counter-clockwise, R2 = Right face 180°</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
