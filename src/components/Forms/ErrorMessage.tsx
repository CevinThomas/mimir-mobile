import React from 'react'
import { StyleSheet, View } from 'react-native'
import NormalText from '../Typography/NormalText'

interface ErrorMessageProps {
  message: string
  visible: boolean
}

export default function ErrorMessage({ message, visible }: ErrorMessageProps) {
  if (!visible || !message) {
    return null
  }

  return (
    <View style={styles.container}>
      <NormalText style={styles.errorText}>{message}</NormalText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5
  },
  errorText: {
    color: '#FF3B30', // iOS red color for errors
    fontSize: 12
  }
})
