import React, { useEffect, useState } from 'react'
import { LayoutChangeEvent, TouchableOpacity, View } from 'react-native'
import ClickButton from './Buttons/ClickButton'
import { useNavigation } from '@react-navigation/native'
import NormalText from './Typography/NormalText'
import CardsIcon from '../svgs/CardsIcon'
import ProgressBar from 'react-native-progress/Bar'
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'

export default function DeckListItemSwipe({
  deck,
  ongoingDeck,
  completed,
  onDelete,
  isNew = false,
  isFeatured = false,
  ...props
}) {
  const navigation = useNavigation()
  const [componentWidth, setComponentWidth] = useState(0)
  // Calculate 30% of the component width, with a fallback to 50
  const MAX_SWIPE_WIDTH = componentWidth * 0.3 || 50

  const [deckData, setDeckData] = React.useState(
    completed ? deck.deck : ongoingDeck ? deck.deck : deck
  )
  const [progress, setProgress] = React.useState(0)

  // Animated values for swipe
  const translateX = useSharedValue(0)
  const buttonWidth = useSharedValue(0)

  // Animated values for left swipe (delete button)
  const translateXLeft = useSharedValue(0)
  const buttonWidthLeft = useSharedValue(0)

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

  // Function to measure component width
  const onLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout
    setComponentWidth(width)
  }

  // Create a pan gesture handler
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX > 0) {
        // Right swipe - for share button (from left)
        // Reset any left swipe values first
        translateXLeft.value = 0
        buttonWidthLeft.value = 0

        // Then handle right swipe
        const newTranslateX = Math.min(event.translationX, MAX_SWIPE_WIDTH)
        translateX.value = newTranslateX
        buttonWidth.value = Math.min(newTranslateX, MAX_SWIPE_WIDTH)
      } else if (event.translationX < 0) {
        // Left swipe - for delete button (from right)
        // Reset any right swipe values first
        translateX.value = 0
        buttonWidth.value = 0

        // Then handle left swipe
        const absTranslation = Math.abs(event.translationX)
        const newTranslateXLeft = Math.min(absTranslation, MAX_SWIPE_WIDTH)
        translateXLeft.value = newTranslateXLeft
        buttonWidthLeft.value = Math.min(newTranslateXLeft, MAX_SWIPE_WIDTH)
      }
    })
    .onEnd(() => {
      // Snap to either 0 or MAX_SWIPE_WIDTH for right swipe (share button)
      if (translateX.value > MAX_SWIPE_WIDTH / 2) {
        translateX.value = withTiming(MAX_SWIPE_WIDTH)
        buttonWidth.value = withTiming(MAX_SWIPE_WIDTH)
      } else if (translateX.value > 0) {
        translateX.value = withTiming(0)
        buttonWidth.value = withTiming(0)
      }

      // Snap to either 0 or MAX_SWIPE_WIDTH for left swipe (delete button)
      if (translateXLeft.value > MAX_SWIPE_WIDTH / 2) {
        translateXLeft.value = withTiming(MAX_SWIPE_WIDTH)
        buttonWidthLeft.value = withTiming(MAX_SWIPE_WIDTH)
      } else if (translateXLeft.value > 0) {
        translateXLeft.value = withTiming(0)
        buttonWidthLeft.value = withTiming(0)
      }
    })

  // Create animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value - translateXLeft.value }]
    }
  })

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: buttonWidth.value,
      opacity: buttonWidth.value > 0 ? 1 : 0
    }
  })

  const buttonAnimatedStyleLeft = useAnimatedStyle(() => {
    return {
      width: buttonWidthLeft.value,
      opacity: buttonWidthLeft.value > 0 ? 1 : 0
    }
  })

  const handleShare = () => {
    // Reset the swipe
    translateX.value = withTiming(0)
    buttonWidth.value = withTiming(0)

    // Call the onDelete prop if provided (we're reusing the same prop for share functionality)
    if (onDelete) {
      onDelete(deck.id)
    }
  }

  const handleDelete = () => {
    // Reset the swipe
    translateXLeft.value = withTiming(0)
    buttonWidthLeft.value = withTiming(0)

    // Call the onDelete prop if provided
    if (onDelete) {
      onDelete(deck.id)
    }
  }

  return (
    <View style={{ marginBottom: 10 }}>
      <View key={deck.id} style={{ position: 'relative', overflow: 'hidden' }} onLayout={onLayout}>
        {/* Share button that appears when swiping right */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              backgroundColor: '#4CD964', // Green color
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1
            },
            buttonAnimatedStyle
          ]}
        >
          <TouchableOpacity
            onPress={handleShare}
            style={{
              height: '100%',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Ionicons name="share-outline" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>

        {/* Delete button that appears when swiping left */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              backgroundColor: '#FF3B30', // Red color
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1
            },
            buttonAnimatedStyleLeft
          ]}
        >
          <TouchableOpacity
            onPress={handleDelete}
            style={{
              height: '100%',
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Ionicons name="trash-outline" size={24} color="white" />
          </TouchableOpacity>
        </Animated.View>

        {/* Swipeable content */}
        <GestureHandlerRootView>
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[{ backgroundColor: 'white' }, animatedStyle]}>
              <ClickButton
                {...props}
                onPress={() => navigation.navigate('Deck', { deck: deckData, ongoingDeck, completed })}
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
                      <NormalText style={{ color: 'white', fontSize: 12, marginLeft: 4 }}>
                        NEW
                      </NormalText>
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
                        <NormalText
                          style={{ fontSize: 18, marginLeft: 10, color: 'rgba(0,0,0,0.4)' }}
                        >
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
            </Animated.View>
          </GestureDetector>
        </GestureHandlerRootView>
      </View>
    </View>
  )
}
