import React, { useRef, useState } from 'react'
import { Alert, Button, Text, TextInput, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { CheckBox } from '@rneui/themed'
import { useFocusEffect, useNavigation, usePreventRemove } from '@react-navigation/native'
import { useCreateDeckContext } from '../context/CreateDeckContext'
import {
  createCard,
  createChoice,
  deleteCard,
  deleteChoice,
  updateCard,
  updateChoice
} from '../api/DecksApi'

export default function CreateCard(props: {
  route: { params: { card: { name: string; id: string } } }
}) {
  useFocusEffect(
    React.useCallback(() => {
      if (props.route.params?.card) {
        setEditingCard(true)
        dispatch({ type: 'SET_CURRENT_CARD', card: props.route.params.card })
      }
      return () => {
        dispatch({ type: 'CLEAR_CURRENT_CARD' })
      }
    }, [])
  )
  const navigation = useNavigation()
  const { state, dispatch } = useCreateDeckContext()
  const [editingCard, setEditingCard] = useState(false)
  const [editingChoice, setEditingChoice] = useState(false)
  usePreventRemove(false, ({ data }) => {
    Alert.alert(
      'Discard changes?',
      'You have unsaved changes. Discard them and leave the screen?',
      [
        { text: "Don't leave", style: 'cancel', onPress: () => {} },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            dispatch({ type: 'CLEAR_CURRENT_CARD' })
            navigation.dispatch(data.action)
          }
        }
      ]
    )
  })
  const [addingChoice, setAddingChoice] = useState(false)
  const [currentChoice, setCurrentChoice] = useState({
    title: '',
    description: '',
    correct: false
  })
  const bottomSheetRef = useRef<BottomSheet>(null)

  const handleClose = () => {
    bottomSheetRef.current?.close()
    setCurrentChoice({ title: '', description: '', correct: false })
    setAddingChoice(false)
  }

  const onSaveChoice = async () => {
    if (!state.currentCard.id) {
      const response = await createCard(state.deckId, state.currentCard)
      dispatch({
        type: 'ADD_CARD',
        card: {
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          explanation: response.data.explanation,
          choices: response.data.choices
        }
      })
      dispatch({
        type: 'SET_CURRENT_CARD',
        card: {
          id: response.data.id,
          title: response.data.title,
          description: response.data.description,
          explanation: response.data.explanation,
          choices: response.data.choices
        }
      })

      const choiceResponse = await createChoice(state.deckId, response.data.id, currentChoice)
      dispatch({ type: 'ADD_CHOICE', choice: choiceResponse.data })
    } else {
      if (editingChoice) {
        const response = await updateChoice(
          state.deckId,
          state.currentCard.id,
          currentChoice.id,
          currentChoice
        )
        dispatch({ type: 'UPDATE_CHOICE', choice: response.data })
        setEditingChoice(false)
      } else {
        const response = await createChoice(state.deckId, state.currentCard.id, currentChoice)
        dispatch({ type: 'ADD_CHOICE', choice: response.data })
      }
    }

    bottomSheetRef.current?.close()
    setAddingChoice(false)
    setCurrentChoice({ title: '', description: '', correct: false })
  }

  const onSaveCard = async () => {
    if (state.currentCard.id) {
      const response = await updateCard(state.deckId, state.currentCard.id, state.currentCard)
      dispatch({ type: 'UPDATE_CARD', card: response.data })
    } else {
      console.log(state)
      const response = await createCard(state.deckId, state.currentCard)
      dispatch({ type: 'ADD_CARD', card: response.data })
    }
    navigation.goBack()
  }

  const onUpdateChoice = (key: string, value: string) => {
    setCurrentChoice({ ...currentChoice, [key]: value })
  }

  const onUpdateCard = (key: string, value: string) => {
    dispatch({ type: 'UPDATE_CURRENT_CARD', key, value })
  }

  const onRemoveCard = async () => {
    if (state.currentCard.id) {
      const response = await deleteCard(state.deckId, state.currentCard.id)
      if (response.status === 200 || response.status === 204) {
        dispatch({ type: 'DELETE_CARD' })
        navigation.goBack()
      } else {
        alert('Failed to delete card')
      }
    }
  }

  const onEditChoicePress = (id: string) => {
    const choice = state.currentCard.choices.find((choice) => choice.id === id)
    console.log('CHOICE TO EDIT', choice)

    if (choice) {
      setCurrentChoice(choice)
      setAddingChoice(true)
      setEditingChoice(true)
      bottomSheetRef.current?.expand()
    }
  }

  const onRemoveChoicePress = async () => {
    if (state.currentCard.id && currentChoice.id) {
      const response = await deleteChoice(state.deckId, state.currentCard.id, currentChoice.id)
      if (response.status === 200 || response.status === 204) {
        dispatch({ type: 'DELETE_CHOICE', choice: currentChoice })
        setCurrentChoice({ title: '', description: '', correct: false })
        setEditingChoice(false)
        setAddingChoice(false)
        bottomSheetRef.current?.close()
      } else {
        alert('Failed to delete choice')
      }
    }
  }

  const onAddChoice = () => {
    setAddingChoice(true)
  }

  return (
    <GestureHandlerRootView>
      <Text>Create Card</Text>
      <Text>Card Title</Text>
      <TextInput
        value={state.currentCard.title}
        style={styles.input}
        onChangeText={(text) => onUpdateCard('title', text)}
      />
      <Text>Card Description</Text>
      <TextInput
        value={state.currentCard.description}
        style={styles.input}
        onChangeText={(text) => onUpdateCard('description', text)}
      />
      {state.currentCard.choices.length > 0 &&
        state.currentCard.choices.map((choice, index) => (
          <View key={index}>
            <Button onPress={() => onEditChoicePress(choice.id)} title={choice.title} />
          </View>
        ))}
      <Button title={'Add choice'} onPress={onAddChoice} />
      <Button title="Save Card" onPress={onSaveCard} />
      {editingCard && <Button title={'Remove card'} onPress={onRemoveCard} />}
      {addingChoice && (
        <BottomSheet
          ref={bottomSheetRef}
          onClose={handleClose}
          enablePanDownToClose={true}
          enableDynamicSizing={false}
          index={0}
          snapPoints={['100%', '100%']}
        >
          <BottomSheetView style={styles.contentContainer}>
            <Text>Choice Name</Text>
            <TextInput
              value={currentChoice.title}
              style={styles.input}
              onChangeText={(text) => onUpdateChoice('name', text)}
            />
            <Text>Choice Title</Text>
            <TextInput
              value={currentChoice.title}
              style={styles.input}
              onChangeText={(text) => onUpdateChoice('title', text)}
            />
            <CheckBox
              title="Correct"
              checked={currentChoice.correct}
              onPress={() =>
                setCurrentChoice({ ...currentChoice, correct: !currentChoice.correct })
              }
              iconType="material-community"
              checkedIcon="checkbox-marked"
              uncheckedIcon="checkbox-blank-outline"
              checkedColor="red"
            />
            <Button title="Save choice" onPress={onSaveChoice} />
            {editingChoice && <Button onPress={onRemoveChoicePress} title={'Remove choice'} />}
          </BottomSheetView>
        </BottomSheet>
      )}
    </GestureHandlerRootView>
  )
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    margin: 10
  },
  contentContainer: {
    padding: 36
  }
}
