import { useEffect, useState } from 'react'
import * as SplashScreen from 'expo-splash-screen'

export default function useSplashScreen() {
  const [appIsReady, setAppIsReady] = useState(false)

  SplashScreen.preventAutoHideAsync()
  SplashScreen.setOptions({
    duration: 500,
    fade: true
  })

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.hideAsync()
      } catch (e) {
      } finally {
        setAppIsReady(true)
      }
    }

    setTimeout(prepare, 500)
  }, [])

  return appIsReady
}
