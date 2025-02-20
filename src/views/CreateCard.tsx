import React, { useRef, useState } from 'react'
import { Alert, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
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
import NormalText from '../components/Typography/NormalText'
import CustomTextInput from '../components/Forms/Input'
import MainBackground from '../components/MainBackground'
import ClickButton from '../components/Buttons/ClickButton'
import { getColorProperty } from '../helpers'
import { useTheme } from '../context/ThemeContext'
import CustomCheckBox from '../components/Forms/Checkbox'
import SideActionButton from '../components/Buttons/SideActionButton'
import FilledButton from '../components/Buttons/FilledButton'
import ClearButton from '../components/Buttons/ClearButton'

export default function CreateCard(props: {
  route: { params: { card: { name: string; id: string } } }
}) {
  const { theme } = useTheme()
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
    correct: false
  })
  const bottomSheetRef = useRef<BottomSheet>(null)

  const handleClose = () => {
    bottomSheetRef.current?.close()
    setCurrentChoice({ title: '', correct: false })
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
          explanation: response.data.explanation,
          choices: response.data.choices
        }
      })
      dispatch({
        type: 'SET_CURRENT_CARD',
        card: {
          id: response.data.id,
          title: response.data.title,
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
    <MainBackground>
      <GestureHandlerRootView>
        <View style={{ flex: 3 }}>
          <View style={{ marginBottom: 30, paddingHorizontal: 10 }}>
            <NormalText style={{ fontWeight: 'bold' }}>Create Card</NormalText>
          </View>

          <CustomTextInput
            label={'Question *'}
            value={state.currentCard.title}
            style={styles.input}
            onChangeText={(text) => onUpdateCard('title', text)}
          />

          <CustomTextInput
            label={'Explanation'}
            value={state.currentCard.explanation}
            style={styles.input}
            onChangeText={(text) => onUpdateCard('explanation', text)}
          />
        </View>

        <View style={{ flex: 6, padding: 10 }}>
          <View
            style={{
              flex: 3,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <View>
              <NormalText>Choices</NormalText>
            </View>
            <View>
              <SideActionButton onPress={onAddChoice}>Add choice</SideActionButton>
            </View>
          </View>
          <View style={{ flex: 10 }}>
            {state.currentCard.choices.length > 0 &&
              state.currentCard.choices.map((choice, index) => {
                const background = choice.correct
                  ? '#6FC368'
                  : getColorProperty(theme, 'inputBackground')
                return (
                  <View style={{ marginBottom: 10 }} key={index}>
                    <ClickButton
                      background={background}
                      onPress={() => onEditChoicePress(choice.id)}
                    >
                      {choice.title}
                    </ClickButton>
                  </View>
                )
              })}
          </View>
        </View>

        <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 20 }}>
          {editingCard && (
            <View style={{ marginBottom: 10 }}>
              <ClearButton onPress={onRemoveCard}>Remove card</ClearButton>
            </View>
          )}
          <FilledButton onPress={onSaveCard}>Save card</FilledButton>
        </View>

        {addingChoice && (
          <BottomSheet
            backgroundStyle={{ backgroundColor: getColorProperty(theme, 'background') }}
            ref={bottomSheetRef}
            onClose={handleClose}
            enablePanDownToClose={true}
            enableDynamicSizing={false}
            index={0}
            snapPoints={['100%', '100%']}
          >
            <BottomSheetView style={styles.contentContainer}>
              <View style={{ flex: 1 }}>
                <CustomTextInput
                  label={'Choice Title'}
                  value={currentChoice.title}
                  onChangeText={(text) => onUpdateChoice('title', text)}
                />
                <CustomCheckBox
                  label="Correct"
                  checked={currentChoice.correct}
                  onPress={() =>
                    setCurrentChoice({ ...currentChoice, correct: !currentChoice.correct })
                  }
                  iconType="material-community"
                  checkedIcon="checkbox-marked"
                  uncheckedIcon="checkbox-blank-outline"
                />
              </View>

              <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 20 }}>
                {editingChoice && (
                  <View style={{ marginBottom: 10 }}>
                    <FilledButton onPress={onRemoveChoicePress}>Remove choice</FilledButton>
                  </View>
                )}
                <ClearButton onPress={onSaveChoice}>Add choice</ClearButton>
              </View>
            </BottomSheetView>
          </BottomSheet>
        )}
      </GestureHandlerRootView>
    </MainBackground>
  )
}

const styles = {
  contentContainer: {
    flex: 1
  }
}
