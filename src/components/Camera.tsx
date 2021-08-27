import React, { useContext, useEffect } from 'react'
import { CameraContext } from '../contexts/Camera'
import { RecognitionContext } from '../contexts/Recognition'
import styles from '../styles/components/Camera.module.css'

export function Camera() {
  const { useCameraDevice } = useContext(CameraContext)
  const { RecognitionStatus } = useContext(RecognitionContext)

  const { camRef, overlayRef, isEnable, isDenied, isInitializing } =
    useContext(CameraContext)

  return (
    <div className={styles.cameraContainer}>
      <div
        className={`${styles.cameraComponent} ${
          isInitializing || isEnable ? styles.enable : styles.disable
        }`}
      >
        <video autoPlay ref={camRef} />
        {RecognitionStatus === 'initializing' ? (
          <span>Carregando o reconhecimento facial</span>
        ) : null}
        <canvas ref={overlayRef} />
      </div>
      {isEnable ? null : (
        <div className={styles.handleCameraDisable}>
          {isDenied ? (
            <p>
              A câmera está bloqueada. Precisamos dela para o reconhecimento
              facial.
            </p>
          ) : (
            <>
              {isInitializing ? (
                <p>Iniciando video...</p>
              ) : (
                <>
                  <p>O reconhecimento facial precisa acessar sua câmera</p>
                  <button onClick={useCameraDevice}>Permitir Acesso</button>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
