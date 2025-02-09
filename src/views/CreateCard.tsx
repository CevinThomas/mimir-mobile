import React, { useEffect, useRef, useState } from 'react'
import { View, Text, TextInput, Button, Alert } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import { CheckBox } from '@rneui/themed'
import { useNavigation, usePreventRemove } from '@react-navigation/native'
import { useCreateDeckContext } from '../context/CreateDeckContext'

export default function CreateCard(props: {
  route: { params: { deck: { name: string; id: string } } }
}) {
  const navigation = useNavigation()
  const { state, dispatch } = useCreateDeckContext()
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
  const bottomSheetRef = useRef<BottomSheet>(null)
  const [currentCard, setCurrentCard] = useState({
    title: '',
    description: '',
    explanation: '',
    choices: []
  })
  const [currentChoice, setCurrentChoice] = useState({
    title: '',
    description: '',
    correct: false
  })

  const [choices, setChoices] = useState([])

  const handleClose = () => {
    bottomSheetRef.current?.close()
    setAddingChoice(false)
  }

  const onSaveChoice = () => {
    setCurrentChoice({ title: '', description: '', correct: false })
    dispatch({ type: 'ADD_CHOICE', choice: currentChoice })
    bottomSheetRef.current?.close()
    setAddingChoice(false)
  }

  const onSaveCard = () => {
    dispatch({ type: 'ADD_CARD' })
    navigation.goBack()
  }

  const onUpdateChoice = (key: string, value: string) => {
    setCurrentChoice({ ...currentChoice, [key]: value })
  }

  const onUpdateCard = (key: string, value: string) => {
    dispatch({ type: 'UPDATE_CURRENT_CARD', key, value })
  }

  return (
    <GestureHandlerRootView>
      <Text>Create Card</Text>
      <Text>Card Title</Text>
      <TextInput style={styles.input} onChangeText={(text) => onUpdateCard('title', text)} />
      <Text>Card Description</Text>
      <TextInput style={styles.input} onChangeText={(text) => onUpdateCard('description', text)} />
      {state.currentCard.choices.length > 0 &&
        state.currentCard.choices.map((choice, index) => (
          <View key={index}>
            <Button title={choice.title} />
          </View>
        ))}
      <Button title={'Add choice'} onPress={() => setAddingChoice(true)} />
      <Button title="Save Card" onPress={onSaveCard} />
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
            <TextInput style={styles.input} onChangeText={(text) => onUpdateChoice('name', text)} />
            <Text>Choice Title</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => onUpdateChoice('title', text)}
            />
            <CheckBox
              title="Correct"
              checked={currentChoice.correct}
              onPress={(value) =>
                setCurrentChoice({ ...currentChoice, correct: !currentChoice.correct })
              }
              iconType="material-community"
              checkedIcon="checkbox-marked"
              uncheckedIcon="checkbox-blank-outline"
              checkedColor="red"
            />
            <Button title="Save choice" onPress={onSaveChoice} />
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
