import Head from 'next/head'
import styles from '../styles/Home.module.css'

import { newInquiry } from '@persona-js/verify'

export default function Home(props) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Prefill - @persona-js Demo Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Prefill Demo</h1>

        <div className={styles.grid}>
          <a
            href="#"
            className={styles.card}
            onClick={() => {
              const persona = newInquiry(props.templateId, { prefill: { nameFirst: 'Kengo', nameLast: 'Hamasaki' } })
              persona.start()
            }}
          >
            <h3>Embedded Flow 1 &rarr;</h3>
            <p>
              Prefill <code>nameFirst, nameLast</code> through the constructor function
              <br />
            </p>
          </a>

          <a
            href="#"
            className={styles.card}
            onClick={() => {
              const persona = newInquiry(props.templateId)
              persona.prefill({
                countryCode: 'US',
                addressSubdivision: 'CA',
                addressCity: 'San Francisco',
              })
              persona.start()
            }}
          >
            <h3>Embedded Flow 2 &rarr;</h3>
            <p>
              Prefill <code>countryCode, addressSubdivision, addressCity</code> through the <code>prefill</code>{' '}
              function
            </p>
          </a>

          <a
            href="#"
            className={styles.card}
            onClick={() => {
              const persona = newInquiry(props.templateId, { prefill: { birthdate: '1986-08-26' } })
              window.open(persona.getHostedFlowUrl())
            }}
          >
            <h3>Hosted Flow 1 &rarr;</h3>
            <p>
              Prefill <code>birthdate</code> through the constructor function
            </p>
          </a>

          <a
            href="#"
            className={styles.card}
            onClick={() => {
              const persona = newInquiry(props.templateId)
              persona.prefill({
                countryCode: 'JP',
                emailAddress: 'k.hamasaki@gmail.com',
              })
              window.open(persona.getHostedFlowUrl())
            }}
          >
            <h3>Hosted Flow 2 &rarr;</h3>
            <p>
              Prefill <code>countryCode, emailAddress</code> through the <code>prefill</code> function
            </p>
          </a>
        </div>
      </main>
    </div>
  )
}

export async function getStaticProps() {
  return { props: { templateId: process.env.NEXT_NEW_INQUIRY_TEMPLATE_ID } }
}
