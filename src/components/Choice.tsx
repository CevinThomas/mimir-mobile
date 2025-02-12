import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import MainButton from './Buttons/MainButton'
import { useTheme } from '../context/ThemeContext'
import { getColorProperty } from '../helpers'

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
      <MainButton
        key={choice.id}
        disabled={(answeredState === 1 || answeredState === 0) && !answeredChoice}
        disabledStyle={{ backgroundColor: backgroundColor }}
        buttonStyling={{
          backgroundColor: backgroundColor,
          borderRadius: 10,
          paddingVertical: 15,
          justifyContent: 'flex-start',
          paddingHorizontal: 10
        }}
        title={choice.title}
        titleProps={{ numberOfLines: 0 }}
        titleStyle={{
          color: getColorProperty(theme, 'text'),
          width: '60%',
          textAlign: 'left',
          fontSize: 14
        }}
        onPress={() => answerCard(choice)}
      ></MainButton>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10
  },

  button: {}
})
