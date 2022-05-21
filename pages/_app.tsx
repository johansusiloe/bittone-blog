import React, { FC } from 'react'

import '../styles/globals.scss'
import { Layout } from '../components'

interface Props {
  Component: string
  pageProps: any
}

const MyApp = (
  {
    Component,
    pageProps
  }: Props
) => {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
