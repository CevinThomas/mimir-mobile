import React from 'react'
import { StyleSheet } from 'react-native'
import { useTheme } from '../context/ThemeContext'
import { getColorProperty } from '../helpers'
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

export default function MainBackground({
  children,
  noSpace
}: {
  children: React.ReactNode
  noSpace?: boolean
}) {
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: getColorProperty(theme, 'background'),
            paddingTop: noSpace ? 0 : insets.top
          }
        ]}
      >
        {children}
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10
  }
})
