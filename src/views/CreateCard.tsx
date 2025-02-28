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
import useSnackBar from '../hooks/useSnackBar'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'

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
  const [showNewButton, setShowNewButton] = useState(false)

  const onSaveCard = async () => {
    if (state.currentCard.id) {
      const response = await updateCard(state.id, state.currentCard.id, state.currentCard)
      dispatch({ type: 'UPDATE_CARD', card: response.data })
    } else {
      const response = await createCard(state.id, state.currentCard)
      dispatch({ type: 'ADD_CARD', card: response.data })
    }
    setShowNewButton(true)
    saveCardWith.value = 50
    show('Card has been saved')
    setTimeout(() => {
      hide()
    }, 1000)
  }

  const onNewCard = () => {
    dispatch({ type: 'CLEAR_CURRENT_CARD' })
    saveCardWith.value = 100
    setShowNewButton(false)
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

  const { show, hide, visible, snackBar } = useSnackBar()

  const saveCardWith = useSharedValue(100)

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1)
  }

  const saveCardStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(`${saveCardWith.value}%`, config)
    }
  })

  return (
    <MainBackground>
      <Header />
      <View style={{ flex: 3 }}>
        <View style={{ marginBottom: 30, paddingHorizontal: 10 }}>
          <NormalText style={{ fontWeight: 'bold' }}>Create Card</NormalText>
        </View>

        <CustomTextInput
          label={'Question *'}
          value={state.currentCard.title}
          onChangeText={(text) => onUpdateCard('title', text)}
        />

        <CustomTextInput
          label={'Explanation'}
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
              style={{ borderWidth: 1, borderColor: '#6FC368' }}
              onChangeText={(text) => onChoiceInputPress(0, text)}
              label={'Choice 1'}
              value={state.currentCard.choices[0].title}
            />
          </View>
          <View>
            <CustomTextInput
              onChangeText={(text) => onChoiceInputPress(1, text)}
              label={'Choice 2'}
              value={state.currentCard.choices[1].title}
            />
          </View>
          <View>
            <CustomTextInput
              onChangeText={(text) => onChoiceInputPress(2, text)}
              label={'Choice 3'}
              value={state.currentCard.choices[2].title}
            />
          </View>
          <View>
            <CustomTextInput
              onChangeText={(text) => onChoiceInputPress(3, text)}
              label={'Choice 4'}
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

        <View style={{ flexDirection: 'row' }}>
          <Animated.View style={[saveCardStyle]}>
            <FilledButton onPress={onSaveCard}>Save card</FilledButton>
          </Animated.View>
          {showNewButton && (
            <View style={{ width: '50%' }}>
              <FilledButton onPress={onNewCard}>New card</FilledButton>
            </View>
          )}
        </View>
      </View>
      {visible && snackBar()}
    </MainBackground>
  )
}
