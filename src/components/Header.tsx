import React from 'react'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import BackIcon from '../svgs/BackIcon'
import { Button } from '@rneui/base'

type HeaderProps = {
  onBack?: () => void
}
export default function Header({ onBack }) {
  const navigation = useNavigation()

  function handleBackPress() {
    if (onBack) {
      onBack()
    } else {
      navigation.goBack()
    }
  }
  return (
    <View
      style={{
        position: 'absolute',
        top: 70,
        left: 5,
        right: 0,
        zIndex: 1,
        width: '10%'
      }}
    >
      <Button onPress={handleBackPress} buttonStyle={{ backgroundColor: 'transparent' }}>
        <BackIcon />
      </Button>
    </View>
  )
}
