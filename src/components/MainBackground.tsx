import React from 'react'
import { StyleSheet } from 'react-native'
import { getColorProperty } from '../helpers'
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

export default function MainBackground({
  children,
  noSpace
}: {
  children: React.ReactNode
  noSpace?: boolean
}) {
  const insets = useSafeAreaInsets()

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: getColorProperty(undefined, 'darkest'),
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
