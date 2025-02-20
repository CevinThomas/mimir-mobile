import React from 'react'
import { StyleSheet } from 'react-native'
import { Button } from '@rneui/base'

export default function ChoiceButton({ children, onPress, disabled, backgroundColor }) {
  return (
    <Button
      disabled={disabled}
      disabledStyle={{ backgroundColor }}
      title={children}
      onPress={onPress}
      buttonStyle={[styles.container, { backgroundColor }]}
      titleStyle={[styles.text]}
      titleProps={{ numberOfLines: 0 }}
      onPress={onPress}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 18,
    width: '100%',
    borderRadius: 10
  },
  text: {
    fontSize: 14,
    textAlign: 'left',
    width: '70%'
  }
})
