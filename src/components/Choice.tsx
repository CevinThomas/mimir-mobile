import React, { useEffect, useState, memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { useTheme } from '../context/ThemeContext'
import { getColorProperty } from '../helpers'
import ChoiceButton from './Buttons/ChoiceButton'
import { CORRECT, WRONG, UNANSWERED } from '../constants/answerStates'
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  withDelay
} from 'react-native-reanimated'

function Choice({ choice, answeredChoice, answeredState, answerCard, index }) {
  const { theme } = useTheme()
  const [backgroundColor, setBackgroundColor] = useState()
  const [shouldRender, setShouldRender] = useState(true)

  // Animation values
  const opacity = useSharedValue(0)
  const translateY = useSharedValue(50)
  const translateX = useSharedValue(0)

  // Create animated style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value }
      ]
    }
  })

  // Entrance animation when component mounts
  useEffect(() => {
    // Stagger the animations based on index (100ms delay between each choice)
    const delay = (index || 0) * 100;

    // Animate in with a fade and slide up effect
    opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(delay, withTiming(0, { duration: 400 }));
  }, []);

  useEffect(() => {
    // Update background color based on answer state
    if (answeredState === CORRECT && answeredChoice) {
      setBackgroundColor('#6FC368')
    } else if (answeredState === WRONG && answeredChoice) {
      setBackgroundColor('#CF6679')
    } else {
      setBackgroundColor(getColorProperty(theme, 'inputBackground'))
    }

    // Animate out non-selected choices when an answer is selected
    if (answeredState !== UNANSWERED && !answeredChoice) {
      // Animate out
      opacity.value = withTiming(0, { duration: 300 })
      translateX.value = withTiming(100, { duration: 300 })

      // Remove from DOM after animation completes
      const timeout = setTimeout(() => {
        setShouldRender(false)
      }, 300)

      return () => clearTimeout(timeout)
    } else if (answeredState === UNANSWERED) {
      // Reset all animation values to trigger entrance animation again
      translateX.value = 0
      // Reset opacity and translateY to initial values
      opacity.value = 0
      translateY.value = 50
      setShouldRender(true)

      // Trigger entrance animation again with delay
      const delay = (index || 0) * 100;
      opacity.value = withDelay(delay, withTiming(1, { duration: 400 }));
      translateY.value = withDelay(delay, withTiming(0, { duration: 400 }));
    }
  }, [answeredChoice, answeredState, theme, opacity, translateX, translateY, index])

  // If the choice is empty or has no id, don't render anything
  if (!choice || !choice.id) {
    return null
  }

  // If the choice should not be rendered, return null
  if (!shouldRender) {
    return <View style={styles.container} />
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <ChoiceButton
        disabled={(answeredState === WRONG || answeredState === CORRECT) && !answeredChoice}
        backgroundColor={backgroundColor}
        onPress={() => answerCard(choice)}
      >
        {choice.title}
      </ChoiceButton>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8
  },

  button: {}
})

export default memo(Choice)
