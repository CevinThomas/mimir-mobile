import React, { useEffect } from 'react'
import { Button, StyleSheet, View } from 'react-native'
import { CommonActions, useNavigation } from '@react-navigation/native'
import { useCreateDeckContext } from '../context/CreateDeckContext'
import { createDeck, updateDeck } from '../api/DecksApi'
import MainBackground from '../components/MainBackground'
import CustomTextInput from '../components/Forms/Input'
import NormalText from '../components/Typography/NormalText'
import MainButton from '../components/Buttons/MainButton'
import ClickButton from '../components/Buttons/ClickButton'

export default function CreateDeck(props: {
  route: { params: { deck: { name: string; id: string } } }
}) {
  useEffect(() => {
    if (props.route.params?.deck) {
      dispatch({
        type: 'SET_DECK',
        response: {
          name: props.route.params.deck.name,
          description: props.route.params.deck.description,
          id: props.route.params.deck.id,
          cards: props.route.params.deck.cards,
          active: props.route.params.deck.active
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

  const onPublishDeck = async () => {
    await updateDeck(state.deckId, {
      name: state.deckName,
      description: state.deckDescription,
      active: true
    })
    dispatch({ type: 'RESET' })
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'Home', params: { screen: 'Decks' } }] })
    )
  }

  return (
    <MainBackground>
      <CustomTextInput label={'Title'} onChangeText={(text) => onUpdateDeck('deckName', text)} />

      <CustomTextInput
        label={'Description'}
        style={{ height: 100 }}
        onChangeText={(text) => onUpdateDeck('deckDescription', text)}
      />
      <View style={{ flex: 1, padding: 10 }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <View>
            <NormalText>Cards</NormalText>
          </View>
          <View>
            <MainButton
              buttonStyling={{ paddingHorizontal: 0 }}
              titleStyling={{ fontSize: 12 }}
              type={'filled'}
              title="Add Card"
              onPress={() => onNavigateToCreateCard()}
            />
          </View>
        </View>
        <View style={{ flex: 5 }}>
          {state.deckCards?.map((card, index) => (
            <View style={{ flex: 1 }} key={index}>
              <ClickButton onPress={() => navigation.navigate('CreateCard', { card: card })}>
                {card.title}
              </ClickButton>
            </View>
          ))}
        </View>
      </View>

      {state.deckCards?.length > 0 && <Button title="Save Deck" onPress={onSaveDeck} />}
      {state.deckCards.length > 0 && !state.active && (
        <Button title="Publish deck" onPress={onPublishDeck} />
      )}
      {!state.deckCards?.length > 0 && <Button title="Back" onPress={onGoBack} />}
      <Button title={'Ignore changes'} onPress={onGoBack} />
    </MainBackground>
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
