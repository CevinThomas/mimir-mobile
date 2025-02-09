import React, { useRef, useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet } from 'react-native'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { useCreateDeckContext } from '../context/CreateDeckContext'
import { createDeck } from '../api/DecksApi'

export default function CreateDeck() {
  const { state, dispatch } = useCreateDeckContext()
  const navigation = useNavigation()

  const onUpdateDeck = (key: string, value: string) => {
    dispatch({ type: 'UPDATE_DECK_KEY', key, value })
  }

  const onSaveDeck = async () => {
    console.log({
      name: state.deckName,
      description: state.deckDescription,
      cards: state.deckCards
    })
    await createDeck({
      name: state.deckName,
      description: state.deckDescription,
      cards: state.deckCards
    })

    dispatch({ type: 'RESET' })
    navigation.replace('Home', { screen: 'Decks' })
  }

  return (
    <View style={styles.container}>
      <Text>Deck Name</Text>
      <TextInput
        value={state.deckName}
        style={styles.input}
        onChangeText={(text) => onUpdateDeck('deckName', text)}
      />
      <Text>Deck Description</Text>
      <TextInput
        value={state.deckDescription}
        style={styles.input}
        onChangeText={(text) => onUpdateDeck('deckDescription', text)}
      />
      {state.deckCards.map((card, index) => (
        <View key={index}>
          <Button title={card.title} />
        </View>
      ))}
      <Button title="Add Card" onPress={() => navigation.navigate('CreateCard')} />
      <Button title="Create Deck" onPress={onSaveDeck} />
      <Button title="Clear" onPress={() => dispatch({ type: 'RESET' })} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10
  },
  contentContainer: {
    flex: 1,
    padding: 36
  }
})
