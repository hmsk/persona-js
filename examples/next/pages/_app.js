import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <footer>
        @persona-js is by&nbsp;
        <a href="https://github.com/hmsk" target="_blank" rel="noopener">
          Kengo Hamasaki
        </a>
        &nbsp;&amp;&nbsp;This demo page is hosted by
        <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
          <img src="/vercel.svg" alt="Vercel Logo" />
        </a>
      </footer>
    </>
  )
}

export default MyApp
