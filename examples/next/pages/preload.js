import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

import { newInquiry } from '@persona-js/verify'
import { useState } from 'react'

export default function Preload(props) {
  const [client, setClient] = useState(null)
  const [preloaded, setPreloaded] = useState(false)

  return (
    <div className={styles.container}>
      <Head>
        <title>Preload - @persona-js Demo Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Preload Demo</h1>

        <div className={styles.grid}>
          <a
            href="#"
            className={styles.card}
            onClick={() => {
              const persona = newInquiry(props.templateId)
              setClient(persona)
              persona.preload().then(() => setPreloaded(true))
            }}
          >
            <h3>Preload &rarr;</h3>
            <p>Load invisible Persona interface beforehand</p>
          </a>

          {preloaded && (
            <a
              href="#"
              className={styles.card}
              onClick={() => {
                client
                  .on('exit', () => {
                    setPreloaded(false)
                  })
                  .start()
              }}
            >
              <h3>Start &rarr;</h3>
              <p>Preloaded! Start your verification without waiting for loading</p>
            </a>
          )}

          <Link href="/">
            <a href="/" className={styles.card}>
              <h3>&uarr;</h3>
              <p>Back to index page</p>
            </a>
          </Link>
        </div>
      </main>
    </div>
  )
}

export async function getStaticProps() {
  return { props: { templateId: process.env.NEXT_NEW_INQUIRY_TEMPLATE_ID } }
}
