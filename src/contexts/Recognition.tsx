import { useContext, useEffect, useState } from 'react'
import { createContext, ReactNode } from 'react'
import * as faceapi from 'face-api.js'
import { CameraContext } from './Camera'

interface RecognitionData {
  RecognitionStatus: string
}

interface RecognitionProps {
  children: ReactNode
}

interface Detections {
  detections: faceapi.WithFaceLandmarks<
    {
      detection: faceapi.FaceDetection
    },
    faceapi.FaceLandmarks68
  >[]
}

export const RecognitionContext = createContext({} as RecognitionData)

export function RecognitionProvider({ children }: RecognitionProps) {
  const { isEnable, overlayRef, camRef } = useContext(CameraContext)
  const [RecognitionStatus, setStatus] = useState('resting')

  function loadRecognitionModels() {
    return Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models'),
      faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
    ])
  }

  function assignCanvasToOverlay() {
    const overlay = overlayRef.current
    overlay.innerHTML = faceapi.createCanvasFromMedia(camRef.current).innerHTML

    faceapi.matchDimensions(overlay, {
      width: camRef.current.clientWidth,
      height: camRef.current.clientHeight,
    })
  }

  function drawFaceDetections({ detections }: Detections) {
    const overlay = overlayRef.current
    overlay.getContext('2d')?.clearRect(0, 0, overlay.width, overlay.height)

    faceapi.draw.drawFaceLandmarks(overlay, detections)
  }

  async function detectAllFaces() {
    const overlay = overlayRef.current
    const detections = await faceapi
      .detectAllFaces(camRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()

    const adjustedDetections = faceapi.resizeResults(detections, {
      width: overlay.width,
      height: overlay.height,
    })
    return adjustedDetections
  }

  useEffect(() => {
    camRef.current.addEventListener('play', async () => {
      setStatus('initializing')
      await loadRecognitionModels()
      assignCanvasToOverlay()
      setStatus('working')

      setInterval(async () => {
        const detections = await detectAllFaces()
        drawFaceDetections({ detections })
      }, 200)
    })
  }, [])

  return (
    <RecognitionContext.Provider
      value={{
        RecognitionStatus,
      }}
    >
      {children}
    </RecognitionContext.Provider>
  )
}
