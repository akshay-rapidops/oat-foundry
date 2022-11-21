import '../styles/globals.css'
import '../styles/form.css'
import type { AppProps } from 'next/app'
import Layout from "../src/modules/layout/layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (<>

        <Layout>
            <Component {...pageProps} />
        </Layout>

  </>)
}

export default MyApp
