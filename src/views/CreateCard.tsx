import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { createCard, deleteCard, updateCard } from '../api/DecksApi'
import NormalText from '../components/Typography/NormalText'
import CustomTextInput from '../components/Forms/Input'
import MainBackground from '../components/MainBackground'
import FilledButton from '../components/Buttons/FilledButton'
import ClearButton from '../components/Buttons/ClearButton'
import Header from '../components/Header'
import useSnackBar from '../hooks/useSnackBar'
import useErrorSnackbar from '../hooks/useErrorSnackbar'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'
import { useStoreContext } from '../context/StoreContext'
import ErrorMessage from '../components/Forms/ErrorMessage'
import useFormValidation from '../hooks/useFormValidation'

export default function CreateCard(props: {
  route: { params: { card: { name: string; id: string } } }
}) {
  const { state, dispatch } = useStoreContext()
  const navigation = useNavigation()
  const [editingCard, setEditingCard] = useState(false)
  const [showNewButton, setShowNewButton] = useState(false)

  const validationRules = {
    title: {
      required: true,
      errorMessage: 'Question is required'
    },
    choice1: {
      required: true,
      errorMessage: 'Choice 1 is required'
    },
    choice2: {
      required: true,
      errorMessage: 'Choice 2 is required'
    },
    choice3: {
      required: true,
      errorMessage: 'Choice 3 is required'
    },
    choice4: {
      required: true,
      errorMessage: 'Choice 4 is required'
    }
  }

  const { errors, validate, handleChange, setValues } = useFormValidation(
    {
      title: state.currentCard.title,
      choice1: state.currentCard.choices[0]?.title || '',
      choice2: state.currentCard.choices[1]?.title || '',
      choice3: state.currentCard.choices[2]?.title || '',
      choice4: state.currentCard.choices[3]?.title || ''
    },
    validationRules
  )

  useEffect(() => {
    setValues({
      title: state.currentCard.title,
      explanation: state.currentCard.explanation,
      choice1: state.currentCard.choices[0]?.title || '',
      choice2: state.currentCard.choices[1]?.title || '',
      choice3: state.currentCard.choices[2]?.title || '',
      choice4: state.currentCard.choices[3]?.title || ''
    })
  }, [
    state.currentCard.title,
    state.currentCard.explanation,
    state.currentCard.choices[0]?.title,
    state.currentCard.choices[1]?.title,
    state.currentCard.choices[2]?.title,
    state.currentCard.choices[3]?.title
  ])

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

  const onSaveCard = async () => {
    if (!validate()) {
      return
    }

    try {
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
    } catch (error) {
      showError(error.message || 'Failed to save card')
    }
  }

  const onNewCard = () => {
    dispatch({ type: 'CLEAR_CURRENT_CARD' })
    saveCardWith.value = 100
    setShowNewButton(false)
  }

  const onUpdateCard = (key: string, value: string) => {
    dispatch({ type: 'UPDATE_CURRENT_CARD', key, value })

    if (key === 'title') {
      handleChange('title', value)
    } else if (key === 'explanation') {
      handleChange('explanation', value)
    }
  }

  const onRemoveCard = async () => {
    if (state.currentCard.id) {
      try {
        const response = await deleteCard(state.id, state.currentCard.id)
        if (response.status === 200 || response.status === 204) {
          dispatch({ type: 'DELETE_CARD' })
          navigation.goBack()
        } else {
          showError('Failed to delete card')
        }
      } catch (error) {
        showError(error.message || 'Failed to remove card')
      }
    }
  }

  const onChoiceInputPress = (index, text) => {
    dispatch({ type: 'UPDATE_CHOICE', index, text })

    const fieldName = `choice${index + 1}`
    handleChange(fieldName, text)
  }

  const { show, hide, visible, snackBar } = useSnackBar()
  const { showError, errorSnackbar, visible: errorVisible } = useErrorSnackbar()

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

      <View style={{ flex: 2 }}>
        <View style={{ marginBottom: 20, paddingHorizontal: 10 }}>
          <NormalText style={{ fontWeight: 'bold' }}>Create Card</NormalText>
        </View>

        <View style={styles.choiceContainer}>
          <CustomTextInput
            label={'Question *'}
            value={state.currentCard.title}
            onChangeText={(text) => onUpdateCard('title', text)}
          />
          <ErrorMessage message={errors.title} visible={!!errors.title} />
        </View>

        <CustomTextInput
          label={'Explanation'}
          value={state.currentCard.explanation}
          onChangeText={(text) => onUpdateCard('explanation', text)}
        />
      </View>

      <KeyboardAvoidingView behavior={'padding'} style={{ flex: 5 }}>
        <View style={{ marginBottom: 20, paddingHorizontal: 10 }}>
          <NormalText style={{ fontWeight: 'bold' }}>Choices</NormalText>
        </View>
        <View>
          <View style={styles.choiceContainer}>
            <CustomTextInput
              style={{ borderWidth: 1, borderColor: '#6FC368' }}
              onChangeText={(text) => onChoiceInputPress(0, text)}
              label={'Choice 1 *'}
              value={state.currentCard.choices[0].title}
            />
            <ErrorMessage message={errors.choice1} visible={!!errors.choice1} />
          </View>
          <View style={styles.choiceContainer}>
            <CustomTextInput
              onChangeText={(text) => onChoiceInputPress(1, text)}
              label={'Choice 2 *'}
              value={state.currentCard.choices[1].title}
            />
            <ErrorMessage message={errors.choice2} visible={!!errors.choice2} />
          </View>
          <View style={styles.choiceContainer}>
            <CustomTextInput
              onChangeText={(text) => onChoiceInputPress(2, text)}
              label={'Choice 3 *'}
              value={state.currentCard.choices[2].title}
            />
            <ErrorMessage message={errors.choice3} visible={!!errors.choice3} />
          </View>
          <View style={styles.choiceContainer}>
            <CustomTextInput
              onChangeText={(text) => onChoiceInputPress(3, text)}
              label={'Choice 4 *'}
              value={state.currentCard.choices[3].title}
            />
            <ErrorMessage message={errors.choice4} visible={!!errors.choice4} />
          </View>
        </View>
      </KeyboardAvoidingView>

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
      {errorSnackbar()}
    </MainBackground>
  )
}

const styles = StyleSheet.create({
  choiceContainer: {
    marginBottom: 10
  }
})
