import { AuthProvider } from './context/AuthContext'
import App from './App'
import { CreateDeckProvider } from './context/CreateDeckContext'
import { ThemeProvider } from './context/ThemeContext'
import { UserProvider } from './context/UserContext'
import useSplashScreen from './hooks/useSplashScreen'
import { StoreProvider } from './context/StoreContext'

export default function StartUp() {
  const isReady = useSplashScreen()
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
