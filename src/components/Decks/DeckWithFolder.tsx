import { View } from 'react-native'
import NormalText from '../Typography/NormalText'
import Ionicons from '@expo/vector-icons/Ionicons'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import DeckListItem from '../DeckListItem'

export default function DeckWithFolder({ deck }) {
  const navigation = useNavigation()
  console.log(deck)
  return (
    <View>
      <View
        style={{
          marginBottom: !deck.folder.description && 10,
          flexDirection: 'row'
        }}
      >
        <NormalText
          style={{
            fontWeight: 'bold',
            fontSize: 18,
            marginRight: 10
          }}
        >
          {deck.folder.name}
        </NormalText>

        <Ionicons name={'folder'} size={24} color={'white'} />
      </View>
      {deck.folder.description && (
        <View style={{ marginBottom: 10 }}>
          <NormalText style={{ fontSize: 16 }}>{deck.folder.description}</NormalText>
        </View>
      )}

      {deck.decks.map((deck) => {
        return (
          <View key={deck.id}>
            <DeckListItem deck={deck} onPress={() => navigation.navigate('Deck', { deck })} />
          </View>
        )
      })}
    </View>
  )
}
