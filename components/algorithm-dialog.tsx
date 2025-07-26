"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Algorithm } from "@/lib/algorithms"

interface AlgorithmDialogProps {
  algorithm: Algorithm
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AlgorithmDialog({ algorithm, open, onOpenChange }: AlgorithmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{algorithm.name}</DialogTitle>
          <DialogDescription>{algorithm.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Time: {algorithm.timeComplexity}</Badge>
            <Badge variant="outline">Space: {algorithm.spaceComplexity}</Badge>
            <Badge variant="outline">Type: {algorithm.type}</Badge>
            <Badge variant="outline">Difficulty: {algorithm.difficulty}</Badge>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3">How it Works</h3>
            <div className="space-y-3">
              {algorithm.steps.map((step, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium">
                    Step {index + 1}: {step.name}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  {step.moves && <p className="text-xs text-gray-500 mt-2">Common moves: {step.moves.join(", ")}</p>}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3">Advantages</h3>
            <ul className="space-y-1">
              {algorithm.advantages.map((advantage, index) => (
                <li key={index} className="text-sm flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  {advantage}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Disadvantages</h3>
            <ul className="space-y-1">
              {algorithm.disadvantages.map((disadvantage, index) => (
                <li key={index} className="text-sm flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  {disadvantage}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3">Time Complexity Analysis</h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm">{algorithm.complexityExplanation}</p>
            </div>
          </div>

          {algorithm.bestFor && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Best For</h3>
              <p className="text-sm text-gray-600">{algorithm.bestFor}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
