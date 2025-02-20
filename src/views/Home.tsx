import React from 'react'
import { StyleSheet, View } from 'react-native'
import MainBackground from '../components/MainBackground'
import NormalText from '../components/Typography/NormalText'
import DeckBannerButton from '../components/DeckBannerButton'

export default function Home() {
  return (
    <MainBackground>
      <View style={styles.container}>
        <NormalText style={{ flex: 1, fontWeight: 'bold' }}>Continue</NormalText>
        <View style={{ flex: 1 }}>
          <NormalText style={{ fontWeight: 'bold' }}>New decks</NormalText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {[1, 2, 3].map((item) => (
              <View style={{ marginHorizontal: 5 }}>
                <DeckBannerButton key={item} title={`Deck ${item}`} />
              </View>
            ))}
          </View>
        </View>

        <NormalText style={{ flex: 1, fontWeight: 'bold' }}>Featured</NormalText>
      </View>
    </MainBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10
  }
})
