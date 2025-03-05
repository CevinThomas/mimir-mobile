import React from 'react'
import { StyleSheet } from 'react-native'
import { getColorProperty } from '../../helpers'
import { Button } from '@rneui/base'

export default function ClearButton({ children, onPress }) {
  return (
    <Button
      title={children}
      onPress={onPress}
      buttonStyle={[
        styles.container,
        {
          backgroundColor: getColorProperty(undefined, 'white'),
          borderColor: getColorProperty(undefined, 'white')
        }
      ]}
      titleStyle={{ color: getColorProperty(undefined, 'darkGray') }}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    width: '100%',
    borderRadius: 40,
    borderWidth: 1
  }
})
