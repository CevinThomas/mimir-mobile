import { View } from 'react-native'
import NormalText from '../Typography/NormalText'
import Ionicons from '@expo/vector-icons/Ionicons'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import DeckListItem from '../DeckListItem'

export default function DeckWithFolder({ deck, hideFolder }) {
  const navigation = useNavigation()
  return (
    <View>
      {deck.folder && !hideFolder && (
        <View
          style={{
            marginBottom: !deck.folder.description && 10,
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Ionicons name={'folder'} size={24} color={'white'} />
          <NormalText
            style={{
              fontWeight: 'bold',
              fontSize: 18,
              marginLeft: 10
            }}
          >
            {deck.folder.name}
          </NormalText>
        </View>
      )}

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
