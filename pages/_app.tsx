
import type { AppProps } from 'next/app'
import { Router } from 'next/router';
import { Provider } from 'react-redux'

import store from '../state/store'
import Layout from '../components/Layout'

import '../styles/globals.css'


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  )
}
export default MyApp
