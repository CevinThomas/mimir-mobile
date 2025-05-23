import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import ClickButton from './Buttons/ClickButton'
import { useNavigation } from '@react-navigation/native'
import NormalText from './Typography/NormalText'
import CardsIcon from '../svgs/CardsIcon'
import ProgressBar from 'react-native-progress/Bar'
import Ionicons from '@expo/vector-icons/Ionicons'

export default function DeckListItem({
  deck,
  ongoingDeck,
  onDelete,
  isNew = false,
  isFeatured = false,
  ...props
}) {
  const navigation = useNavigation()
  const [deckData, setDeckData] = useState(ongoingDeck ? deck.deck : deck)
  const [progress, setProgress] = useState(0)

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
      <ClickButton
        {...props}
        onPress={() => {
          // Get the current route name to track where we're coming from
          const currentRouteName = navigation.getState().routes[navigation.getState().index].name;
          navigation.navigate('Deck', {
            deck: deckData,
            ongoingDeck,
            isNew,
            onViewedPress: props.onViewedPress,
            previousScreen: currentRouteName
          });
        }}
      >
        <View style={{ paddingHorizontal: 10, position: 'relative' }}>
          {isNew && (
            <View
              style={{
                position: 'absolute',
                top: 5,
                left: 5,
                backgroundColor: '#68C281',
                borderRadius: 4,
                paddingHorizontal: 6,
                paddingVertical: 2,
                flexDirection: 'row',
                alignItems: 'center',
                zIndex: 1
              }}
            >
              <Ionicons name="star" size={14} color="white" />
              <NormalText style={{ color: 'white', fontSize: 12, marginLeft: 4 }}>NEW</NormalText>
            </View>
          )}
          {isFeatured && (
            <View
              style={{
                position: 'absolute',
                top: 5,
                left: isNew ? 65 : 5,
                backgroundColor: '#4A90E2',
                borderRadius: 4,
                paddingHorizontal: 6,
                paddingVertical: 2,
                flexDirection: 'row',
                alignItems: 'center',
                zIndex: 1
              }}
            >
              <Ionicons name="ribbon" size={14} color="white" />
              <NormalText style={{ color: 'white', fontSize: 12, marginLeft: 4 }}>
                FEATURED
              </NormalText>
            </View>
          )}
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
  )
}
