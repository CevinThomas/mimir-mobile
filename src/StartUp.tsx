import { AuthProvider } from './context/AuthContext'
import App from './App'
import { CreateDeckProvider } from './context/CreateDeckContext'
import { ThemeProvider } from './context/ThemeContext'
import { UserProvider } from './context/UserContext'
import useSplashScreen from './hooks/useSplashScreen'
import { StoreProvider } from './context/StoreContext'
import * as NavigationBar from 'expo-navigation-bar'
import { setStatusBarHidden } from 'expo-status-bar'

export default function StartUp() {
  const isReady = useSplashScreen()

  NavigationBar.setBackgroundColorAsync('#00000080') // `rgba(0,0,0,0.5)`
  setStatusBarHidden(true, 'none')

  return (
    <StoreProvider>
      <AuthProvider>
        <ThemeProvider>
          <UserProvider>
            <CreateDeckProvider>
              <App />
            </CreateDeckProvider>
          </UserProvider>
        </ThemeProvider>
      </AuthProvider>
    </StoreProvider>
  )
}
