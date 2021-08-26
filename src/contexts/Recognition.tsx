import { useContext, useEffect } from 'react'
import { createContext, ReactNode } from 'react'
import * as faceapi from 'face-api.js'
import { CameraContext } from './Camera'

interface RecognitionData {}

interface RecognitionProps {
  children: ReactNode
}

export const RecognitionContext = createContext({} as RecognitionData)

export function RecognitionProvider({ children }: RecognitionProps) {
  function loadRecognitionModels() {}

  function loadRecognitionFaces() {}

  return (
    <RecognitionContext.Provider value={{}}>
      {children}
    </RecognitionContext.Provider>
  )
}
