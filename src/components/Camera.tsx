import React, { useContext, useEffect } from 'react'
import { CameraContext } from '../contexts/Camera'
import styles from '../styles/components/Camera.module.css'

export function Camera() {
  const { useCameraDevice } = useContext(CameraContext)
  const { camRef, overlayRef, isEnable, isInitializing } =
    useContext(CameraContext)

  return (
    <div className={styles.cameraContainer}>
      <div
        className={`${styles.cameraComponent} ${
          isInitializing || isEnable ? styles.enable : styles.disable
        }`}
      >
        <video autoPlay ref={camRef} />
        <canvas ref={overlayRef} />
      </div>
      {isEnable ? null : (
        <div className={styles.handleCameraDisable}>
          {isInitializing ? (
            <p>Iniciando video...</p>
          ) : (
            <>
              <p>O reconhecimento facial precisa acessar sua câmera</p>
              <button onClick={useCameraDevice}>Permitir Acesso</button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
