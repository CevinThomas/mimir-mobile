import React, { useEffect, useState } from 'react'
import { BackHandler, View } from 'react-native'
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native'
import { createDeck, deleteDeck, updateDeck } from '../api/DecksApi'
import { getFolders } from '../api/FoldersApi'
import useErrorSnackbar from '../hooks/useErrorSnackbar'
import MainBackground from '../components/MainBackground'
import CustomTextInput from '../components/Forms/Input'
import ClearButton from '../components/Buttons/ClearButton'
import Dropdown from '../components/Dropdown'
import Header from '../components/Header'
import CustomTextArea from '../components/Forms/TextArea'
import { useStoreContext } from '../context/StoreContext'
import CustomCheckBox from '../components/Forms/Checkbox'
import FilledButton from '../components/Buttons/FilledButton'
import NormalText from '../components/Typography/NormalText'
import SideActionButton from '../components/Buttons/SideActionButton'
import ClickButton from '../components/Buttons/ClickButton'
import ErrorMessage from '../components/Forms/ErrorMessage'
import useFormValidation from '../hooks/useFormValidation'

export default function CreateDeck(props: {
  route: { params: { deck: { name: string; id: string } } }
}) {
  const navigation = useNavigation()
  const { state, dispatch } = useStoreContext()
  const [folders, setFolders] = useState([])
  const { showError, errorSnackbar } = useErrorSnackbar()

  const validationRules = {
    name: {
      required: true,
      errorMessage: 'Title is required'
    }
  }

  const { errors, validate, handleChange, setValues } = useFormValidation(
    { name: state.name },
    validationRules
  )

  useEffect(() => {
    setValues({ name: state.name })
  }, [state.name])

  useEffect(() => {
    if (props.route.params?.deck) {
      dispatch({
        type: 'SET_DECK',
        response: {
          name: props.route.params.deck.name,
          description: props.route.params.deck.description,
          id: props.route.params.deck.id,
          cards: props.route.params.deck.cards,
          featured: props.route.params.deck.featured,
          active: props.route.params.deck.active
        }
      })
    }
    fetchFolders()
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        onGoBack()
        return true
      }
      BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
      }
    }, [])
  )

  const fetchFolders = async () => {
    try {
      const folders = await getFolders()
      setFolders(folders)
    } catch (error) {
      showError(error.message || 'Failed to fetch folders')
    }
  }

  const onUpdateDeck = (key: string, value: string) => {
    dispatch({ type: 'UPDATE_DECK_KEY', key, value })

    if (key === 'name') {
      handleChange('name', value)
    }
  }

  const onCreateDeck = async () => {
    if (!validate(['name'])) {
      return
    }

    try {
      const response = await createDeck({
        name: state.name,
        description: state.description,
        cards: state.cards,
        folder_ids: state.folder_ids,
        featured: false
      })
      dispatch({ type: 'SET_DECK', response })
    } catch (error) {
      showError(error.message || 'Failed to create deck')
    }
  }

  const onSaveDeck = async () => {
    if (!validate(['name'])) {
      return
    }

    try {
      await updateDeck(state.id, {
        name: state.name,
        description: state.description,
        featured: state.featured,
        folder_ids: state.folder_ids
      })
      dispatch({ type: 'RESET' })
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Decks' }]
        })
      )
    } catch (error) {
      showError(error.message || 'Failed to save deck')
    }
  }

  const onGoBack = () => {
    dispatch({ type: 'RESET' })
    navigation.dispatch(CommonActions.goBack())
  }

  const onPublishDeck = async () => {
    try {
      await updateDeck(state.id, {
        name: state.name,
        description: state.description,
        active: !state.active,
        featured: state.featured
      })
      dispatch({ type: 'RESET' })
      navigation.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: 'Decks' }] })
      )
    } catch (error) {
      showError(error.message || 'Failed to publish deck')
    }
  }

  return (
    <MainBackground>
      <Header />
      <CustomTextInput
        value={state.name}
        label={'Title *'}
        onChangeText={(text) => onUpdateDeck('name', text)}
      />
      <ErrorMessage message={errors.name} visible={!!errors.name} />

      <CustomTextArea
        value={state.description}
        label={'Description'}
        onChangeText={(text) => onUpdateDeck('description', text)}
      />

      {state.user.role === 'admin' && state.id && (
        <CustomCheckBox
          label={'Featured'}
          onPress={() => {
            dispatch({ type: 'UPDATE_DECK_KEY', key: 'featured', value: !state.featured })
          }}
          checked={state.featured}
        />
      )}

      {folders.length > 0 && (
        <View>
          <Dropdown
            unSelect={(value) => dispatch({ type: 'REMOVE_FOLDER_ID', id: value })}
            onChange={(value) => dispatch({ type: 'ADD_FOLDER_ID', id: value })}
            items={folders}
          />
        </View>
      )}

      {state.id && (
        <View style={{ flex: 3, padding: 10 }}>
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
              <SideActionButton onPress={() => navigation.navigate('CreateCard')}>
                Add card
              </SideActionButton>
            </View>
          </View>
          <View style={{ flex: 5 }}>
            {state.cards?.map((card, index) => (
              <View style={{ marginBottom: 10 }} key={index}>
                <ClickButton onPress={() => navigation.navigate('CreateCard', { card: card })}>
                  {card.title}
                </ClickButton>
              </View>
            ))}
          </View>
        </View>
      )}

      {!state.id && (
        <View>
          <FilledButton fontSize={16} onPress={onCreateDeck}>
            Create deck
          </FilledButton>
        </View>
      )}

      {state.id && (
        <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row', marginBottom: 20 }}>
          {state.user.role === 'admin' && !state.active && (
            <View>
              <ClearButton
                onPress={async () => {
                  await onPublishDeck()
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: 'Decks' }]
                    })
                  )
                }}
              >
                Publish deck
              </ClearButton>
            </View>
          )}

          <View style={{ flex: 2, justifyContent: 'flex-end', paddingHorizontal: 5 }}>
            <ClearButton onPress={onSaveDeck}>
              {state.active ? 'Update deck' : 'Save draft'}
            </ClearButton>
          </View>
          <View>
            <ClearButton
              onPress={async () => {
                try {
                  await deleteDeck(state.id)
                  dispatch({ type: 'RESET' })
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: 'Decks' }]
                    })
                  )
                } catch (error) {
                  showError(error.message || 'Failed to delete deck')
                }
              }}
            >
              Delete deck
            </ClearButton>
          </View>
        </View>
      )}
      {errorSnackbar()}
    </MainBackground>
  )
}
