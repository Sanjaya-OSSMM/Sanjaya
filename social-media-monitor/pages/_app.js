import { ThemeProvider } from 'next-themes'
import '../globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp