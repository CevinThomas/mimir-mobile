import React from 'react'
import { View } from 'react-native'
import ClickButton from './Buttons/ClickButton'
import { useNavigation } from '@react-navigation/native'
import NormalText from './Typography/NormalText'
import CardsIcon from '../svgs/CardsIcon'

export default function DeckListItem({ deck, ...props }) {
  const navigation = useNavigation()

  return (
    <View>
      <View key={deck.id}>
        <ClickButton {...props} onPress={() => navigation.navigate('Deck', { deck })}>
          <View style={{ paddingHorizontal: 10 }}>
            <View style={{ marginBottom: 30, flexDirection: 'row', alignItems: 'center' }}>
              <CardsIcon />
              <NormalText style={{ fontSize: 18, marginLeft: 10 }}>
                {deck.number_of_cards}
              </NormalText>
            </View>
            <View style={{}}>
              <NormalText>{deck.description}</NormalText>
            </View>
            <View style={{}}>
              <NormalText style={{ fontWeight: 'bold', fontSize: 24 }}>{deck.name}</NormalText>
            </View>
          </View>
        </ClickButton>
      </View>
    </View>
  )
}
