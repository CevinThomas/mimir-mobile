import { useEffect } from 'react'
import { BackHandler } from 'react-native'

export default function useDenyBackButton() {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true
    })
    return () => backHandler.remove()
  }, [])
}
