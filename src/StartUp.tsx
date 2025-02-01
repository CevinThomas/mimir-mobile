import { AuthProvider } from './context/AuthContext'
import App from './App'

export default function StartUp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}
