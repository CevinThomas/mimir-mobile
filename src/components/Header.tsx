import React from 'react'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import BackIcon from '../svgs/BackIcon'
import { Button } from '@rneui/base'

export default function Header() {
  const navigation = useNavigation()
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
      <Button onPress={() => navigation.goBack()} buttonStyle={{ backgroundColor: 'transparent' }}>
        <BackIcon />
      </Button>
    </View>
  )
}
