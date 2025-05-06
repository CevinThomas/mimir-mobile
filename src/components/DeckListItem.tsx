import React, { useEffect } from 'react'
import { View } from 'react-native'
import ClickButton from './Buttons/ClickButton'
import { useNavigation } from '@react-navigation/native'
import NormalText from './Typography/NormalText'
import CardsIcon from '../svgs/CardsIcon'
import ProgressBar from 'react-native-progress/Bar'

export default function DeckListItem({ deck, ongoingDeck, ...props }) {
  const navigation = useNavigation()

  const [deckData, setDeckData] = React.useState(ongoingDeck ? deck.deck : deck)
  const [progress, setProgress] = React.useState(0)

  useEffect(() => {
    if (ongoingDeck) {
      const totalCards = deck.deck.cards.length - deck.deck_session_excluded_cards.length
      const correctCards = deck.filtered_answered_cards.filter((card) => card.correct).length
      setProgress(Math.round((correctCards / totalCards) * 100))
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
                marginBottom: 30,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%'
                }}
              >
                <View>
                  {ongoingDeck && (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <ProgressBar
                        borderRadius={20}
                        height={12}
                        unfilledColor={'#D4D4D4'}
                        color={'#68C281'}
                        progress={progress / 100}
                        width={100}
                        borderColor={'#D4D4D4'}
                      />
                      <NormalText style={{ color: 'rgba(0,0,0, 0.4)', paddingLeft: 10 }}>
                        {progress}%
                      </NormalText>
                    </View>
                  )}
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <CardsIcon />
                  <NormalText style={{ fontSize: 18, marginLeft: 10, color: 'rgba(0,0,0,0.4)' }}>
                    {deckData.number_of_cards}
                  </NormalText>
                </View>
              </View>
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
