import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import MainBackground from '../components/MainBackground'
import NormalText from '../components/Typography/NormalText'

export default function Home() {
  return (
    <MainBackground>
      <View style={styles.container}>
        <NormalText style={{ flex: 1, fontWeight: 'bold' }}>
          <Text>Continue</Text>
        </NormalText>
        <NormalText style={{ flex: 1, fontWeight: 'bold' }}>
          <Text>New decks</Text>
        </NormalText>
        <NormalText style={{ flex: 1, fontWeight: 'bold' }}>
          <Text>Featured</Text>
        </NormalText>
      </View>
    </MainBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
