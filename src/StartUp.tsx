import { AuthProvider } from './context/AuthContext'
import App from './App'
import { CreateDeckProvider } from './context/CreateDeckContext'

export default function StartUp() {
  return (
    <AuthProvider>
      <CreateDeckProvider>
        <App />
      </CreateDeckProvider>
    </AuthProvider>
  )
}
