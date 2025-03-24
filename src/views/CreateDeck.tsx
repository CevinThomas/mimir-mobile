import React, { useEffect, useState } from 'react'
import { BackHandler, View } from 'react-native'
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native'
import { createDeck, deleteDeck, updateDeck } from '../api/DecksApi'
import MainBackground from '../components/MainBackground'
import CustomTextInput from '../components/Forms/Input'
import NormalText from '../components/Typography/NormalText'
import ClickButton from '../components/Buttons/ClickButton'
import SideActionButton from '../components/Buttons/SideActionButton'
import ClearButton from '../components/Buttons/ClearButton'
import Dropdown from '../components/Dropdown'
import { getFolders } from '../api/FoldersApi'
import Header from '../components/Header'
import CustomTextArea from '../components/Forms/TextArea'
import { useStoreContext } from '../context/StoreContext'
import CustomCheckBox from '../components/Forms/Checkbox'

export default function CreateDeck(props: {
  route: { params: { deck: { name: string; id: string } } }
}) {
  const navigation = useNavigation()
  const { state, dispatch } = useStoreContext()
  const [folders, setFolders] = useState([])

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
    const folders = await getFolders()
    setFolders(folders)
  }

  const onUpdateDeck = (key: string, value: string) => {
    dispatch({ type: 'UPDATE_DECK_KEY', key, value })
  }

  const onNavigateToCreateCard = async () => {
    if (!state.id) {
      const response = await createDeck({
        name: state.name,
        description: state.description,
        cards: state.cards,
        folder_ids: state.folder_ids,
        featured: state.featured
      })
      dispatch({ type: 'SET_DECK', response })
    }

    navigation.navigate('CreateCard')
  }

  const onSaveDeck = async () => {
    await updateDeck(state.id, {
      name: state.name,
      description: state.description,
      featured: state.featured
    })
    dispatch({ type: 'RESET' })
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home', params: { screen: 'Decks' } }]
      })
    )
  }

  const onGoBack = () => {
    dispatch({ type: 'RESET' })
    navigation.dispatch(CommonActions.goBack())
  }

  const onPublishDeck = async () => {
    await updateDeck(state.id, {
      name: state.name,
      description: state.description,
      active: !state.active,
      featured: state.featured
    })
    dispatch({ type: 'RESET' })
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: 'Home', params: { screen: 'Decks' } }] })
    )
  }

  return (
    <MainBackground>
      <Header />
      <CustomTextInput
        value={state.name}
        label={'Title'}
        onChangeText={(text) => onUpdateDeck('name', text)}
      />

      <CustomTextArea
        value={state.description}
        label={'Description'}
        onChangeText={(text) => onUpdateDeck('description', text)}
      />

      {state.user.role === 'admin' && (
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
            <SideActionButton onPress={() => onNavigateToCreateCard()}>Add card</SideActionButton>
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

      {state.id && (
        <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row', marginBottom: 20 }}>
          {/*
          <View style={{ flex: 2, justifyContent: 'flex-end' }}>
            <FilledButton onPress={onPublishDeck}>Publish deck</FilledButton>
          </View>
          */}

          {state.user.role === 'admin' && (
            <View>
              <ClearButton
                onPress={async () => {
                  await onPublishDeck()
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: 'Home', params: { screen: 'Decks' } }]
                    })
                  )
                }}
              >
                {state.active ? 'Unpublish deck' : 'Publish deck'}
              </ClearButton>
            </View>
          )}

          <View style={{ flex: 2, justifyContent: 'flex-end', paddingHorizontal: 5 }}>
            <ClearButton onPress={onSaveDeck}>Save deck</ClearButton>
          </View>
          <View>
            <ClearButton
              onPress={async () => {
                await deleteDeck(state.id)
                dispatch({ type: 'RESET' })
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Home', params: { screen: 'Decks' } }]
                  })
                )
              }}
            >
              Delete deck
            </ClearButton>
          </View>
        </View>
      )}
    </MainBackground>
  )
}
