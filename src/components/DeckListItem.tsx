import React from 'react'
import { View } from 'react-native'
import ClickButton from './Buttons/ClickButton'
import { useNavigation } from '@react-navigation/native'

export default function DeckListItem({ deck, ...props }) {
  const navigation = useNavigation()

  return (
    <View style={{ height: 60 }}>
      <ClickButton {...props} onPress={() => navigation.navigate('Deck', { deck })}>
        {deck.name}
      </ClickButton>
    </View>
  )
}
