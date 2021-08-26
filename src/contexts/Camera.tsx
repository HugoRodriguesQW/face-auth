import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { createContext, ReactNode } from 'react'

interface CameraData {
  isInitializing: boolean
  isEnable: boolean
  isDenied: boolean
  camRef: MutableRefObject<HTMLVideoElement>
  overlayRef: MutableRefObject<HTMLCanvasElement>
  useCameraDevice: () => void
  removeCameraDevice: () => void
}

interface CameraProps {
  children: ReactNode
}

export const CameraContext = createContext({} as CameraData)

export function CameraProvider({ children }: CameraProps) {
  const camRef = useRef({} as HTMLVideoElement)
  const overlayRef = useRef({} as HTMLCanvasElement)
  const [isEnable, setIsEnable] = useState(false)
  const [isDenied, setIsDenied] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)

  const [stream, setStream] = useState({} as MediaStream)

  function useCameraDevice() {
    setIsInitializing(true)
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      if (Array.isArray(devices)) {
        devices.forEach((device) => {
          if (device.kind == 'videoinput') {
            navigator.getUserMedia(
              { video: true },
              (strm) => {
                console.info('streaming', strm)
                camRef.current.srcObject = strm
                setStream(strm)
                setIsEnable(true)
                setIsDenied(false)
                setIsInitializing(false)
              },
              () => {
                checkCameraPermission()
              }
            )
          }
        })
      }
    })
  }

  function removeCameraDevice() {
    stream.getTracks().forEach((track) => {
      track.stop()
    })
    setIsEnable(false)
  }

  function checkCameraPermission() {
    navigator?.permissions.query({ name: 'camera' }).then((res) => {
      if (res.state == 'granted') {
        useCameraDevice()
      }
      if (res.state == 'denied') {
        setIsDenied(true)
      }
    })
  }

  useEffect(checkCameraPermission, [])

  return (
    <CameraContext.Provider
      value={{
        isInitializing,
        isEnable,
        isDenied,
        camRef,
        overlayRef,
        useCameraDevice,
        removeCameraDevice,
      }}
    >
      {children}
    </CameraContext.Provider>
  )
}
