import React from 'react'
import { View } from 'react-native'
import ClickButton from './Buttons/ClickButton'
import { useNavigation } from '@react-navigation/native'
import NormalText from './Typography/NormalText'

export default function DeckListItem({ deck, ...props }) {
  const navigation = useNavigation()

  return (
    <View>
      <View style={{ marginBottom: 10 }}>
        <NormalText>{deck.folder.name}</NormalText>
      </View>

      {deck.decks.map((deck) => (
        <View key={deck.id} style={{ height: 60 }}>
          <ClickButton {...props} onPress={() => navigation.navigate('Deck', { deck })}>
            {deck.name}
          </ClickButton>
        </View>
      ))}
    </View>
  )
}
