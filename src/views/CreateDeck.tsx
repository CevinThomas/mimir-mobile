import React, { useEffect } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import { CommonActions, useNavigation } from '@react-navigation/native'
import { useCreateDeckContext } from '../context/CreateDeckContext'
import { createDeck, updateDeck } from '../api/DecksApi'

export default function CreateDeck(props: {
  route: { params: { deck: { name: string; id: string } } }
}) {
  useEffect(() => {
    if (props.route.params?.deck) {
      console.log(props.route.params.deck)
      dispatch({
        type: 'SET_DECK',
        response: {
          name: props.route.params.deck.name,
          description: props.route.params.deck.description,
          id: props.route.params.deck.id,
          cards: props.route.params.deck.cards
        }
      })
    }
  }, [])
  const { state, dispatch } = useCreateDeckContext()
  const navigation = useNavigation()

  const onUpdateDeck = (key: string, value: string) => {
    dispatch({ type: 'UPDATE_DECK_KEY', key, value })
  }

  const onNavigateToCreateCard = async () => {
    if (!state.deckId) {
      const response = await createDeck({
        name: state.deckName,
        description: state.deckDescription,
        cards: state.deckCards
      })
      console.log(response)
      dispatch({ type: 'SET_DECK', response })
    }

    navigation.navigate('CreateCard')
  }

  const onSaveDeck = async () => {
    await updateDeck(state.deckId, { name: state.deckName, description: state.deckDescription })
    dispatch({ type: 'RESET' })
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'Home', params: { screen: 'Decks' } }] })
    )
  }

  const onGoBack = () => {
    dispatch({ type: 'RESET' })
    navigation.dispatch(CommonActions.goBack())
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
      {state.deckCards?.map((card, index) => (
        <View key={index}>
          <Button
            onPress={() => navigation.navigate('CreateCard', { card: card })}
            title={card.title}
          />
        </View>
      ))}
      <Button title="Add Card" onPress={onNavigateToCreateCard} />
      {state.deckCards?.length > 0 && <Button title="Save Deck" onPress={onSaveDeck} />}
      {!state.deckCards?.length > 0 && <Button title="Back" onPress={onGoBack} />}
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
