import { View } from 'react-native'
import NormalText from '../Typography/NormalText'
import Ionicons from '@expo/vector-icons/Ionicons'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import DeckListItem from '../DeckListItem'
import { viewedAccountDecks } from '../../api/DecksApi'

export default function DeckWithFolder({ deck, hideFolder, onViewedPress }) {
  const navigation = useNavigation()
  return (
    <View>
      {deck.folder && !hideFolder && deck.decks.length > 0 && (
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
            {onViewedPress && (
              <NormalText
                onPress={() => {
                  viewedAccountDecks(deck.id)
                  onViewedPress()
                }}
              >
                Viewed
              </NormalText>
            )}
            <DeckListItem deck={deck} onPress={() => navigation.navigate('Deck', { deck })} />
          </View>
        )
      })}
    </View>
  )
}
