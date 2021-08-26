import Head from 'next/head'
import React from 'react'
import { Camera } from '../components/Camera'

export default function Home() {
  return (
    <div>
      <Head>
        <title></title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <h1>Face Auth</h1>
      <Camera />
    </div>
  )
}
