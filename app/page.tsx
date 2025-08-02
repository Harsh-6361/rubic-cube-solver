"use client"
import dynamic from "next/dynamic"
import { Suspense } from "react"

// Dynamically import the CubeSolver component to avoid SSR issues with Three.js
const CubeSolver = dynamic(() => import("@/components/cube-solver").then((mod) => ({ default: mod.CubeSolver })), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Loading Rubik's Cube Solver...</p>
      </div>
    </div>
  ),
})

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Loading Rubik's Cube Solver...</p>
          </div>
        </div>
      }
    >
      <CubeSolver />
    </Suspense>
  )
}
