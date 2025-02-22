import React from 'react'
import { View } from 'react-native'
import NormalText from './Typography/NormalText'
import { useNavigation } from '@react-navigation/native'

export default function Header() {
  const navigation = useNavigation()
  return (
    <View style={{ position: 'absolute', top: 50, left: 0, right: 0, zIndex: 1, paddingLeft: 20 }}>
      <NormalText onPress={() => navigation.goBack()}>Back</NormalText>
    </View>
  )
}
