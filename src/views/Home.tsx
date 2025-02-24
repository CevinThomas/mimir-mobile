import React, { useLayoutEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import MainBackground from '../components/MainBackground'
import NormalText from '../components/Typography/NormalText'
import { getNewDecks } from '../api/DecksApi'

export default function Home() {
  const [newDecks, setNewDecks] = useState([])

  useLayoutEffect(() => {
    const fetchNewDecks = async () => {
      const response = await getNewDecks()
      setNewDecks(response)
    }
    fetchNewDecks()
  }, [])

  return (
    <MainBackground noSpace>
      <View style={styles.container}>
        <NormalText style={{ flex: 1, fontWeight: 'bold' }}>Continue</NormalText>
        <View style={{ flex: 1 }}>
          <NormalText style={{ fontWeight: 'bold' }}>New decks</NormalText>
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
