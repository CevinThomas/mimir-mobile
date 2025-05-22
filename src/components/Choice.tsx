import React, { useEffect, useState, memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { useTheme } from '../context/ThemeContext'
import { getColorProperty } from '../helpers'
import ChoiceButton from './Buttons/ChoiceButton'
import { CORRECT, WRONG, UNANSWERED } from '../constants/answerStates'

function Choice({ choice, answeredChoice, answeredState, answerCard }) {
  const { theme } = useTheme()
  const [backgroundColor, setBackgroundColor] = useState()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Update background color based on answer state
    if (answeredState === CORRECT && answeredChoice) {
      setBackgroundColor('#6FC368')
    } else if (answeredState === WRONG && answeredChoice) {
      setBackgroundColor('#CF6679')
    } else {
      setBackgroundColor(getColorProperty(theme, 'inputBackground'))
    }

    // Update visibility based on answer state
    setVisible(answeredState === UNANSWERED || answeredChoice)
  }, [answeredChoice, answeredState, theme])

  // If the choice is empty or has no id, don't render anything
  if (!choice || !choice.id) {
    return null
  }

  // If the choice should not be visible, render an empty container to maintain layout
  if (!visible) {
    return <View style={styles.container} />
  }

  return (
    <View style={styles.container}>
      <ChoiceButton
        disabled={(answeredState === WRONG || answeredState === CORRECT) && !answeredChoice}
        backgroundColor={backgroundColor}
        onPress={() => answerCard(choice)}
      >
        {choice.title}
      </ChoiceButton>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8
  },

  button: {}
})

export default memo(Choice)
