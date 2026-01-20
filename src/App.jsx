import './App.css'
import NavigationProvider from './Navigation.Provider'
import { RecoilRoot } from 'recoil'

import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <RecoilRoot>
      <ThemeProvider>
        <NavigationProvider />
      </ThemeProvider>
    </RecoilRoot>
  )
}

export default App
