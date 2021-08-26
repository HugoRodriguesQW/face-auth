import { GetServerSideProps } from 'next'
import { AppProps } from 'next/app'

import { CameraProvider } from '../contexts/Camera'
import { RecognitionProvider } from '../contexts/Recognition'

import '../styles/global.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  console.info(pageProps)
  return (
    <CameraProvider>
      <RecognitionProvider>
        <Component {...pageProps} />
      </RecognitionProvider>
    </CameraProvider>
  )
}
