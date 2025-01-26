import { StatusBar } from 'expo-status-bar'
import { Button, StyleSheet, Text, View } from 'react-native'
import { useEffect } from 'react'

export default function App() {
  const fetchDecks = async () => {
    const response = await fetch(`http://localhost:3001/api/admin/v1/decks`)
    console.log(response)
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app</Text>
      <StatusBar style="auto" />
      <Button title={'Fetch Decks'} onPress={fetchDecks}></Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
