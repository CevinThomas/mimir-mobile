import { TouchableOpacity, View } from 'react-native'
import NormalText from '../Typography/NormalText'
import Ionicons from '@expo/vector-icons/Ionicons'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import DeckListItem from '../DeckListItem'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

export default function DeckWithFolder({ deck, hideFolder, onViewedPress, isNew = false }) {
  const [expanded, setExpanded] = useState(true)
  const animatedHeight = useSharedValue(1) // Initial height scale (1 = 100%)

  const toggleExpand = () => {
    animatedHeight.value = withTiming(expanded ? 0 : 1, { duration: 400 }) // Animate height
    setExpanded(!expanded)
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: animatedHeight.value * (deck.decks.length * 150), // Map shared value to height percentage
      overflow: 'hidden'
    }
  })

  return (
    <View>
      {deck.folder && !hideFolder && deck.decks.length > 0 && (
        <View>
          <View
            style={{
              marginBottom: !deck.folder.description && 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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

            <View style={{ width: '50%', alignItems: 'flex-end' }}>
              <TouchableOpacity onPress={toggleExpand}>
                <Ionicons
                  name={expanded ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={'white'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {deck.folder.description && (
        <View style={{ marginBottom: 10 }}>
          <NormalText style={{ fontSize: 16 }}>{deck.folder.description}</NormalText>
        </View>
      )}

      <Animated.View style={[animatedStyle]}>
        {deck.decks.map((deck) => {
          return (
            <View key={deck.id}>
              <DeckListItem
                ongoingDeck={false}
                onDelete={() => {}}
                deck={deck}
                isNew={isNew}
                onViewedPress={onViewedPress}
              />
            </View>
          )
        })}
      </Animated.View>
    </View>
  )
}
