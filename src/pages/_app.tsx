import '@/styles/globals.scss'
import type { AppProps } from 'next/app'
import Layout from '../../components/Layout'
import LoginModal from '../../components/modals/LoginModal'
import RegisterModal from '../../components/modals/RegisterModal'

import '../../components/Button/Button.scss'
import '../../components/Input/Input.scss'
import '../../components/Modal/Modal.scss'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <RegisterModal/>
      <LoginModal/>
      <Layout>
        <Component {...pageProps} />
      </Layout> 
    </>
  )
}
