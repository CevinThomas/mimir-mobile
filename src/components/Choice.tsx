import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useTheme } from '../context/ThemeContext'
import { getColorProperty } from '../helpers'
import ChoiceButton from './Buttons/ChoiceButton'

export default function Choice({ choice, answeredChoice, answeredState, answerCard }) {
  const { theme } = useTheme()
  const [backgroundColor, setBackgroundColor] = useState()

  useEffect(() => {
    if (answeredState === 0 && answeredChoice) {
      return setBackgroundColor('#6FC368')
    }
    if (answeredState === 1 && answeredChoice) {
      return setBackgroundColor('#CF6679')
    }
    setBackgroundColor(getColorProperty(theme, 'inputBackground'))
  }, [answeredChoice, answeredState])
  return (
    <View style={styles.container}>
      <ChoiceButton
        disabled={(answeredState === 1 || answeredState === 0) && !answeredChoice}
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
