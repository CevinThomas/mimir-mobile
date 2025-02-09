import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text>Continue where you left off</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text>Newly added decks</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text>Featured decks</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})
