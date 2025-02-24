import React from 'react'
import { View } from 'react-native'
import NormalText from './Typography/NormalText'
import { useNavigation } from '@react-navigation/native'

export default function Header() {
  const navigation = useNavigation()
  return (
    <View style={{ position: 'absolute', top: 70, left: 10, right: 0, zIndex: 1 }}>
      <NormalText onPress={() => navigation.goBack()}>Back</NormalText>
    </View>
  )
}
