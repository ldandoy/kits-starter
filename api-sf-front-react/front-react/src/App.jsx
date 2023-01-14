import Router from './Router'
import { DarkModeProvider } from './contexts/DarkModeContext'

function App() {
  return (
    <DarkModeProvider>
      <Router />
    </DarkModeProvider>
  )
}

export default App
