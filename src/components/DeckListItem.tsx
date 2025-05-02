import React, { useEffect } from 'react'
import { View } from 'react-native'
import ClickButton from './Buttons/ClickButton'
import { useNavigation } from '@react-navigation/native'
import NormalText from './Typography/NormalText'
import CardsIcon from '../svgs/CardsIcon'

export default function DeckListItem({ deck, ongoingDeck, ...props }) {
  const navigation = useNavigation()

  const [deckData, setDeckData] = React.useState(ongoingDeck ? deck.deck : deck)

  useEffect(() => {
    if (ongoingDeck) {
      const deckToUpdate = {
        ...deck.deck,
        deckSessionId: deck.id
      }
      setDeckData(deckToUpdate)
    }
  }, [])

  return (
    <View style={{ marginBottom: 10 }}>
      <View key={deck.id}>
        <ClickButton
          {...props}
          onPress={() => navigation.navigate('Deck', { deck: deckData, ongoingDeck })}
        >
          <View style={{ paddingHorizontal: 10 }}>
            <View
              style={{
                width: '100%',
                marginBottom: 30,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end'
              }}
            >
              <CardsIcon />
              <NormalText style={{ fontSize: 18, marginLeft: 10, color: 'rgba(0,0,0,0.4)' }}>
                {deckData.number_of_cards}
              </NormalText>
            </View>
            <View>
              <NormalText style={{ color: '#000' }}>{deckData.description}</NormalText>
            </View>
            <View>
              <NormalText style={{ fontWeight: 'bold', fontSize: 24, color: '#000' }}>
                {deckData.name}
              </NormalText>
            </View>
          </View>
        </ClickButton>
      </View>
    </View>
  )
}
