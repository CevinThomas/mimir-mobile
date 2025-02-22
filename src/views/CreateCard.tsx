import React, { useState } from 'react'
import { View } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useCreateDeckContext } from '../context/CreateDeckContext'
import { createCard, deleteCard, updateCard } from '../api/DecksApi'
import NormalText from '../components/Typography/NormalText'
import CustomTextInput from '../components/Forms/Input'
import MainBackground from '../components/MainBackground'
import FilledButton from '../components/Buttons/FilledButton'
import ClearButton from '../components/Buttons/ClearButton'
import Header from '../components/Header'

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
  const { state, dispatch } = useCreateDeckContext()
  const navigation = useNavigation()
  const [editingCard, setEditingCard] = useState(false)

  const onSaveCard = async () => {
    if (state.currentCard.id) {
      const response = await updateCard(state.id, state.currentCard.id, state.currentCard)
      dispatch({ type: 'UPDATE_CARD', card: response.data })
    } else {
      const response = await createCard(state.id, state.currentCard)
      dispatch({ type: 'ADD_CARD', card: response.data })
    }
    navigation.goBack()
  }

  const onUpdateCard = (key: string, value: string) => {
    dispatch({ type: 'UPDATE_CURRENT_CARD', key, value })
  }

  const onRemoveCard = async () => {
    if (state.currentCard.id) {
      const response = await deleteCard(state.id, state.currentCard.id)
      if (response.status === 200 || response.status === 204) {
        dispatch({ type: 'DELETE_CARD' })
        navigation.goBack()
      } else {
        alert('Failed to delete card')
      }
    }
  }

  const onChoiceInputPress = (index, text) => {
    dispatch({ type: 'UPDATE_CHOICE', index, text })
  }

  return (
    <MainBackground>
      <Header />
      <View style={{ flex: 3 }}>
        <View style={{ marginBottom: 30, paddingHorizontal: 10 }}>
          <NormalText style={{ fontWeight: 'bold' }}>Create Card</NormalText>
        </View>

        <CustomTextInput
          placeholder={'Question *'}
          value={state.currentCard.title}
          onChangeText={(text) => onUpdateCard('title', text)}
        />

        <CustomTextInput
          placeholder={'Explanation'}
          value={state.currentCard.explanation}
          onChangeText={(text) => onUpdateCard('explanation', text)}
        />
      </View>

      <View style={{ flex: 6 }}>
        <View style={{ marginBottom: 20, paddingHorizontal: 10 }}>
          <NormalText>Choices</NormalText>
        </View>
        <View>
          <View>
            <CustomTextInput
              onChangeText={(text) => onChoiceInputPress(0, text)}
              placeholder={'Choice 1'}
              value={state.currentCard.choices[0].title}
            />
          </View>
          <View>
            <CustomTextInput
              onChangeText={(text) => onChoiceInputPress(1, text)}
              placeholder={'Choice 2'}
              value={state.currentCard.choices[1].title}
            />
          </View>
          <View>
            <CustomTextInput
              onChangeText={(text) => onChoiceInputPress(2, text)}
              placeholder={'Choice 3'}
              value={state.currentCard.choices[2].title}
            />
          </View>
          <View>
            <CustomTextInput
              onChangeText={(text) => onChoiceInputPress(3, text)}
              placeholder={'Choice 4'}
              value={state.currentCard.choices[3].title}
            />
          </View>
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
    </MainBackground>
  )
}
