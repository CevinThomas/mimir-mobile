import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Button } from '@rneui/themed'

export default function ClickButton({ children, onPress, short, background }) {
  return (
    <View>
      <Button
        onPress={onPress}
        buttonStyle={[
          styles.button,
          {
            backgroundColor: '#E9E9E9'
          }
        ]}
        titleStyle={[styles.titleStyle, { color: '#000', width: short ? '50%' : '100%' }]}
        titleProps={{ numberOfLines: 1, ellipsizeMode: 'tail' }}
      >
        {children}
      </Button>
    </View>
  )
}
const styles = StyleSheet.create({
  titleStyle: {
    textAlign: 'left',
    fontSize: 16
  },
  shadowStyles: {
    shadowColor: 'black',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 }
  },
  button: {
    borderRadius: 4,
    padding: 12,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  }
})
