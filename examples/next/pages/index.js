import Head from 'next/head'
import styles from '../styles/Home.module.css'

import { newInquiry } from '@persona-js/verify'

export default function Home(props) {
  const persona = newInquiry(props.templateId)
  return (
    <div className={styles.container}>
      <Head>
        <title>@persona-js Demo Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>@perosona-js demo with Next.js</h1>

        <div className={styles.grid}>
          <a href="#" className={styles.card} onClick={() => persona.start()}>
            <h3>Start Embedded Flow &rarr;</h3>
            <p>Open an iframe based verification flow.</p>
          </a>

          <a href="#" className={styles.card} onClick={() => window.open(persona.getHostedFlowUrl())}>
            <h3>Open Hosted Flow &rarr;</h3>
            <p>Open a new tab to get through hoted verification flow.</p>
          </a>

          <a href="https://github.com/hmsk/persona-js" className={styles.card} target="_blank" rel="noopener">
            <h3>Repository &rarr;</h3>
            <p>Source code of @persona-js/* packages</p>
          </a>

          <a
            href="https://www.npmjs.com/package/@persona-js/verify"
            className={styles.card}
            target="_blank"
            rel="noopener"
          >
            <h3>@persona-js/verify &rarr;</h3>
            <p>The vanilla JS client to run verification with withpersona.com</p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
          Powered by <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}

export async function getStaticProps() {
  return { props: { templateId: process.env.NEXT_NEW_INQUIRY_TEMPLATE_ID } }
}
