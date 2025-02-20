import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Button } from '@rneui/base'
import NormalText from './Typography/NormalText'
import DeckBannerBackground from '../svgs/DeckBannerBackground'

export default function DeckBannerButton({ title }) {
  return (
    <View>
      <DeckBannerBackground />
      <Button buttonStyle={styles.buttonContainer}>
        <View>
          <NormalText>{title}</NormalText>
        </View>
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10
  },
  text: {
    flex: 1,
    fontWeight: 'bold'
  },
  buttonContainer: {
    backgroundColor: 'transparent',
    marginVertical: 5,
    padding: 10,
    borderRadius: 10
  }
})
